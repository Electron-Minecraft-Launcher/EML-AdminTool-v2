<script lang="ts">
  import { l } from '$lib/stores/language'
  import ModalTemplate from './__ModalTemplate.svelte'
  import type { File as File_ } from '$lib/utils/types'
  import getEnv from '$lib/utils/env'
  import semver from 'semver'
  import { enhance } from '$app/forms'
  import type { SubmitFunction } from '@sveltejs/kit'
  import { applyAction } from '$app/forms'
  import { addNotification } from '$lib/stores/notifications'
  import { NotificationCode } from '$lib/utils/notifications'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'

  interface Props {
    show: boolean
    bootstraps: { version?: string; winFile: File_ | null; macFile: File_ | null; linFile: File_ | null }
  }

  let { show = $bindable(), bootstraps }: Props = $props()

  const env = getEnv()

  const versionInfo = `The version must follow the format: x.y.z, x.y.z-beta.x, or x.y.z-alpha.x. The new version must be higher than the current version (${bootstraps.version}).`

  let showLoader = $state(false)

  let version = $state(bootstraps.version ?? '')
  let win = $state('')
  let mac = $state('')
  let lin = $state('')
  let winFile: File | null = $state(null)
  let macFile: File | null = $state(null)
  let linFile: File | null = $state(null)

  let disabled: boolean = $derived(!semver.valid(version) || !winFile || !macFile || !linFile)

  const accept = {
    win: '.exe,.msi,.msix,.appx,.appxbundle,.appinstaller',
    mac: '.dmg,.app,.pkg,.zip,.tar.gz',
    lin: '.deb,.rpm,.freebsd,.AppImage,.tar.gz,.7z,.zip,.sh,.snap'
  }

  async function uploadFile(platform: 'win' | 'mac' | 'lin') {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept[platform]

    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return

      switch (platform) {
        case 'win':
          winFile = file
          win = file.name
          break
        case 'mac':
          macFile = file
          mac = file.name
          break
        case 'lin':
          linFile = file
          lin = file.name
          break
        default:
          console.warn('Unknown platform:', platform)
      }
    }

    input.click()
  }

  function reset(platform: 'win' | 'mac' | 'lin') {
    if (platform === 'win') {
      win = ''
      winFile = null
    }
    if (platform === 'mac') {
      mac = ''
      macFile = null
    }
    if (platform === 'lin') {
      lin = ''
      linFile = null
    }
  }

  const enhanceForm: SubmitFunction = ({ formData }) => {
    showLoader = true
    formData.set('new-version', version)
    formData.set('name', env.name)
    formData.set('win-file', winFile ?? '')
    formData.set('mac-file', macFile ?? '')
    formData.set('lin-file', linFile ?? '')

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
    <LoadingSplash transparent />
  {/if}

  <form method="POST" action="?/changeBootstraps" use:enhance={enhanceForm} enctype="multipart/form-data">
    <h2>Change bootstraps and version</h2>

    <label for="version" style="margin-top: 0">
      New version&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={versionInfo} style="cursor: help"></i>
    </label>
    <input type="text" id="version" bind:value={version} />

    <p class="label" style="margin-top: 20px"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
    {#if !win || win === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('win')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{win}</p>
      <button type="button" class="remove" onclick={() => reset('win')} aria-label="Remove Windows Bootstrap">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    {/if}

    <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
    {#if !mac || mac === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('mac')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{mac}</p>
      <button type="button" class="remove" onclick={() => reset('mac')} aria-label="Remove macOS Bootstrap">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    {/if}

    <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
    {#if !lin || lin === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('lin')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{lin}</p>
      <button type="button" class="remove" onclick={() => reset('lin')} aria-label="Remove Linux Bootstrap">
        <i class="fa-solid fa-circle-xmark"></i>
      </button>
    {/if}

    <!-- Just for sending form in multipart -->
    <!-- <input type="file" name="file" id="file" hidden style="display: none" />  -->

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.main.cancel}</button>
      <button type="submit" class="primary" {disabled}>{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../../static/scss/modals.scss';

  button.secondary.upload {
    margin-top: 0;
  }

  p.no-link {
    margin: 0px;
    display: inline-block;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    padding: 8px 0 7px 0;
  }

  button.remove {
    display: inline-block;
    border-bottom: none;
    margin-left: 5px;
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    background: none;
    color: var(--red-color);
    vertical-align: middle;

    &:hover {
      background: #faeeee;
    }
  }
</style>
