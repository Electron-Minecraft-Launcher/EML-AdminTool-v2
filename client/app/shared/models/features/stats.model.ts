import { varchar } from "../types";

export interface Stats {
  id?: number,
  dates: varchar,
  startup: number,
  launching: number,
  new_players: number
}
