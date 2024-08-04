export interface User {
  /**
   * In the JWT as `sub`
   */
  id?: number
  /**
   * In the JWT
   */
  name?: string
  /**
   * Not in the JWT
   */
  password?: string
  /**
   * Not in the JWT
   *
   * ` 1` Accepted
   *
   * ` 0` Waiting for acceptation
   *
   * `-1` Wrong PIN
   *
   * `-2` Deleted
   */
  status?: number
  /**
   * **In** the JWT
   *
   * `p_*` are **not** in the JWT
   */
  admin?: number
  p_files_updater_add_del?: number
  p_files_updater_loader_mod?: number
  p_bootstraps_mod?: number
  p_maintenance_mod?: number
  p_news_add?: number
  p_news_mod_del?: number
  p_news_categories_add_mod_del?: number
  p_news_tags_add_mod_del?: number
  p_background_mod?: number
  p_stats_see?: number
  p_stats_del?: number
}
