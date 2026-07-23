import { app } from "./app.js";
import { prisma } from "./lib/prisma.js";

const port = Number(process.env.PORT ?? 3000);

async function main(): Promise<void> {
  app.listen(port, () => {
    console.log(`Backend listening on port ${port}`);
  });
}

main().catch(async (err) => {
  console.error("Failed to start server:", err);
  await prisma.$disconnect();
  process.exit(1);
});

async function shutdown(): Promise<void> {
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => {
  void shutdown();
});
process.on("SIGTERM", () => {
  void shutdown();
});
