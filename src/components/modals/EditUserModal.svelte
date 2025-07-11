<script lang="ts">
  import { applyAction, enhance } from '$app/forms'
  import { l } from '$lib/stores/language'
  import { addNotification } from '$lib/stores/notifications'
  import type { PageData, SubmitFunction } from '../../routes/(app)/dashboard/emlat-settings/$types'
  import ModalTemplate from './__ModalTemplate.svelte'
  import type { NotificationCode } from '$lib/utils/notifications'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { emptyUser } from '$lib/stores/user'
  import { onMount } from 'svelte'

  interface Props {
    show: boolean
    selectedUserId: string
    action: 'ACCEPT' | 'EDIT'
    data: PageData
    scroll?: HTMLDivElement | null
  }

  let { show = $bindable(), selectedUserId = $bindable(), action, data, scroll = $bindable(null) }: Props = $props()

  let selectedUser = $state(data.users.find((user) => user.id === selectedUserId) ?? emptyUser)
  let p_filesUpdater_1 = $state(selectedUser.p_filesUpdater >= 1)
  let p_filesUpdater_2 = $state(selectedUser.p_filesUpdater === 2)
  let p_bootstraps = $state(selectedUser.p_bootstraps === 1)
  let p_maintenance = $state(selectedUser.p_maintenance === 1)
  let p_news_1 = $state(selectedUser.p_news >= 1)
  let p_news_2 = $state(selectedUser.p_news === 2)
  let p_newsCategories = $state(selectedUser.p_newsCategories === 1)
  let p_newsTags = $state(selectedUser.p_newsTags === 1)
  let p_backgrounds = $state(selectedUser.p_backgrounds === 1)
  let p_stats_1 = $state(selectedUser.p_stats >= 1)
  let p_stats_2 = $state(selectedUser.p_stats === 2)

  let showLoader = $state(false)
  let notAtTop = $state(false)
  let notAtBottom = $state(false)

  onMount(handleScroll)

  function handleScroll() {
    if (!scroll) return
    notAtTop = scroll.scrollTop > 5
    notAtBottom = scroll.scrollHeight - scroll.scrollTop > scroll.clientHeight + 6
  }

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true
    formData.set('user-id', selectedUserId)

    return async ({ result, update }) => {
      update({ reset: false })
      showLoader = false

      if (result.type === 'failure') {
        const message = $l.notifications[result.data?.failure as NotificationCode] ?? $l.notifications.INTERNAL_SERVER_ERROR
        addNotification('ERROR', message)
      } else if (result.type === 'success') {
        show = false
      }

      await applyAction(result)
    }
  }
</script>

<ModalTemplate size={'s'} bind:show>
  {#if showLoader}
    <LoadingSplash transparent={true} />
  {/if}

  <form method="POST" action="?/editUser" use:enhance={enhanceForm}>
    <h2>{action === 'ACCEPT' ? $l.dashboard.emlatSettings.acceptUser : $l.dashboard.emlatSettings.editUser}</h2>

    <div class="overflow-container">
      <div bind:this={scroll} class="overflow" onscroll={handleScroll} class:not-at-top={notAtTop} class:not-at-bottom={notAtBottom}>
        <label for="name" style="margin-top: 0">{$l.dashboard.account.nameOrPseudo}</label>
        <input type="text" id="name" bind:value={selectedUser.username} />

        <p class="label" style="margin-top: 20px">Files Updater</p>
        <label class="p" for="p_files-updater_1">
          <input
            type="checkbox"
            id="p_files-updater_1"
            name="p_files-updater_1"
            bind:checked={p_filesUpdater_1}
            onchange={() => {
              if (!p_filesUpdater_1) p_filesUpdater_2 = false
            }}
          /> Add and delete files
        </label>
        <label class="p" for="p_files-updater_2">
          <input
            type="checkbox"
            id="p_files-updater_2"
            name="p_files-updater_2"
            bind:checked={p_filesUpdater_2}
            onchange={() => {
              if (p_filesUpdater_2) p_filesUpdater_1 = true
            }}
          /> Change and delete Minecraft loader
        </label>

        <p class="label">Bootstraps</p>
        <label class="p" for="p_bootstraps_1">
          <input type="checkbox" id="p_bootstraps_1" name="p_bootstraps_1" bind:checked={p_bootstraps} /> Change bootstrap files
        </label>

        <p class="label">Maintenance</p>
        <label class="p" for="p_maintenance_1">
          <input type="checkbox" id="p_maintenance_1" name="p_maintenance_1" bind:checked={p_maintenance} /> Change maintenance status
        </label>

        <p class="label">News</p>
        <label class="p" for="p_news_1">
          <input
            type="checkbox"
            id="p_news_1"
            name="p_news_1"
            bind:checked={p_news_1}
            onchange={() => {
              if (!p_news_1) {
                p_news_2 = false
                p_newsCategories = false
                p_newsTags = false
              }
            }}
          /> Add news
        </label>
        <label class="p" for="p_news_2">
          <input
            type="checkbox"
            id="p_news_2"
            name="p_news_2"
            bind:checked={p_news_2}
            onchange={() => {
              if (p_news_2) p_news_1 = true
            }}
          /> Edit and Delete every news
        </label>
        <label class="p" for="p_news-categories_1">
          <input
            type="checkbox"
            id="p_news-categories_1"
            name="p_news-categories_1"
            bind:checked={p_newsCategories}
            onchange={() => {
              if (p_newsCategories) p_news_1 = true
            }}
          /> Add, Edit and Delete news categories
        </label>
        <label class="p" for="p_news_tags_1">
          <input
            type="checkbox"
            id="p_news_tags_1"
            name="p_news_tags_1"
            bind:checked={p_newsTags}
            onchange={() => {
              if (p_newsTags) p_news_1 = true
            }}
          /> Add, Edit and Delete news tags
        </label>

        <p class="label">Background</p>
        <label class="p" for="p_background_1">
          <input type="checkbox" id="p_background_1" name="p_background_1" bind:checked={p_backgrounds} /> Change background
        </label>

        <p class="label">Stats</p>
        <label class="p" for="p_stats_1">
          <input
            type="checkbox"
            id="p_stats_1"
            name="p_stats_1"
            bind:checked={p_stats_1}
            onchange={() => {
              if (!p_stats_1) p_stats_2 = false
            }}
          /> View stats
        </label>
        <label class="p" for="p_stats_2">
          <input
            type="checkbox"
            id="p_stats_2"
            name="p_stats_2"
            bind:checked={p_stats_2}
            onchange={() => {
              if (p_stats_2) p_stats_1 = true
            }}
          /> Delete stats
        </label>
      </div>
    </div>

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }

  label.p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: black;
  }

  div.overflow-container {
    position: relative;
  }

  div.overflow {
    max-height: 350px;
    overflow-y: auto;
    overflow-x: visible;

    &.not-at-top::before {
      content: '';
      width: 100%;
      position: absolute;
      height: 15px;
      background: linear-gradient(to bottom, #6464642b, transparent);
      z-index: 1;
    }

    &.not-at-bottom::after {
      content: '';
      width: 100%;
      position: absolute;
      height: 15px;
      bottom: 0;
      background: linear-gradient(to top, #6464642b, transparent);
      z-index: 1;
    }
  }
</style>
