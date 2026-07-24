import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { stateDetailUrl } from "../lib/urls.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function listStates(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const states = await prisma.state.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { counties: true },
        },
      },
    });

    res.json(
      states.map((state) => ({
        state: state.name,
        population: state.population,
        counties: state._count.counties,
        detail: stateDetailUrl(state.name, req),
      })),
    );
  } catch (err) {
    next(err);
  }
}

export async function getStateDetail(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const rawName = req.params.name;
    const nameParam = Array.isArray(rawName) ? rawName[0] : rawName;
    const name = decodeURIComponent(nameParam ?? "");

    if (!name) {
      throw new HttpError(400, "State name is required");
    }

    const state = await prisma.state.findUnique({
      where: { name },
      include: {
        counties: {
          orderBy: { name: "asc" },
          select: {
            name: true,
            population: true,
          },
        },
      },
    });

    if (!state) {
      throw new HttpError(404, `State "${name}" not found`);
    }

    res.json({
      state: state.name,
      population: state.population,
      counties: state.counties.length,
      detail: stateDetailUrl(state.name, req),
      countyList: state.counties.map((county) => ({
        county: county.name,
        population: county.population,
      })),
    });
  } catch (err) {
    next(err);
  }
}