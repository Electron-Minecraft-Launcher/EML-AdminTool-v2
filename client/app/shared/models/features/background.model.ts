import { tinyint, varchar } from "../types";

export interface Backgroud {
  id?: number,
  title?: varchar,
  status: tinyint
}
