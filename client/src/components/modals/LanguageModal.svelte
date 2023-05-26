<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import { env$ } from '$services/store'
  import '$assets/scss/modals.scss'

  export let show: boolean

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })
</script>

<ModalTemplate size={'s'} bind:show={show}>
  <h2>{@html l.modals.language.title}</h2>
  <p>{@html l.modals.language.content}</p>
  <div class="actions">
    <a class="not-a" href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2" target="_blank">
      <button class="primary">{@html l.main.more}...&nbsp;&nbsp;<i class="fa-solid fa-arrow-up-right-from-square" /></button>
    </a>
  </div>
</ModalTemplate>
