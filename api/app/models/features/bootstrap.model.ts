import { varchar } from "./types";

export interface Bootstrap {
  id?: number,
  win?: varchar,
  mac?: varchar,
  lin?: varchar,
  version?: varchar
}
