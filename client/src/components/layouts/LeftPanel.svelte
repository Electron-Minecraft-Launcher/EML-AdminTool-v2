<script lang="ts">
  import { user } from '../../services/store'
  import userService from '../../services/user.service'
  import { onMount } from 'svelte'
  import Skeleton from './Skeleton.svelte'
  import utils from '../../services/utils'
  import { page } from '$app/stores'
  import apiAuthService from '../../services/api/api-auth.service'
  import cookiesService from '../../services/cookies.service'
  import { slide } from 'svelte/transition'
  import { goto } from '$app/navigation'

  export let leftPanelOpen = true

  const randomWidth = { times: 100, min: 50 }
  const height = '21px'
  const customStyle: { [key: string]: string }[] = [{ display: 'block' }, { margin: '30px 15px 20px 15px' }]

  let ready = false
  let accountDropdownOpen = false

  onMount(async () => {
    ready = await userService.reload()
  })

  document.addEventListener('click', async () => {
    if (accountDropdownOpen) {
      accountDropdownOpen = false
    }
  })

  async function accountClick() {
    if (!accountDropdownOpen) {
      await utils.sleep(200)
      accountDropdownOpen = true
    }
  }

  async function logoutClick() {
    ;(await apiAuthService.deleteLogout()).subscribe({
      finally: () => {
        cookiesService.delete('JWT')
        goto('/login')
      }
    })
  }

  function toggleLeftPanel() {
    leftPanelOpen = !leftPanelOpen
  }
</script>

<nav class:closed={!leftPanelOpen}>
  <button class="toggle-left-panel" on:click={toggleLeftPanel}>
    {@html leftPanelOpen ? '<i class="fa-solid fa-chevron-left" />' : '<i class="fa-solid fa-chevron-right" />'}
  </button>

  <div class="toggle-left-panel"></div>

  <div class="hoverable"></div>

  {#if leftPanelOpen}
    <h1>EML AdminTool</h1>
  {:else}
    <h1><span>EML</span>AT</h1>
  {/if}

  {#if !ready}
    <Skeleton {randomWidth} {height} customStyle={[{ display: 'block' }, { margin: '50px 15px 20px 15px' }]} />
    <Skeleton {randomWidth} {height} customStyle={[{ display: 'block' }, { margin: '30px 15px 40px 15px' }]} />
  {:else}
    <a href="/dashboard" class:active={$page.url.pathname == '/dashboard'}><i class="fa-solid fa-house"></i>Home</a>
    {#if $user.admin}
      <a href="/dashboard/emlat-settings" class:active={$page.url.pathname == '/dashboard/emlat-settings'}>
        <i class="fa-solid fa-gear"></i>Settings
      </a>
    {/if}
  {/if}

  {#if leftPanelOpen}
    <h4>Features</h4>
  {:else}
    <h4 style="height: 21px;"><hr style="border-color: #505050; border-top: 0; position: relative; top: 5px;" /></h4>
  {/if}

  {#if !ready}
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
  {:else if $user.status !== 0 && $user.status !== -1 && $user.status !== -2}
    {#if $user.p_files_updater_add_del || $user.p_files_updater_loader_mod || $user.admin}
      <a href="/dashboard/files-updater" class:active={$page.url.pathname == '/dashboard/files-updater'}>
        <i class="fa-solid fa-folder-open"></i>Files Updater
      </a>
    {/if}

    {#if $user.p_bootstraps_mod || $user.admin}
      <a href="/dashboard/bootstraps" class:active={$page.url.pathname == '/dashboard/bootstraps'}>
        <i class="fa-solid fa-arrows-rotate"></i>Bootstraps
      </a>
    {/if}

    {#if $user.p_maintenance_mod || $user.admin}
      <a href="/dashboard/maintenance" class:active={$page.url.pathname == '/dashboard/maintenance'}>
        <i class="fa-solid fa-screwdriver-wrench"></i>Maintenance
      </a>
    {/if}

    {#if $user.p_news_add || $user.p_news_mod_del || $user.p_news_categories_add_mod_del || $user.p_news_tags_add_mod_del || $user.admin}
      <a href="/dashboard/news" class:active={$page.url.pathname == '/dashboard/news'}>
        <i class="fa-solid fa-newspaper"></i>News
      </a>
    {/if}

    {#if $user.p_background_mod || $user.admin}
      <a href="/dashboard/backgrounds" class:active={$page.url.pathname == '/dashboard/backgrounds'}>
        <i class="fa-solid fa-image"></i>Backgrounds
      </a>
    {/if}

    {#if $user.p_stats_see || $user.p_stats_del || $user.admin}
      <a href="/dashboard/stats" class:active={$page.url.pathname == '/dashboard/stats'}>
        <i class="fa-solid fa-chart-simple"></i>Stats
      </a>
    {/if}
  {/if}

  {#if !ready}
    <Skeleton
      {randomWidth}
      {height}
      customStyle={[{ display: 'block' }, { margin: '30px 15px 20px 15px' }, { position: 'absolute' }, { bottom: '90px' }, { width: '170px' }]}
    />
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <a class="account" on:click={accountClick}>
      <i class="fa-solid fa-circle-user"></i>{$user.name}<i class="fa-solid fa-caret-up"></i>
    </a>
  {/if}

  {#if accountDropdownOpen}
    <div class="account-dropdown" id="account-dropdown" transition:slide={{ duration: 200 }}>
      <a href="/dashboard/account" class="account-settings" class:active={$page.url.pathname == '/dashboard/account'}>
        <i class="fa-solid fa-gear"></i>Settings
      </a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <a class="account-logout" on:click={logoutClick}><i class="fa-solid fa-right-from-bracket"></i>Log out</a>
    </div>
  {/if}
</nav>

<style lang="scss">
  nav {
    background: white;
    border-right: 1px solid var(--border-color);
    padding: 30px;
    position: fixed;
    left: 0;
    top: 0;
    width: 200px;
    height: 100%;
    transition: all 0.3s;

    &.closed {
      width: 46px;

      h1 {
        line-height: 1;
        max-height: 35px;
        margin-bottom: 35px;

        span {
          font-size: 15px;
          display: block;
        }
      }

      a.account {
        width: 16px;

        i.fa-caret-up {
          display: none;
        }

        &:hover {
          color: var(--primary-color-hover);
          background: #eeeeee;
        }
      }
    }
  }

  h1 {
    margin: 5px 0 40px 0;
    font-size: 20px;
    max-height: 30px;
    color: #202020;
    text-align: center;
    transition: all 0.3s;
    white-space: nowrap;
    overflow: hidden;
    background: white;
    z-index: 100;
    position: relative;
  }

  h4 {
    color: #505050;
    margin-top: 30px;
    font-size: 14px;
  }

  a {
    display: block;
    margin-top: 10px;
    border-bottom: none;
    color: #1e1e1e;
    border-radius: 5px;
    padding: 10px 15px;
    font-size: 14px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;

    &:hover:not(.account),
    &.active:hover:not(.account) {
      color: var(--primary-color-hover);
      background: #eeeeee;
    }

    &.active {
      background: #f5f5f5;
    }

    i.fa-solid {
      display: inline-block;
      margin-right: 15px;
      height: 16px;
      width: 16px;
    }

    &.account {
      position: absolute;
      bottom: 90px;
      width: 170px;
    }

    i.fa-solid.fa-caret-up {
      padding: 14px 15px 13px 15px;
      margin-right: 0;
      position: absolute;
      right: 0;
      top: 0;
      border-radius: 5px;
      transition: all 0.2s ease;
      width: auto;
      height: 14px;
    }

    &.account:hover {
      color: #1e1e1e;

      i.fa-caret-up {
        color: var(--primary-color-hover);
        background: #eeeeee;
      }
    }
  }

  div.account-dropdown {
    overflow-y: hidden;
    border-radius: 5px;
    transition:
      opacity 0.2s,
      height 0.2s ease,
      display 0s;
    background: white;
    padding: 10px;
    border: 1px solid var(--border-color);
    z-index: 100;
    position: absolute;
    width: 178px;
    bottom: 142px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    // opacity: 0;
    // height: 0;
    // display: none;

    > a:nth-of-type(1) {
      margin-top: 0;
    }

    a.account-logout {
      color: var(--red-color);

      &:hover {
        background: #faeeee;
      }
    }
  }

  nav {
    div.toggle-left-panel {
      width: 39px;
      height: 43px;
      background: white;
      position: absolute;
      right: 0;
    }

    div.hoverable {
      height: 100%;
      width: 39px;
      position: absolute;
      top: 0;
      right: -39px;
      z-index: -1;
    }

    button.toggle-left-panel {
      width: 39px;
      border: 1px solid var(--border-color);
      border-left: none;
      border-radius: 0 10px 10px 0;
      background: white;
      position: absolute;
      transition:
        right 0.3s,
        opacity 0.3s;
      right: 0;
    }

    &:hover button.toggle-left-panel,
    div.hoverable:hover button.toggle-left-panel,
    button.toggle-left-panel:hover {
      right: -39px;
    }
  }
</style>
