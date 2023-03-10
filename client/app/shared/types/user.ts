import { JwtPayload } from "jsonwebtoken";
import { tinyint, varchar } from "./types";

export interface User {
  id?: number,
  name?: varchar,
  password?: varchar,
  status?: tinyint,
  admin?: tinyint,
  p_files_updater_add_del?: tinyint,
  p_bootstrap_mod?: tinyint,
  p_maintenance_mod?: tinyint,
  p_news_add?: tinyint,
  p_news_mod_del?: tinyint,
  p_news_category_add_mod_del?: tinyint,
  p_news_tag_add_mod_del?: tinyint,
  p_background_mod?: tinyint,
  p_stats_see: tinyint,
  p_stats_del?: tinyint
}

export type UserJWT = JwtPayload & User
