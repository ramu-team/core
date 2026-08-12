import { prisma } from '@ramu/db';

export async function logAdminAction({
  adminId,
  action,
  entity,
  entityId,
  details,
}: {
  adminId: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: import('@prisma/client').Prisma.InputJsonValue;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        admin_id: adminId,
        action,
        entity,
        entity_id: entityId,
        details: details || undefined,
      },
    });
  } catch (error) {
    console.error('[logAdminAction] Error creating audit log:', error);
    // Don't throw here to avoid failing the main business logic
  }
}
