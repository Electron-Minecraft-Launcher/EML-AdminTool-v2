import { tinyint, varchar } from '../types'

export interface User {
  /**
   * In the JWT as `sub`
   */
  id?: number
  /**
   * In the JWT
   */
  name?: varchar
  /**
   * Not in the JWT
   */
  password?: varchar
  /**
   * Not in the JWT
   *
   * ` 1` Accepted
   *
   * ` 0` Waiting for acceptation
   *
   * `-1` Bad PIN
   *
   * `-2` Deleted
   */
  status?: tinyint
  /**
   * In the JWT
   *
   * `p_*` are not in the JWT
   */
  admin?: tinyint
  p_files_updater_add_del?: tinyint
  p_bootstrap_mod?: tinyint
  p_maintenance_mod?: tinyint
  p_news_add?: tinyint
  p_news_mod_del?: tinyint
  p_news_category_add_mod_del?: tinyint
  p_news_tag_add_mod_del?: tinyint
  p_background_mod?: tinyint
  p_stats_see?: tinyint
  p_stats_del?: tinyint
}
