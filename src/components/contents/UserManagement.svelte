<script lang="ts">
  import { UserStatus } from '@prisma/client'
  import type { PageData } from '../../routes/(app)/dashboard/emlat-settings/$types'
  import { emptyUser } from '$lib/stores/user'
  import { l } from '$lib/stores/language'
  import { enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { addNotification } from '$lib/stores/notifications'
  import type { NotificationCode } from '$lib/utils/notifications'
  import { applyAction } from '$app/forms'

  interface Props {
    selectedUserId: string
    data: PageData
  }

  let { selectedUserId = $bindable(), data }: Props = $props()

  let showEditUserModal = $state(false)
  let selectedUser = $derived.by(() => data.users.find((user) => user.id === selectedUserId) ?? emptyUser)
  let action: 'ACCEPT' | 'EDIT' = $state('ACCEPT')

  const enhanceForm: SubmitFunction = ({ action, formData, cancel }) => {
    const warning =
      action.search === '?/refuseUser'
        ? $l.dashboard.emlatSettings.refuseUserWarning
        : action.search === '?/deleteUser'
          ? $l.dashboard.emlatSettings.deleteUserWarning
          : $l.dashboard.emlatSettings.deleteUserForeverWarning
    if (!confirm(warning)) {
      cancel()
      return
    }

    formData.set('user-id', selectedUserId)
    return async ({ result, update }) => {
      update({ reset: false })
      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        if (action.search === '?/deleteUserForever') {
          selectedUserId = data.users[0]?.id ?? ''
        }
      }
      
      await applyAction(result)
    }
  }
</script>

{#if !selectedUser.isAdmin && selectedUser.status === UserStatus.ACTIVE}
  <form method="POST" action="?/deleteUser" use:enhance={enhanceForm}>
    <button class="secondary right refuse" aria-label="Delete user"><i class="fa-solid fa-trash"></i></button>
  </form>
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
  <form method="POST" action="?/refuseUser" use:enhance={enhanceForm}>
    <button class="secondary right refuse" aria-label="Refuse user"><i class="fa-solid fa-times"></i></button>
  </form>
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
{:else if selectedUser.status && (selectedUser.status === UserStatus.DELETED || selectedUser.status === UserStatus.SPAM)}
  <form method="POST" action="?/deleteUserForever" use:enhance={enhanceForm}>
    <button class="secondary right delete" aria-label="Delete user forever"><i class="fa-solid fa-trash"></i></button>
  </form>
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

  button.delete {
    color: #6e2626;
  }
</style>
