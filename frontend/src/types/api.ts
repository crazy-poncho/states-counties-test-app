export type StateSummary = {
  state: string;
  population: number;
  counties: number;
  detail: string;
};

export type CountySummary = {
  county: string;
  population: number;
};

export type StateDetail = StateSummary & {
  countyList: CountySummary[];
};
