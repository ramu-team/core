'use server';

import { prisma } from '@ramu/db';
import { auth } from '@/lib/auth/server';
import { headers } from 'next/headers';
import { OrderHistoryItem } from '@/store/user-store';

export async function syncUser() {
  const { data: session } = await auth.getSession({
    headers: await headers() // Next.js 15+ headers await
  });
  
  if (!session?.user) {
    return null;
  }
  
  let user = await prisma.user.findUnique({
    where: { neon_auth_user_id: session.user.id }
  });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        neon_auth_user_id: session.user.id,
        is_guest: false,
        name: session.user.name || null,
        email: session.user.email || null,
        avatar_url: session.user.image || null,
      }
    });
  } else {
    if (user.name !== session.user.name || user.avatar_url !== session.user.image) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          name: session.user.name || null,
          avatar_url: session.user.image || null,
        }
      });
    }
  }
  
  return user;
}

export async function saveOrder(
  machineId: string, 
  menuId: string,
  price: number
) {
  const user = await syncUser();
  if (!user) {
    return { success: false, error: 'User not logged in' };
  }

  try {
    const order = await prisma.order.create({
      data: {
        user_id: user.id,
        machine_id: machineId,
        menu_id: menuId,
        total_price: price,
        status: 'Pending',
        is_custom_ai: false
      }
    });
    
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Failed to save order to DB', error);
    return { success: false, error: 'DB Error' };
  }
}

export async function syncLocalHistory(localItems: OrderHistoryItem[], activeMachineId: string) {
  const user = await syncUser();
  if (!user || !localItems || localItems.length === 0) {
    return { success: false };
  }

  try {
    // We only process items that look like they need syncing (this is a simplified merge)
    // Normally we'd check if they already exist, but for now we just insert missing menus based on name
    
    const existingOrders = await prisma.order.findMany({
      where: { user_id: user.id }
    });

    const existingConsultations = await prisma.consultationHistory.findMany({
      where: { user_id: user.id }
    });

    // Count how many we synced to avoid infinite loops if client keeps sending
    let syncedCount = 0;

    for (const item of localItems) {
      if (item.type === 'menu') {
        // Very rough check: if we already have an order created around this timestamp, skip
        const exists = existingOrders.some(o => Math.abs(o.createdAt.getTime() - item.timestamp) < 60000);
        if (!exists) {
          // Find menu ID by title
          const menu = await prisma.menu.findFirst({ where: { name: item.title } });
          if (menu) {
            await prisma.order.create({
              data: {
                user_id: user.id,
                machine_id: activeMachineId || 'unknown',
                menu_id: menu.id,
                total_price: menu.price,
                createdAt: new Date(item.timestamp)
              }
            });
            syncedCount++;
          }
        }
      } else if (item.type === 'ai') {
        const exists = existingConsultations.some(c => Math.abs(c.createdAt.getTime() - item.timestamp) < 60000);
        if (!exists) {
          await prisma.consultationHistory.create({
            data: {
              user_id: user.id,
              machine_id: activeMachineId || 'unknown',
              complaintText: item.description,
              createdAt: new Date(item.timestamp)
            }
          });
          syncedCount++;
        }
      }
    }
    
    return { success: true, syncedCount };
  } catch (error) {
    console.error('Failed to sync history', error);
    return { success: false };
  }
}

export async function getUserHistory(): Promise<OrderHistoryItem[]> {
  const user = await syncUser();
  if (!user) return [];

  const orders = await prisma.order.findMany({
    where: { user_id: user.id },
    include: { menu: true },
    orderBy: { createdAt: 'desc' }
  });

  const consultations = await prisma.consultationHistory.findMany({
    where: { user_id: user.id },
    orderBy: { createdAt: 'desc' }
  });

  const mappedOrders: OrderHistoryItem[] = orders.map(o => ({
    id: o.id,
    type: 'menu',
    title: o.menu?.name || 'Pesanan Tidak Diketahui',
    description: o.menu?.description || 'Pesanan jamu dari katalog',
    timestamp: o.createdAt.getTime(),
  }));

  const mappedConsults: OrderHistoryItem[] = consultations.map(c => ({
    id: c.id,
    type: 'ai',
    title: 'Konsultasi AI',
    description: c.complaintText || 'Rekomendasi dari pakar AI Ramu',
    timestamp: c.createdAt.getTime(),
  }));

  const combined = [...mappedOrders, ...mappedConsults].sort((a, b) => b.timestamp - a.timestamp);
  
  return combined;
}
