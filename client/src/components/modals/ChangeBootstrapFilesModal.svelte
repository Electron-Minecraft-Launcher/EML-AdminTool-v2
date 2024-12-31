<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { l } from '../../services/store'
  import type { PageData } from '../../routes/(authed)/dashboard/bootstraps/$types'
  import apiBootstrapsService from '../../services/api/api-bootstraps.service'
  import { onMount } from 'svelte'
  import type { Bootstraps, BootstrapsRes } from '../../../../shared/types/features/bootstraps'

  interface Props {
    data: PageData
    show: boolean
  }

  let { data = $bindable(), show = $bindable() }: Props = $props()

  let version: string = $state('')
  let win: string = $state('')
  let mac: string = $state('')
  let lin: string = $state('')
  let files: File[] = []

  let disabled_: boolean = $state(true)
  let disabled: boolean = $derived(!version.match(/(\d\.\d\.\d)(-[a-z]*(\.\d)?)?/gi) || disabled_)

  function update() {
    version = data.bootstraps.version || ''
    win = ''
    mac = ''
    lin = ''
    files = []
  }

  async function uploadFile(platform: 'win' | 'mac' | 'lin') {
    const current = document.querySelector(`input#${platform}-upload`) as HTMLInputElement
    current.click()

    await new Promise((resolve) => {
      current.addEventListener('change', resolve, { once: true })
    })

    if (!current.files) return

    files.push(current.files!.item(0)!)
    if (platform === 'win') win = current!.files!.item(0)!.name
    if (platform === 'mac') mac = current!.files!.item(0)!.name
    if (platform === 'lin') lin = current!.files!.item(0)!.name

    disabled_ =
      !(document.querySelector('input#win-upload') as HTMLInputElement)?.files ||
      !(document.querySelector('input#mac-upload') as HTMLInputElement)?.files ||
      !(document.querySelector('input#lin-upload') as HTMLInputElement)?.files ||
      !(document.querySelector('input#win-upload') as HTMLInputElement)?.files![0] ||
      !(document.querySelector('input#mac-upload') as HTMLInputElement)?.files![0] ||
      !(document.querySelector('input#lin-upload') as HTMLInputElement)?.files![0]
  }

  function reset(platform: 'win' | 'mac' | 'lin') {
    let current = document.querySelector(`input#${platform}-upload`) as HTMLInputElement
    current.value = ''
    current.files = null
    if (platform === 'win') win = ''
    if (platform === 'mac') mac = ''
    if (platform === 'lin') lin = ''
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    if (version === '') return
    if (
      version === data.bootstraps.version &&
      !confirm('You did not change the version. Are you sure you want to continue? The Launchers will not be updated.')
    )
      return
    let bootstrapsRes: BootstrapsRes = data.bootstraps
    if (win && win !== '' && files.find((file) => file.name === win)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'win', files.find((file) => file.name === win)!)).subscribe({
        next: (res) => {
          bootstrapsRes = res.body.data!
        }
      })
    }
    if (mac && mac !== '' && files.find((file) => file.name === mac)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'mac', files.find((file) => file.name === mac)!)).subscribe({
        next: (res) => {
          bootstrapsRes = res.body.data!
        }
      })
    }
    if (lin && lin !== '' && files.find((file) => file.name === lin)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'lin', files.find((file) => file.name === lin)!)).subscribe({
        next: (res) => {
          bootstrapsRes = res.body.data!
        }
      })
    }
    data.bootstraps = bootstrapsRes
    show = false
  }

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>Change bootstraps and version</h2>

    <label for="version" style="margin-top: 0">Version</label>
    <input type="text" id="version" placeholder="1.0.2, 2.4.0-beta.3" bind:value={version} />

    <p class="label" style="margin-top: 20px"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
    {#if !win || win === ''}
      <button class="secondary upload" onclick={() => uploadFile('win')} type="button">
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{win}</p>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="remove" onclick={() => reset('win')} type="button"><i class="fa-solid fa-circle-xmark"></i></button>
    {/if}

    <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
    {#if !mac || mac === ''}
      <button class="secondary upload" onclick={() => uploadFile('mac')} type="button">
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{mac}</p>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="remove" onclick={() => reset('mac')} type="button"><i class="fa-solid fa-circle-xmark"></i></button>
    {/if}

    <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
    {#if !lin || lin === ''}
      <button class="secondary upload" onclick={() => uploadFile('lin')} type="button">
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{lin}</p>
      <!-- svelte-ignore a11y_consider_explicit_label -->
      <button class="remove" onclick={() => reset('lin')} type="button"><i class="fa-solid fa-circle-xmark"></i></button>
    {/if}

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary" {disabled}>{$l.main.save}</button>
    </div>

    <input type="file" id="win-upload" accept=".exe,.msi,.msix,.appx,.appxbundle,.appinstaller" style="display: none" />
    <input type="file" id="mac-upload" accept=".dmg,.app,.pkg,.zip,.tar.gz" style="display: none" />
    <input type="file" id="lin-upload" accept=".deb,.rpm,.freebsd,.AppImage,.tar.gz,.7z,.zip,.sh,.snap" style="display: none" />
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

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
