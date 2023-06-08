<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'
  import UserService from '$services/user.service'
  import { onMount } from 'svelte'
  import Skeleton from './Skeleton.svelte'
  import utils from '$services/utils'
  import { page } from '$app/stores'
  import ApiAuthService from '$services/api/api-auth.service'
  import CookiesService from '$services/cookies.service'
  import router from '$services/router'
  import { slide } from 'svelte/transition'
  import { redirect } from '@sveltejs/kit'
  import { goto } from '$app/navigation'

  const apiAuth = new ApiAuthService()
  const cookies = new CookiesService()

  let env!: Env
  let l: typeof en | typeof fr
  let user: User

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  user$.subscribe((value) => {
    if (value) {
      user = value
    }
  })

  const randomWidth = { times: 100, min: 50 }
  const height = '21px'
  const customStyle: { [key: string]: string }[] = [{ display: 'block' }, { margin: '30px 15px 20px 15px' }]

  let ready: boolean = false
  let accountDropdownOpen = false

  onMount(async () => {
    ready = await new UserService().reload()
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
    ;(await apiAuth.deleteLogout()).subscribe({
      finally: () => {
        cookies.delete('JWT')
        // throw redirect(300, '/login')
        goto('/login')
      },
    })
  }
</script>

<nav>
  <h1>EML AdminTool</h1>

  {#if !ready}
    <Skeleton {randomWidth} {height} customStyle={[{ display: 'block' }, { margin: '50px 15px 20px 15px' }]} />
    <Skeleton {randomWidth} {height} customStyle={[{ display: 'block' }, { margin: '30px 15px 40px 15px' }]} />
  {:else}
    <a href="/dashboard" class:active={$page.url.pathname == '/dashboard'}><i class="fa-solid fa-house" />Home</a>
    {#if user.admin}
      <a href="/dashboard/emlat-settings" class:active={$page.url.pathname == '/dashboard/emlat-settings'}>
        <i class="fa-solid fa-gear" />Settings
      </a>
    {/if}
  {/if}

  <h4>Features</h4>
  {#if !ready}
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
    <Skeleton {randomWidth} {height} {customStyle} />
  {:else}
    {#if user.p_files_updater_add_del}
      <a href="/dashboard/files-updater">
        <i class="fa-solid fa-folder-open" />Files Updater
      </a>
    {/if}

    {#if user.p_bootstrap_mod}
      <a href="/dashboard/bootstrap">
        <i class="fa-solid fa-arrows-rotate" />Bootstrap
      </a>
    {/if}

    {#if user.p_maintenance_mod}
      <a href="/dashboard/maintenance">
        <i class="fa-solid fa-screwdriver-wrench" />Maintenance
      </a>
    {/if}

    {#if user.p_news_add || user.p_news_mod_del || user.p_news_category_add_mod_del || user.p_news_tag_add_mod_del}
      <a href="/dashboard/news"
        ><i class="fa-solid fa-newspaper" />
        News
      </a>
    {/if}

    {#if user.p_background_mod}
      <a href="/dashboard/background">
        <i class="fa-solid fa-image" />Background
      </a>
    {/if}

    {#if user.p_stats_see || user.p_stats_del}
      <a href="/dashboard/stats">
        <i class="fa-solid fa-chart-simple" />Stats
      </a>
    {/if}
  {/if}

  {#if !ready}
    <Skeleton
      {randomWidth}
      {height}
      customStyle={[
        { display: 'block' },
        { margin: '30px 15px 20px 15px' },
        { position: 'absolute' },
        { bottom: '90px' },
        { width: '170px' },
      ]}
    />
  {:else}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-missing-attribute -->
    <a class="account" on:click={accountClick}>
      <i class="fa-solid fa-circle-user" />{user.name}<i class="fa-solid fa-caret-up" /></a
    >
  {/if}

  {#if accountDropdownOpen}
    <div class="account-dropdown" id="account-dropdown" transition:slide={{ duration: 200 }}>
      <a href="/configure" class="account-settings"><i class="fa-solid fa-gear" />Settings</a>
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-missing-attribute -->
      <a class="account-logout" on:click={logoutClick}><i class="fa-solid fa-right-from-bracket" />Log out</a>
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
  }

  h1 {
    margin: 5px 0 40px 0;
    font-size: 20px;
    color: #202020;
    text-align: center;
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
    transition: opacity 0.2s, height 0.2s ease, display 0s;
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
</style>
