<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$ } from '$services/store'

  export let user: User

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    env = value
    l = value.language
  })
</script>

<button class="secondary right"><i class="fa-solid fa-pen" /></button>

<div class="perms">
  <h4>Permissions of {user.name}</h4>

  <p class="label">{l.main.username}</p>
  <p>{user.name}</p>

  <p class="label">{l.dashboard.permissions}</p>
  {#if user.p_files_updater_add_del}
    <p>Add and Delete files</p>
  {/if}

  {#if user.p_bootstrap_mod}
    <p>Modify bootstrap</p>
  {/if}

  {#if user.p_maintenance_mod}
    <p>Modify maintenance status</p>
  {/if}

  {#if user.p_news_add || user.p_news_mod_del || user.p_news_category_add_mod_del || user.p_news_tag_add_mod_del}
    {#if user.p_news_add}
      <p>Add{user.p_news_mod_del ? ', Edit and Delete' : ''} news</p>
    {/if}
    {#if user.p_news_category_add_mod_del}
      <p>Add, Edit and Delete news categories</p>
    {/if}
    {#if user.p_news_tag_add_mod_del}
      <p>Add, Edit and Delete news tags</p>
    {/if}
  {/if}

  {#if user.p_background_mod}
    <p>Change background</p>
  {/if}

  {#if user.p_stats_see}
    <p>View{user.p_stats_del ? ' and Delete' : ''} stats</p>
  {/if}

  {#if !user.p_files_updater_add_del && !user.p_bootstrap_mod && !user.p_maintenance_mod && !user.p_news_add && !user.p_news_mod_del && !user.p_news_category_add_mod_del && !user.p_news_tag_add_mod_del && !user.p_background_mod && !user.p_stats_see}
    <p>None</p>
  {/if}

  <p class="label">{l.main.actions}</p>
</div>

<style lang="scss">
  div.perms {
    min-height: 400px;
    max-height: 600px;
    overflow-y: auto;
  }

  button.right {
    position: absolute;
    right: 0;
    top: 30px;
  }
</style>
