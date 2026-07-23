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

type SeedOptions = {
  dataDir: string;
  /** When true, wipe and re-import even if states already exist. */
  force: boolean;
};

function resolveOptions(argv: string[]): SeedOptions {
  // Skip node and script path; support `tsx seed.ts -- <dir>`, `--force`, and bare `<dir>`.
  const args = argv.slice(2).filter((arg) => arg !== "--");
  const force = args.includes("--force");
  const override = args.find((arg) => arg !== "--force");
  return {
    dataDir: path.resolve(override ?? defaultDataDir),
    force,
  };
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

async function seed({ dataDir, force }: SeedOptions): Promise<void> {
  const statesPath = path.join(dataDir, "USA-states.json");
  const countiesDir = path.join(dataDir, "states");

  await assertExists(statesPath, "States file");
  await assertExists(countiesDir, "Counties directory");

  const existingCount = await prisma.state.count();
  if (existingCount > 0 && !force) {
    console.log(`Skipping seed: ${existingCount} states already present (pass --force to re-import).`);
    return;
  }

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
  await seed(resolveOptions(process.argv));
}

main()
  .catch((err: unknown) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
