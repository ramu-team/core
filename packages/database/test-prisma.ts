import { prisma } from '@ramu/db';

async function main() {
  console.log("Testing Prisma insert...");
  try {
    const result = await prisma.ingredient.create({
      data: {
        nama_bahan: "Test Ingredient " + Date.now(),
        satuan: "ml"
      }
    });
    console.log("Insert success!", result);
  } catch (error) {
    console.error("Prisma error:", error);
  }
}
main().finally(() => process.exit(0));
