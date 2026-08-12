import { NextResponse } from 'next/server';
import { prisma } from '@ramu/db';
import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtts://d763ca9eaaaf4650b898cd2c362b6eba.s1.eu.hivemq.cloud:8883';
const topicPrefix = process.env.NEXT_PUBLIC_MQTT_TOPIC_PREFIX || 'ramu-kiosk-prod';
const username = process.env.NEXT_PUBLIC_MQTT_USERNAME;
const password = process.env.NEXT_PUBLIC_MQTT_PASSWORD;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, menuId, customRecipe, consultationId } = body;

    if (!machineId) {
      return NextResponse.json({ error: 'machineId is required' }, { status: 400 });
    }

    let ingredientAmounts: { ingredient_id: string; amountMl: number }[] = [];

    // Parse the requested recipe
    if (menuId) {
      const menu = await prisma.menu.findUnique({
        where: { id: menuId },
        include: { recipes: true }
      });
      
      if (!menu) {
        return NextResponse.json({ error: 'Menu not found' }, { status: 404 });
      }
      
      ingredientAmounts = menu.recipes.map(r => ({
        ingredient_id: r.ingredient_id,
        amountMl: r.amountMl
      }));
    } else if (consultationId) {
      // For AI Consultation custom recipes fetched from DB
      const consultation = await prisma.consultationHistory.findUnique({
        where: { id: consultationId }
      });
      
      if (!consultation || !consultation.aiCustomRecipe) {
        return NextResponse.json({ error: 'Consultation or custom recipe not found' }, { status: 404 });
      }
      
      const aiRecipe = consultation.aiCustomRecipe as { recipe?: unknown[] };
      if (aiRecipe.recipe && Array.isArray(aiRecipe.recipe)) {
        ingredientAmounts = aiRecipe.recipe as { ingredient_id: string, amountMl: number }[];
      } else {
        return NextResponse.json({ error: 'Invalid custom recipe format' }, { status: 400 });
      }
    } else if (customRecipe && Array.isArray(customRecipe)) {
      // Fallback for direct customRecipe array
      ingredientAmounts = customRecipe;
    } else {
      return NextResponse.json({ error: 'menuId, consultationId, or customRecipe is required' }, { status: 400 });
    }

    // Map ingredients to machine tanks
    const machineStocks = await prisma.machineStock.findMany({
      where: { machine_id: machineId }
    });

    const tanksPayload: Record<string, number> = {};
    for (const item of ingredientAmounts) {
      const stock = machineStocks.find(s => s.ingredient_id === item.ingredient_id);
      
      if (!stock) {
        // If the ingredient is not available in the machine, we can't brew it
        console.warn(`Ingredient ${item.ingredient_id} not found in machine ${machineId}`);
        return NextResponse.json(
          { error: `Machine is missing an ingredient for this recipe.` }, 
          { status: 400 }
        );
      }
      
      tanksPayload[stock.tankNumber.toString()] = item.amountMl;
    }

    // Connect to MQTT and publish the command
    const client = mqtt.connect(brokerUrl, {
      username,
      password,
    });
    const orderId = `ORD-${Date.now()}`;
    
    await new Promise<void>((resolve, reject) => {
      // Timeout to avoid hanging requests if broker is down
      const timeout = setTimeout(() => {
        client.end();
        reject(new Error('MQTT connection timeout'));
      }, 5000);

      client.on('connect', () => {
        clearTimeout(timeout);
        const topic = `${topicPrefix}/machine/${machineId}/brew`;
        const payload = JSON.stringify({
          action: 'brew',
          orderId: orderId,
          tanks: tanksPayload
        });
        
        console.log(`Publishing to MQTT [${topic}]:`, payload);
        
        client.publish(topic, payload, (err) => {
          client.end();
          if (err) reject(err);
          else resolve();
        });
      });
      
      client.on('error', (err) => {
        clearTimeout(timeout);
        client.end();
        reject(err);
      });
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Brew command sent to machine',
      orderId 
    });

  } catch (error: unknown) {
    console.error('Brewing API error:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
