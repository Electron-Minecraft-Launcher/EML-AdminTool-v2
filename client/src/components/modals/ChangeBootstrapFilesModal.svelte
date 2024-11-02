<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { l } from '../../services/store'
  import type { PageData } from '../../routes/(authed)/dashboard/bootstraps/$types'
  import apiBootstrapsService from '../../services/api/api-bootstraps.service'
  import { onMount } from 'svelte'

  interface Props {
    data: PageData
    show: boolean
  }

  let { data = $bindable(), show = $bindable() }: Props = $props()

  let version: string = $state('')
  let win: string = $state('')
  let mac: string = $state('')
  let lin: string = $state('')
  let files: File[] = $state([])

  let winUpload: HTMLInputElement | null = $state(null)
  let macUpload: HTMLInputElement | null = $state(null)
  let linUpload: HTMLInputElement | null = $state(null)
  let disabled: boolean = $derived(
    !version.match(/(\d\.\d\.\d)(-[a-z]*(\.\d)?)?/gi) ||
      !(winUpload as HTMLInputElement | null)?.files ||
      !(macUpload as HTMLInputElement | null)?.files ||
      !(linUpload as HTMLInputElement | null)?.files ||
      !(winUpload as HTMLInputElement | null)?.files![0] ||
      !(macUpload as HTMLInputElement | null)?.files![0] ||
      !(linUpload as HTMLInputElement | null)?.files![0]
  )

  function update() {
    version = data.bootstraps.version || ''
    win = ''
    mac = ''
    lin = ''
    files = []
    if (winUpload) {
      winUpload.value = ''
      winUpload.files = null
    }
    if (macUpload) {
      macUpload.value = ''
      macUpload.files = null
    }
    if (linUpload) {
      linUpload.value = ''
      linUpload.files = null
    }
  }

  async function uploadFile(platform: 'win' | 'mac' | 'lin') {
    ;(platform === 'win' ? winUpload! : platform === 'mac' ? macUpload! : linUpload!).click()

    await new Promise((resolve) => {
      ;(platform === 'win' ? winUpload! : platform === 'mac' ? macUpload! : linUpload!).addEventListener('change', resolve, { once: true })
    })

    if (!(platform === 'win' ? winUpload! : platform === 'mac' ? macUpload! : linUpload!).files) return

    files.push((platform === 'win' ? winUpload! : platform === 'mac' ? macUpload! : linUpload!).files!.item(0)!)
    if (platform === 'win') win = winUpload!.files!.item(0)!.name
    if (platform === 'mac') mac = macUpload!.files!.item(0)!.name
    if (platform === 'lin') lin = linUpload!.files!.item(0)!.name
  }

  function reset(platform: 'win' | 'mac' | 'lin') {
    if (platform === 'win' && winUpload) {
      win = ''
      winUpload.value = ''
      winUpload.files = null
    }

    if (platform === 'mac' && macUpload) {
      mac = ''
      macUpload.value = ''
      macUpload.files = null
    }

    if (platform === 'lin' && linUpload) {
      lin = ''
      linUpload.value = ''
      linUpload.files = null
    }
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    if (version === '') return
    if (
      version === data.bootstraps.version &&
      !confirm('You did not change the version. Are you sure you want to continue? The Launchers will not be updated.')
    )
      return

    if (win && win !== '' && files.find((file) => file.name === win)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'win', files.find((file) => file.name === win)!)).subscribe({
        next: (res) => {
          data.bootstraps = res.body.data!
          show = false
        }
      })
    }
    if (mac && mac !== '' && files.find((file) => file.name === mac)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'mac', files.find((file) => file.name === mac)!)).subscribe({
        next: (res) => {
          data.bootstraps = res.body.data!
          show = false
        }
      })
    }
    if (lin && lin !== '' && files.find((file) => file.name === lin)) {
      ;(await apiBootstrapsService.uploadBootstrap(version, 'lin', files.find((file) => file.name === lin)!)).subscribe({
        next: (res) => {
          data.bootstraps = res.body.data!
          show = false
        }
      })
    }
  }

  $effect(() => {
    if (show) update()

    files = [] as File[]
    winUpload = null as HTMLInputElement | null
    macUpload = null as HTMLInputElement | null
    linUpload = null as HTMLInputElement | null
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

    <input type="file" bind:this={winUpload} accept=".exe,.msi,.msix,.appx,.appxbundle,.appinstaller" style="display: none" />
    <input type="file" bind:this={macUpload} accept=".dmg,.app,.pkg,.zip,.tar.gz" style="display: none" />
    <input type="file" bind:this={linUpload} accept=".deb,.rpm,.freebsd,.AppImage,.tar.gz,.7z,.zip,.sh,.snap" style="display: none" />
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
