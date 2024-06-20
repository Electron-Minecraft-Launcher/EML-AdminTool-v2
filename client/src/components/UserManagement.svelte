<script lang="ts">
  import type { User } from '../../../shared/models/features/user.model'
  import { user, l } from '../services/store'
  import AcceptUserModal from './modals/EditUserModal.svelte'
  import apiAdminService from '../services/api/api-admin.service'
  import { invalidateAll } from '$app/navigation'

  export let account: User

  let showEditUserModal = false
  let action: 'accept' | 'edit'

  async function deleteUser() {
    if (
      confirm(`Are you sure you want to delete this user?
The user will not be able to access the EML AdminTool anymore. However, the user's actions and data will not be deleted.`)
    ) {
      account.status = -2
      account.p_files_updater_add_del = 0
      account.p_bootstrap_mod = 0
      account.p_maintenance_mod = 0
      account.p_news_add = 0
      account.p_news_mod_del = 0
      account.p_news_category_add_mod_del = 0
      account.p_news_tag_add_mod_del = 0
      account.p_background_mod = 0
      account.p_stats_see = 0
      account.p_stats_del = 0
      ;(await apiAdminService.putUser(account.id, account)).subscribe({
        next: (res) => {
          user.set(res.body.data?.user!)
          invalidateAll()
        }
      })
    }
  }

  async function deleteUserForever() {
    if (
      confirm(`Are you sure you want to delete this user forever?
All the user's actions and data will be deleted, including published news. This action is irreversible.`)
    ) {
      ;(await apiAdminService.deleteUser(account.id)).subscribe({
        next: () => {
          invalidateAll()
        }
      })
    }
  }
</script>

{#if !account.admin && account.status == 1}
  <button class="secondary right refuse" on:click={deleteUser}><i class="fa-solid fa-trash" /></button>
  <button
    class="secondary right"
    on:click={() => {
      showEditUserModal = true
      action = 'edit'
    }}><i class="fa-solid fa-pen" /></button
  >
{:else if account.status == 0}
  <button class="secondary right refuse" on:click={deleteUser}><i class="fa-solid fa-times" /></button>
  <button
    class="secondary right accept"
    on:click={() => {
      showEditUserModal = true
      action = 'accept'
    }}><i class="fa-solid fa-check" /></button
  >
{:else if account.status && account.status < 0}
  <button class="secondary right refuse" on:click={deleteUserForever}><i class="fa-solid fa-trash" /></button>
{/if}

<div class="perms">
  <h4>Permissions of {account.name}</h4>

  <p class="label">{$l.main.username}</p>
  <p>{account.name}</p>

  {#if account.status && account.status > 0}
    <p class="label">{$l.dashboard.permissions}</p>
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

<AcceptUserModal bind:show={showEditUserModal} bind:account bind:action />

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
