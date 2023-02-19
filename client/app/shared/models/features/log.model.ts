import { varchar } from "../types";

export interface Log {
  id?: number,
  date?: varchar,
  place?: varchar,
  type?: varchar,
  data?: string
}
