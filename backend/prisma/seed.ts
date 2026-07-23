import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataDir = path.join(__dirname, "data");

type StateSeed = {
  state: string;
  population: number;
  counties: number;
};

type CountySeed = {
  county: string;
  population: number;
};

function resolveDataDir(argv: string[]): string {
  // Skip node and script path; support `tsx seed.ts -- <dir>` and bare `<dir>`.
  const args = argv.slice(2).filter((arg) => arg !== "--");
  const override = args[0];
  return path.resolve(override ?? defaultDataDir);
}

async function assertExists(filePath: string, label: string): Promise<void> {
  try {
    await access(filePath);
  } catch {
    throw new Error(`${label} not found: ${filePath}`);
  }
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function seed(dataDir: string): Promise<void> {
  const statesPath = path.join(dataDir, "USA-states.json");
  const countiesDir = path.join(dataDir, "states");

  await assertExists(statesPath, "States file");
  await assertExists(countiesDir, "Counties directory");

  const states = await readJson<StateSeed[]>(statesPath);

  console.log(`Seeding ${states.length} states from ${statesPath}`);

  // Idempotent re-seed: counties cascade-delete with states.
  await prisma.county.deleteMany();
  await prisma.state.deleteMany();

  let countyTotal = 0;

  for (const entry of states) {
    const countiesPath = path.join(countiesDir, `${entry.state}.json`);
    const counties = await readJson<CountySeed[]>(countiesPath);

    if (counties.length !== entry.counties) {
      throw new Error(
        `County count mismatch for ${entry.state}: expected ${entry.counties}, found ${counties.length} in ${countiesPath}`,
      );
    }

    await prisma.state.create({
      data: {
        name: entry.state,
        population: entry.population,
        counties: {
          create: counties.map((county) => ({
            name: county.county,
            population: county.population,
          })),
        },
      },
    });

    countyTotal += counties.length;
    console.log(`  ${entry.state}: ${counties.length} counties`);
  }

  console.log(`Done. Inserted ${states.length} states and ${countyTotal} counties.`);
}

async function main(): Promise<void> {
  const dataDir = resolveDataDir(process.argv);
  await seed(dataDir);
}

main()
  .catch((err: unknown) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
