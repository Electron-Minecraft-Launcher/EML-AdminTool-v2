<script lang="ts">
  import { UserStatus } from "@prisma/client"
  import type { PageData } from "../../routes/(app)/dashboard/emlat-settings/$types"
  import { emptyUser } from "$lib/stores/user"
  import { l } from "$lib/stores/language"

  interface Props {
    selectedUserId: string
    data: PageData
  }

  let { selectedUserId = $bindable(), data }: Props = $props()

  const selectedUser = data.users.find(user => user.id === selectedUserId) ?? emptyUser

  let showEditUserModal = $state(false)
  let action: 'ACCEPT' | 'EDIT' = $state('ACCEPT')


  async function deleteUser() {
    if (
      confirm(`Are you sure you want to delete this user?
The user will not be able to access EML AdminTool anymore. However, the user's actions and data will not be deleted.`)
    ) {
      // TODO
    }
  }

  async function deleteUserForever() {
    if (
      confirm(`Are you sure you want to delete this user forever?
All the user's actions and data will be deleted, including published news. This action is irreversible.`)
    ) {
      // TODO
    }
  }
</script>

{#if !selectedUser.isAdmin && selectedUser.status === UserStatus.ACTIVE}
  <button class="secondary right refuse" onclick={deleteUser} aria-label="Delete user"><i class="fa-solid fa-trash"></i></button>
  <button
    class="secondary right"
    onclick={() => {
      showEditUserModal = true
      action = 'EDIT'
    }}
    aria-label="Edit user"
  >
    <i class="fa-solid fa-pen"></i>
  </button>
{:else if selectedUser.status === UserStatus.PENDING}
  <button class="secondary right refuse" onclick={deleteUser} aria-label="Delete user"><i class="fa-solid fa-times"></i></button>
  <button
    class="secondary right accept"
    onclick={() => {
      showEditUserModal = true
      action = 'ACCEPT'
    }}
    aria-label="Accept user"
  >
    <i class="fa-solid fa-check"></i>
  </button>
{:else if selectedUser.status && (selectedUser.status === UserStatus.DELETED  || selectedUser.status === UserStatus.SPAM)}
  <button class="secondary right refuse" onclick={deleteUserForever} aria-label="Delete user forever"><i class="fa-solid fa-trash"></i></button>
{/if}

<div class="perms">
  <h4>{$l.dashboard.emlatSettings.infoOf} {selectedUser.username}</h4>

  <p class="label">{$l.main.username}</p>
  <p>{selectedUser.username}</p>

  {#if selectedUser.status === UserStatus.ACTIVE}
    <p class="label">{$l.dashboard.permissions}</p>
    {#if selectedUser.isAdmin}
      <p>Admin (all permissions)</p>
    {:else}
      {#if selectedUser.p_filesUpdater || selectedUser.p_loader}
        {#if selectedUser.p_filesUpdater}
          <p>Add and Delete files</p>
        {/if}
        {#if selectedUser.p_loader}
          <p>Change Minecraft loader</p>
        {/if}
      {/if}

      {#if selectedUser.p_bootstraps}
        <p>Change bootstrap files</p>
      {/if}

      {#if selectedUser.p_maintenance}
        <p>Change maintenance status</p>
      {/if}

      {#if selectedUser.p_news || selectedUser.p_newsCategories || selectedUser.p_newsTags}
        {#if selectedUser.p_news === 1}
          <p>Add news</p>
        {:else if selectedUser.p_news === 2}
          <p>Add, Edit and Delete news</p>
        {/if}
        {#if selectedUser.p_newsCategories}
          <p>Add, Edit and Delete news categories</p>
        {/if}
        {#if selectedUser.p_newsTags}
          <p>Add, Edit and Delete news tags</p>
        {/if}
      {/if}

      {#if selectedUser.p_backgrounds}
        <p>Change backgrounds</p>
      {/if}

      {#if selectedUser.p_stats === 1}
        <p>View stats</p>
      {:else if selectedUser.p_stats === 2}
        <p>View and Delete stats</p>
      {/if}

      {#if !selectedUser.p_filesUpdater && !selectedUser.p_loader && !selectedUser.p_bootstraps && !selectedUser.p_maintenance && !selectedUser.p_news && !selectedUser.p_newsCategories && !selectedUser.p_newsTags && !selectedUser.p_backgrounds && !selectedUser.p_stats}
        <p>No permissions</p>
      {/if}
    {/if}
  {/if}
</div>

<!-- <AcceptEditAccountModal bind:show={showEditUserModal} bind:selectedUser bind:action /> -->

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
