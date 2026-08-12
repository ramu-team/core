import { NextResponse } from 'next/server';
import { prisma } from '@ramu/db';
import { GoogleGenAI, Type, Schema } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// The response schema we expect from Gemini
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { machineId, symptoms } = body;

    if (!machineId) {
      return NextResponse.json({ error: 'machineId is required' }, { status: 400 });
    }

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return NextResponse.json({ error: 'Minimal pilih 1 keluhan' }, { status: 400 });
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
      // Check if every recipe ingredient in this menu has enough stock in the machine
      if (menu.recipes.length === 0) return false;
      return menu.recipes.every(recipe => availableIngredientIds.has(recipe.ingredient_id));
    });

    if (availableMenus.length === 0) {
      return NextResponse.json({ 
        error: 'Maaf, stok bahan di mesin saat ini tidak mencukupi untuk meracik jamu apapun.',
        code: 'OUT_OF_STOCK' 
      }, { status: 400 });
    }

    // Format available menus for the prompt
    const availableMenusText = availableMenus.map(menu => {
      return `- [ID: ${menu.id}] ${menu.name} (Deskripsi: ${menu.description})`;
    }).join('\n');

    // 4. Fetch full symptom names from database
    const symptomRecords = await prisma.symptomOption.findMany({
      where: { id: { in: symptoms } }
    });
    const symptomNames = symptomRecords.map(s => s.name).join(', ');

    // 5. Construct prompt for Gemini
    // Strict AI System Prompt that only suggests menus from the available list
    const systemInstruction = `
      You are Ramu AI Mixologist, an expert in traditional Indonesian herbal drinks (Jamu).
      Your task is to recommend exactly ONE menu from the provided list that best matches the user's symptoms/complaints.

      CRITICAL RULES:
      1. You MUST ONLY select from the provided 'AVAILABLE MENUS'.
      2. You MUST return a valid JSON object strictly matching the requested schema.
      3. Your 'explanation' must be a single, friendly sentence (Max 15 words).
      
      Keluhan pelanggan saat ini: ${symptomNames}
      
      Daftar menu jamu yang TERSEDIA di mesin saat ini (pilih HANYA dari daftar ini):
      ${availableMenusText}
    `;

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: systemInstruction,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('AI returned empty response');
    }

    const aiRecipe = JSON.parse(resultText);

    // Get history ID from query string
    // In Kiosk flow, we can just create a Guest User on the fly to attach the consultation history.
    let user = await prisma.user.findFirst({ where: { is_guest: true } });
    if (!user) {
      user = await prisma.user.create({ data: { is_guest: true } });
    }

    // Get consultation history data
    const consultation = await prisma.consultationHistory.create({
      data: {
        selected_symptoms: symptoms,
        recommendedMenuId: aiRecipe.recommendedMenuId,
        aiCustomRecipe: { explanation: aiRecipe.explanation }, // Store explanation here
        user_id: user.id,
        machine_id: machineId,
      }
    });

    return NextResponse.json({ 
      success: true, 
      consultationId: consultation.id,
      menuId: aiRecipe.recommendedMenuId
    });

  } catch (error: unknown) {
    console.error('AI Recommend API error:', error);
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
