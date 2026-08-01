import { PrismaClient, TraceEventType } from "@prisma/client";

const prisma = new PrismaClient();

const traceTemplate = [
  {
    eventType: TraceEventType.SOWING,
    title: "Seed Sowing",
    description: "Seeds sown using organic methods",
    temperature: 29,
    humidity: 71,
    handledBy: "Ramesh",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    eventType: TraceEventType.IRRIGATION,
    title: "Irrigation",
    description: "Drip irrigation completed",
    temperature: 28,
    humidity: 78,
    handledBy: "Ramesh",
    latitude: 12.9717,
    longitude: 77.5948,
  },
  {
    eventType: TraceEventType.FERTILIZER,
    title: "Organic Fertilizer",
    description: "Compost applied",
    temperature: 31,
    humidity: 62,
    handledBy: "Ramesh",
    latitude: 12.9719,
    longitude: 77.5950,
  },
  {
    eventType: TraceEventType.HARVESTED,
    title: "Harvested",
    description: "Crop harvested successfully",
    temperature: 32,
    humidity: 59,
    handledBy: "Farm Team",
    latitude: 12.9722,
    longitude: 77.5953,
  },
  {
    eventType: TraceEventType.QUALITY_CHECK,
    title: "Quality Check",
    description: "Passed inspection",
    handledBy: "Quality Team",
  },
  {
    eventType: TraceEventType.HUB_RECEIVED,
    title: "Hub Received",
    description: "Received at distribution hub",
    handledBy: "Warehouse",
  },
  {
    eventType: TraceEventType.OUT_FOR_DELIVERY,
    title: "Out for Delivery",
    description: "Dispatched to customer",
    handledBy: "Delivery Partner",
  },
  {
    eventType: TraceEventType.DELIVERED,
    title: "Delivered",
    description: "Delivered successfully",
    handledBy: "Delivery Partner",
  },
];

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
    },
  });

  console.log(`Found ${products.length} products`);

  // Uncomment if you want to reseed every time
  // await prisma.traceEvent.deleteMany();

  const now = new Date();

  for (const product of products) {
    for (let i = 0; i < traceTemplate.length; i++) {
      const event = traceTemplate[i];

      await prisma.traceEvent.create({
        data: {
          productId: product.id,
          eventType: event.eventType,
          title: event.title,
          description: event.description,
          temperature: event.temperature,
          humidity: event.humidity,
          latitude: event.latitude,
          longitude: event.longitude,
          handledBy: event.handledBy,
          createdAt: new Date(
            now.getTime() - (traceTemplate.length - i) * 24 * 60 * 60 * 1000
          ),
        },
      });
    }

    console.log(`✔ Seeded traces for ${product.id}`);
  }

  console.log(
    `Done! Created ${products.length * traceTemplate.length} trace events.`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });