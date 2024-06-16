<script lang="ts">
  import type en from '../assets/language/en'
  import type fr from '../assets/language/fr'
  import type { Env } from '../../../shared/models/data/env.model'
  import type { User } from '../../../shared/models/features/user.model'
  import { env$ } from '../services/store'
  import AcceptUserModal from '../components/modals/AcceptUserModal.svelte'

  export let account: User

  let showEditAdminToolModal = false

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    env = value
    l = value.language
  })
</script>

{#if !account.admin && account.status == 1}
  <button class="secondary right"><i class="fa-solid fa-pen" /></button>
{:else if account.status == 0}
  <button class="secondary right refuse"><i class="fa-solid fa-times" /></button>
  <button class="secondary right accept" on:click={() => (showEditAdminToolModal = true)}><i class="fa-solid fa-check" /></button>
{:else if account.status && account.status < 0}
  <button class="secondary right refuse"><i class="fa-solid fa-trash" /></button>
{/if}

<div class="perms">
  <h4>Permissions of {account.name}</h4>

  <p class="label">{l.main.username}</p>
  <p>{account.name}</p>

  {#if account.status && account.status > 0}
    <p class="label">{l.dashboard.permissions}</p>
    {#if account.admin}
      <p>Admin (all permissions)</p>
    {:else}
      {#if account.p_files_updater_add_del}
        <p>Add and Delete files</p>
      {/if}

      {#if account.p_bootstrap_mod}
        <p>Modify bootstrap</p>
      {/if}

      {#if account.p_maintenance_mod}
        <p>Modify maintenance status</p>
      {/if}

      {#if account.p_news_add || account.p_news_mod_del || account.p_news_category_add_mod_del || account.p_news_tag_add_mod_del}
        {#if account.p_news_add}
          <p>Add{account.p_news_mod_del ? ', Edit and Delete' : ''} news</p>
        {/if}
        {#if account.p_news_category_add_mod_del}
          <p>Add, Edit and Delete news categories</p>
        {/if}
        {#if account.p_news_tag_add_mod_del}
          <p>Add, Edit and Delete news tags</p>
        {/if}
      {/if}

      {#if account.p_background_mod}
        <p>Change background</p>
      {/if}

      {#if account.p_stats_see}
        <p>View{account.p_stats_del ? ' and Delete' : ''} stats</p>
      {/if}

      {#if !account.p_files_updater_add_del && !account.p_bootstrap_mod && !account.p_maintenance_mod && !account.p_news_add && !account.p_news_mod_del && !account.p_news_category_add_mod_del && !account.p_news_tag_add_mod_del && !account.p_background_mod && !account.p_stats_see}
        <p>No permissions</p>
      {/if}
    {/if}
  {/if}
</div>

<AcceptUserModal bind:show={showEditAdminToolModal} bind:account />

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

  button.accept {
    color: #266e26;
  }

  button.refuse {
    right: 58px;
    color: #6e2626;
  }
</style>
