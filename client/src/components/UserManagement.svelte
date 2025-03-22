<script lang="ts">
  import type { User } from '../../../shared/types/features/user'
  import { user, l } from '../services/store'
  import AcceptEditAccountModal from './modals/AcceptEditAccountModal.svelte'
  import apiAdminService from '../services/api/api-admin.service'
  import { invalidateAll } from '$app/navigation'

  interface Props {
    selectedAccount: User
    accounts: User[]
  }

  let { selectedAccount = $bindable(), accounts }: Props = $props()

  let showEditUserModal = $state(false)
  let action: 'accept' | 'edit' = $state('accept')

  async function deleteUser() {
    if (
      confirm(`Are you sure you want to delete this user?
The user will not be able to access EML AdminTool anymore. However, the user's actions and data will not be deleted.`)
    ) {
      selectedAccount.status = -2
      selectedAccount.p_files_updater_add_del = 0
      selectedAccount.p_files_updater_loader_mod = 0
      selectedAccount.p_bootstraps_mod = 0
      selectedAccount.p_maintenance_mod = 0
      selectedAccount.p_news_add = 0
      selectedAccount.p_news_mod_del = 0
      selectedAccount.p_news_categories_add_mod_del = 0
      selectedAccount.p_news_tags_add_mod_del = 0
      selectedAccount.p_background_mod = 0
      selectedAccount.p_stats_see = 0
      selectedAccount.p_stats_del = 0
      ;(await apiAdminService.putUser(selectedAccount.id, selectedAccount)).subscribe({
        next: (res) => {
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
      ;(await apiAdminService.deleteUser(selectedAccount.id)).subscribe({
        next: () => {
          selectedAccount = accounts[0]
          invalidateAll()
        }
      })
    }
  }
</script>

{#if !selectedAccount.admin && selectedAccount.status == 1}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right refuse" onclick={deleteUser}><i class="fa-solid fa-trash"></i></button>
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    class="secondary right"
    onclick={() => {
      showEditUserModal = true
      action = 'edit'
    }}
  >
    <i class="fa-solid fa-pen"></i>
  </button>
{:else if selectedAccount.status == 0}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right refuse" onclick={deleteUser}><i class="fa-solid fa-times"></i></button>
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    class="secondary right accept"
    onclick={() => {
      showEditUserModal = true
      action = 'accept'
    }}
  >
    <i class="fa-solid fa-check"></i>
  </button>
{:else if selectedAccount.status && selectedAccount.status < 0}
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button class="secondary right refuse" onclick={deleteUserForever}><i class="fa-solid fa-trash"></i></button>
{/if}

<div class="perms">
  <h4>{$l.dashboard.emlatSettings.permissionsOf} {selectedAccount.name}</h4>

  <p class="label">{$l.main.username}</p>
  <p>{selectedAccount.name}</p>

  {#if selectedAccount.status && selectedAccount.status > 0}
    <p class="label">{$l.dashboard.permissions}</p>
    {#if selectedAccount.admin}
      <p>Admin (all permissions)</p>
    {:else}
      {#if selectedAccount.p_files_updater_add_del || selectedAccount.p_files_updater_loader_mod}
        {#if selectedAccount.p_files_updater_add_del}
          <p>Add and Delete files</p>
        {/if}
        {#if selectedAccount.p_files_updater_loader_mod}
          <p>Change Minecraft loader</p>
        {/if}
      {/if}

      {#if selectedAccount.p_bootstraps_mod}
        <p>Change bootstrap files</p>
      {/if}

      {#if selectedAccount.p_maintenance_mod}
        <p>Change maintenance status</p>
      {/if}

      {#if selectedAccount.p_news_add || selectedAccount.p_news_mod_del || selectedAccount.p_news_categories_add_mod_del || selectedAccount.p_news_tags_add_mod_del}
        {#if selectedAccount.p_news_add}
          <p>Add{selectedAccount.p_news_mod_del ? ', Edit and Delete' : ''} news</p>
        {/if}
        {#if selectedAccount.p_news_categories_add_mod_del}
          <p>Add, Edit and Delete news categories</p>
        {/if}
        {#if selectedAccount.p_news_tags_add_mod_del}
          <p>Add, Edit and Delete news tags</p>
        {/if}
      {/if}

      {#if selectedAccount.p_background_mod}
        <p>Change background</p>
      {/if}

      {#if selectedAccount.p_stats_see}
        <p>View{selectedAccount.p_stats_del ? ' and Delete' : ''} stats</p>
      {/if}

      {#if !selectedAccount.p_files_updater_add_del && !selectedAccount.p_files_updater_loader_mod && !selectedAccount.p_bootstraps_mod && !selectedAccount.p_maintenance_mod && !selectedAccount.p_news_add && !selectedAccount.p_news_mod_del && !selectedAccount.p_news_categories_add_mod_del && !selectedAccount.p_news_tags_add_mod_del && !selectedAccount.p_background_mod && !selectedAccount.p_stats_see}
        <p>No permissions</p>
      {/if}
    {/if}
  {/if}
</div>

<AcceptEditAccountModal bind:show={showEditUserModal} bind:selectedAccount bind:action />

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
