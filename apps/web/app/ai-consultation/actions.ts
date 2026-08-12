'use server';

import { prisma } from '@ramu/db';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    recommendedMenuId: {
      type: Type.STRING,
      description: "ID dari menu jamu terdaftar yang direkomendasikan. Harus sama persis dengan salah satu ID menu yang diberikan."
    },
    explanation: {
      type: Type.STRING,
      description: "One short, friendly, and direct sentence explaining why this jamu is suitable. (Max 15 words)"
    }
  },
  required: ["recommendedMenuId", "explanation"]
};

export async function recommendAIAction({
  machineId,
  symptoms,
  customCondition
}: {
  machineId: string;
  symptoms: string[];
  customCondition?: string;
}) {
  try {
    if (!machineId) {
      return { success: false, error: 'machineId is required' };
    }

    if ((!symptoms || symptoms.length === 0) && !customCondition) {
      return { success: false, error: 'Minimal pilih 1 keluhan atau isi keluhan tambahan' };
    }

    // 1. Fetch Machine Stock to know available ingredients
    const machineStocks = await prisma.machineStock.findMany({
      where: { machine_id: machineId, current_volume: { gt: 10 } }
    });
    const availableIngredientIds = new Set(machineStocks.map(stock => stock.ingredient_id));

    // 2. Fetch all Menus with Recipes
    const allMenus = await prisma.menu.findMany({
      include: { recipes: true }
    });

    // Filter menus based on machine stock availability
    const availableMenus = allMenus.filter(menu => {
      if (menu.recipes.length === 0) return false;
      return menu.recipes.every(recipe => availableIngredientIds.has(recipe.ingredient_id));
    });

    if (availableMenus.length === 0) {
      return { success: false, error: 'Maaf, stok bahan di mesin saat ini tidak mencukupi untuk meracik jamu apapun.' };
    }

    const availableMenuOptions = availableMenus.map(m => ({
      id: m.id,
      name: m.name,
      description: m.description
    }));

    // 3. Prompt Gemini
    let promptText = `
    Anda adalah AI Mixologist Jamu Tradisional di sebuah mesin Kiosk.
    Tugas Anda adalah merekomendasikan SATU menu jamu yang PALING TEPAT berdasarkan keluhan pelanggan.
    
    Keluhan yang dipilih: ${symptoms.join(', ') || 'Tidak ada keluhan prasetel'}
    Keluhan tambahan/spesifik: ${customCondition || 'Tidak ada'}
    
    Berikut adalah daftar menu jamu yang TERSEDIA saat ini:
    ${JSON.stringify(availableMenuOptions, null, 2)}
    
    Pilih satu menu yang paling sesuai.
    Berikan alasan singkat (max 15 kata) yang ramah dan langsung ke sasaran.
    Pastikan Anda membalas sesuai dengan JSON schema yang diminta.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3,
      }
    });

    if (!response.text) throw new Error('AI returned empty response');
    const result = JSON.parse(response.text);

    const chosenMenu = availableMenus.find(m => m.id === result.recommendedMenuId);
    if (!chosenMenu) {
       throw new Error('AI merekomendasikan menu yang tidak valid');
    }

    // 4. Save to Database
    const aiConsultation = await prisma.consultationHistory.create({
      data: {
        machine_id: machineId,
        selected_symptoms: symptoms,
        complaintText: customCondition,
        aiCustomRecipe: {
          explanation: result.explanation,
          recipe: {
            name: chosenMenu.name,
            description: chosenMenu.description,
            image: chosenMenu.image_url,
            ingredients: chosenMenu.recipes.map(r => ({
               ingredient_id: r.ingredient_id,
               amountMl: r.amountMl
            }))
          }
        }
      }
    });

    return {
      success: true,
      data: {
        consultationId: aiConsultation.id,
        menuId: chosenMenu.id,
        explanation: result.explanation,
        recipe: {
          name: chosenMenu.name,
          description: chosenMenu.description,
          image: chosenMenu.image_url,
        }
      }
    };

  } catch (error: any) {
    console.error('AI Recommendation Error:', error);
    return { success: false, error: error.message || 'Terjadi kesalahan saat menghubungi AI' };
  }
}
