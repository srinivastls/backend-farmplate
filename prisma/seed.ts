// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("123456789", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@farmplate.com",
    },
    update: {},
    create: {
      name: "Admin",
      email: "admin@farm2plate.live",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Admin user created");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());