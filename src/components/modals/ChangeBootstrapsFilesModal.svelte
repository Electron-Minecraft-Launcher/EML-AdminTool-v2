<script lang="ts">
  import { l } from '$lib/stores/language'
  import ModalTemplate from './__ModalTemplate.svelte'
  import type { File as File_ } from '$lib/utils/types'
  import { SemVer } from 'semver'

  interface Props {
    show: boolean
    bootstraps: { version?: string; winFile: File_ | null; macFile: File_ | null; linFile: File_ | null }
  }

  let { show = $bindable(), bootstraps }: Props = $props()

  const versionInfo = `The version must follow the format: x.y.z, x.y.z-beta.x, or x.y.z-alpha.x. The new version must be higher than the current version (${bootstraps.version}).`

  let version = $state(bootstraps.version ?? '')
  let win = $state('')
  let mac = $state('')
  let lin = $state('')
  let files: File[] = []

  let winInput: HTMLInputElement | undefined = $state()
  let macInput: HTMLInputElement | undefined = $state()
  let linInput: HTMLInputElement | undefined = $state()

  let disabled: boolean = $derived(
    !version.match(/(\d\.\d\.\d)(-[a-z]*(\.\d)?)?/gi) ||
      winInput?.files?.length === 0 ||
      macInput?.files?.length === 0 ||
      linInput?.files?.length === 0
  )

  async function uploadFile(platform: 'win' | 'mac' | 'lin') {
    let current: HTMLInputElement
    if (platform === 'win') current = winInput!
    else if (platform === 'mac') current = macInput!
    else current = linInput!
    current.click()

    await new Promise((resolve) => {
      current.addEventListener('change', resolve, { once: true })
    })

    if (!current.files) return

    files.push(current.files!.item(0)!)
    if (platform === 'win') win = current!.files!.item(0)!.name
    if (platform === 'mac') mac = current!.files!.item(0)!.name
    if (platform === 'lin') lin = current!.files!.item(0)!.name
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
    // e.preventDefault()
    // if (version === '') return
    // if (
    //   version === data.bootstraps.version &&
    //   !confirm('You did not change the version. Are you sure you want to continue? The Launchers will not be updated.')
    // )
    //   return
    // let bootstrapsRes: BootstrapsRes = data.bootstraps
    // if (win && win !== '' && files.find((file) => file.name === win)) {
    //   ;(await apiBootstrapsService.uploadBootstrap(version, 'win', files.find((file) => file.name === win)!)).subscribe({
    //     next: (res) => {
    //       bootstrapsRes = res.body.data!
    //     }
    //   })
    // }
    // if (mac && mac !== '' && files.find((file) => file.name === mac)) {
    //   ;(await apiBootstrapsService.uploadBootstrap(version, 'mac', files.find((file) => file.name === mac)!)).subscribe({
    //     next: (res) => {
    //       bootstrapsRes = res.body.data!
    //     }
    //   })
    // }
    // if (lin && lin !== '' && files.find((file) => file.name === lin)) {
    //   ;(await apiBootstrapsService.uploadBootstrap(version, 'lin', files.find((file) => file.name === lin)!)).subscribe({
    //     next: (res) => {
    //       bootstrapsRes = res.body.data!
    //     }
    //   })
    // }
    // data.bootstraps = bootstrapsRes
    // show = false
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>Change bootstraps and version</h2>

    <label for="version" style="margin-top: 0">New version&nbsp;&nbsp;<i class="fa-solid fa-circle-question" title={versionInfo} style="cursor: help"></i></label>
    <input type="text" id="version" placeholder="1.0.2, 2.4.0-beta.3" bind:value={version} />

    <p class="label" style="margin-top: 20px"><i class="fa-brands fa-microsoft"></i>&nbsp;&nbsp;Windows Bootstrap</p>
    {#if !win || win === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('win')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{win}</p>
      <button type="button" class="remove" onclick={() => reset('win')} aria-label="Remove Windows Bootstrap"
        ><i class="fa-solid fa-circle-xmark"></i></button
      >
    {/if}

    <p class="label"><i class="fa-brands fa-apple"></i>&nbsp;&nbsp;macOS Bootstrap</p>
    {#if !mac || mac === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('mac')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{mac}</p>
      <button type="button" class="remove" onclick={() => reset('mac')} aria-label="Remove macOS Bootstrap"
        ><i class="fa-solid fa-circle-xmark"></i></button
      >
    {/if}

    <p class="label"><i class="fa-brands fa-linux"></i>&nbsp;&nbsp;Linux Bootstrap</p>
    {#if !lin || lin === ''}
      <button type="button" class="secondary upload" onclick={() => uploadFile('lin')}>
        <i class="fa-solid fa-file-arrow-up"></i>&nbsp;&nbsp;Select a file...
      </button>
    {:else}
      <p class="no-link">{lin}</p>
      <button type="button" class="remove" onclick={() => reset('lin')} aria-label="Remove Linux Bootstrap"
        ><i class="fa-solid fa-circle-xmark"></i></button
      >
    {/if}

    <div class="actions">
      <button type="button" class="secondary" onclick={() => (show = false)}>{$l.main.cancel}</button>
      <button type="submit" class="primary" {disabled}>{$l.main.save}</button>
    </div>

    <input type="file" id="win-upload" accept=".exe,.msi,.msix,.appx,.appxbundle,.appinstaller" style="display: none" bind:this={winInput} />
    <input type="file" id="mac-upload" accept=".dmg,.app,.pkg,.zip,.tar.gz" style="display: none" bind:this={macInput} />
    <input type="file" id="lin-upload" accept=".deb,.rpm,.freebsd,.AppImage,.tar.gz,.7z,.zip,.sh,.snap" style="display: none" bind:this={linInput} />
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
