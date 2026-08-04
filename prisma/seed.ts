import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  
await prisma.address.createMany({
  data: [
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      label: "Home",
      name: "Rahul Customer",
      phone: "9876500010",
      addressLine1: "12-45 MG Road",
      addressLine2: "Near Benz Circle",
      city: "Vijayawada",
      state: "Andhra Pradesh",
      pincode: "520010",
      latitude: 16.5062,
      longitude: 80.6480,
      isDefault: true,
    },
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      label: "Office",
      name: "Rahul Customer",
      phone: "9876500010",
      addressLine1: "IT Park",
      addressLine2: "Mangalagiri",
      city: "Guntur",
      state: "Andhra Pradesh",
      pincode: "522503",
      latitude: 16.4300,
      longitude: 80.5600,
      isDefault: false,
    },
  ],
});

console.log("✅ Addresses Seeded");

const favoriteProducts = await prisma.product.findMany({
  take: 5,
});

await prisma.favorite.createMany({
  data: favoriteProducts.map((product) => ({
    userId: "cmsefuvgs0000kb1mgm6jj8oi",
    productId: product.id,
  })),
  skipDuplicates: true,
});

console.log("✅ Favorites Seeded");

await prisma.notification.createMany({
  data: [
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      title: "Welcome to FarmPlate 🌾",
      message: "Start exploring fresh rice and cereals directly from Andhra Pradesh farmers.",
      type: "SYSTEM",
    },
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      title: "Exclusive Offer",
      message: "Get 10% OFF on your first rice order.",
      type: "OFFER",
    },
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      title: "Trace Your Food",
      message: "Every order includes complete farm-to-table traceability.",
      type: "SYSTEM",
    },
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      title: "New Harvest Available",
      message: "Fresh Sona Masoori Rice has arrived from Krishna Delta Farms.",
      type: "OFFER",
    },
    {
      userId: "cmsefuvgs0000kb1mgm6jj8oi",
      title: "Order Delivered",
      message: "Your previous FarmPlate order was delivered successfully.",
      type: "ORDER",
      isRead: true,
    },
  ],
});

console.log("✅ Notifications Seeded");


await prisma.impact.upsert({
  where: {
    userId: "cmsefuvgs0000kb1mgm6jj8oi",
  },
  update: {},
  create: {
    userId: "cmsefuvgs0000kb1mgm6jj8oi",
    co2Saved: 38.6,
    foodMilesSaved: 285.4,
    waterSaved: 620,
    farmersSupported: 3,
  },
});

console.log("✅ Impact Seeded");

}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });