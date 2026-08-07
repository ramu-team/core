import { prisma } from '../src/client.js';

async function main() {
  console.log('🌱 Memulai proses seeding data Dummy Kiosk...');

  // 1. Clean up old data (optional, be careful in production)
  await prisma.recipe.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.machineStock.deleteMany();
  await prisma.ingredient.deleteMany();
  await prisma.symptomOption.deleteMany();
  console.log('🧹 Data lama berhasil dibersihkan.');

  // 2. Create Ingredients
  const jahe = await prisma.ingredient.create({ data: { name: 'Bubuk Jahe Merah', unit: 'g' } });
  const kunyit = await prisma.ingredient.create({ data: { name: 'Bubuk Kunyit', unit: 'g' } });
  const berasKencur = await prisma.ingredient.create({ data: { name: 'Bubuk Beras Kencur', unit: 'g' } });
  const asamJawa = await prisma.ingredient.create({ data: { name: 'Bubuk Asam Jawa', unit: 'g' } });
  const gulaAren = await prisma.ingredient.create({ data: { name: 'Gula Aren Bubuk', unit: 'g' } });
  console.log('✅ Bahan baku berhasil dibuat.');

  // 3. Create Menus & Recipes
  const kunyitAsam = await prisma.menu.create({
    data: {
      name: 'Kunyit Asam Segar',
      description: 'Perpaduan sempurna kunyit dan asam jawa. Sangat baik untuk detoksifikasi dan meredakan nyeri haid.',
      price: 15000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: kunyit.id, amountMl: 10 },
          { ingredient_id: asamJawa.id, amountMl: 10 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });

  const menuBerasKencur = await prisma.menu.create({
    data: {
      name: 'Beras Kencur Spesial',
      description: 'Ramuan penghilang lelah dan pegal linu. Mengembalikan stamina setelah beraktivitas seharian.',
      price: 18000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: berasKencur.id, amountMl: 20 },
          { ingredient_id: jahe.id, amountMl: 5 },
        ],
      },
    },
  });

  const wedangJahe = await prisma.menu.create({
    data: {
      name: 'Wedang Jahe Hangat',
      description: 'Ekstrak jahe merah asli dengan pemanis alami gula aren. Sangat efektif untuk masuk angin dan melegakan tenggorokan.',
      price: 12000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: jahe.id, amountMl: 15 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });

  const detoksAsam = await prisma.menu.create({
    data: {
      name: 'Detoks Asam Jawa',
      description: 'Kesegaran murni dari asam jawa berkualitas untuk memurnikan pencernaan dan melancarkan metabolisme tubuh Anda.',
      price: 13000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: asamJawa.id, amountMl: 15 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });

  const goldenKunyit = await prisma.menu.create({
    data: {
      name: 'Golden Kunyit Murni',
      description: 'Sari kunyit pekat yang kaya antioksidan. Rahasia kecantikan dan daya tahan tubuh prima sepanjang hari.',
      price: 14000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: kunyit.id, amountMl: 15 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });

  const kencurAsam = await prisma.menu.create({
    data: {
      name: 'Kencur Asam Segar',
      description: 'Perpaduan langka beras kencur dan asam jawa. Memberikan sensasi hangat sekaligus menyegarkan yang unik.',
      price: 16000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: berasKencur.id, amountMl: 10 },
          { ingredient_id: asamJawa.id, amountMl: 10 },
          { ingredient_id: gulaAren.id, amountMl: 5 },
        ],
      },
    },
  });

  const jaheKunyit = await prisma.menu.create({
    data: {
      name: 'Imun Booster Jahe Kunyit',
      description: 'Kombinasi kuat rempah jahe merah dan kunyit. Benteng pertahanan utama melawan flu dan kelelahan.',
      price: 18000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: jahe.id, amountMl: 10 },
          { ingredient_id: kunyit.id, amountMl: 10 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });

  const ramuSignature = await prisma.menu.create({
    data: {
      name: 'Ramu Signature Blend',
      description: 'Racikan maha karya (Masterpiece) khas Ramu. Menggabungkan khasiat jahe, kunyit, dan asam jawa dalam harmoni sempurna.',
      price: 25000,
      isActive: true,
      recipes: {
        create: [
          { ingredient_id: jahe.id, amountMl: 5 },
          { ingredient_id: kunyit.id, amountMl: 5 },
          { ingredient_id: asamJawa.id, amountMl: 5 },
          { ingredient_id: gulaAren.id, amountMl: 10 },
        ],
      },
    },
  });
  console.log('✅ Katalog Menu Jamu berhasil dibuat.');

  // 4. Create Symptoms for AI Consultation
  // Categories must exactly match Admin configuration: immunity, digestion, fatigue & aches, others
  await prisma.symptomOption.createMany({
    data: [
      { name: 'Masuk Angin', category: 'immunity', icon: '🥶', isActive: true },
      { name: 'Sakit Tenggorokan', category: 'immunity', icon: '🔥', isActive: true },
      { name: 'Batuk & Flu', category: 'immunity', icon: '🤧', isActive: true },

      { name: 'Mual & Kembung', category: 'digestion', icon: '🤢', isActive: true },
      { name: 'Sakit Perut', category: 'digestion', icon: '😖', isActive: true },
      { name: 'Asam Lambung', category: 'digestion', icon: '🤢', isActive: true },

      { name: 'Pegal Linu', category: 'fatigue & aches', icon: '⚡', isActive: true },
      { name: 'Kurang Tenaga', category: 'fatigue & aches', icon: '🔋', isActive: true },
      { name: 'Otot Kaku', category: 'fatigue & aches', icon: '😫', isActive: true },

      { name: 'Nyeri Haid', category: 'others', icon: '🩸', isActive: true },
      { name: 'Sulit Tidur', category: 'others', icon: '🥱', isActive: true },
      { name: 'Sakit Kepala', category: 'others', icon: '🤕', isActive: true },
    ],
  });
  console.log('✅ Data Gejala Penyakit (AI) berhasil dibuat.');

  console.log('🎉 Seeding Selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
