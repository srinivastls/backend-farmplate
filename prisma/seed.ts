import { PrismaClient, UserRole } from "@prisma/client";

import { categories } from "./data/categories";
import { farmers } from "./data/farmers";
import { farms } from "./data/farms";
import { products } from "./data/products";
import { banners } from "./data/banners";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting FarmPlate Seed...");

  // -----------------------------
  // Clear Database
  // -----------------------------

  await prisma.traceEvent.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.impact.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.category.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.user.deleteMany();

  console.log("✅ Database cleared");

  // -----------------------------
  // Categories
  // -----------------------------

  const categoryMap = new Map<string, string>();

  for (const category of categories) {
    const created = await prisma.category.create({
      data: category,
    });

    categoryMap.set(category.name, created.id);
  }

  console.log("✅ Categories inserted");

  // -----------------------------
  // Banners
  // -----------------------------

  for (const banner of banners) {
    await prisma.banner.create({
      data: {
        ...banner,
        isActive: true,
      },
    });
  }

  console.log("✅ Banners inserted");

  // -----------------------------
  // Farmers + Users + Farms
  // -----------------------------

  const farmMap = new Map<string, string>();

  for (let i = 0; i < farmers.length; i++) {
    const farmerData = farmers[i];
    const farmData = farms[i];

    const user = await prisma.user.create({
      data: {
        name: farmerData.name,
        email: farmerData.email,
        password: "password123",
        role: UserRole.FARMER,
      },
    });

    const farmer = await prisma.farmer.create({
      data: {
        userId: user.id,
        farmName: farmerData.farmName,
        about: farmerData.about,
        rating: farmerData.rating,
        verified: true,
      },
    });

    const farm = await prisma.farm.create({
      data: {
        farmerId: farmer.id,
        name: farmData.name,
        description: farmData.description,
        address: farmData.address,
        latitude: farmData.latitude,
        longitude: farmData.longitude,
        image: "",
      },
    });

    farmMap.set(farm.name, farm.id);
  }

  console.log("✅ Farmers & Farms inserted");

  // -----------------------------
  // Products
  // -----------------------------

  let lotCounter = 1000;

  for (const product of products) {
    await prisma.product.create({
      data: {
        farmId: farmMap.get(product.farm)!,

        categoryId: categoryMap.get(product.category)!,

        name: product.name,

        description: product.description,

        image: "",

        organic: product.organic,

        price: product.price,

        quantity: product.quantity,

        unit: product.unit,

        harvestTime: new Date(),

        lotId: `LOT-${lotCounter++}`,
      },
    });
  }

  console.log("✅ Products inserted");

  console.log("");
  console.log("🎉 FarmPlate database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });