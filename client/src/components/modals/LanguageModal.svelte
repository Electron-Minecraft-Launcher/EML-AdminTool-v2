<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { l } from '../../services/store'

  export let show: boolean
</script>

<ModalTemplate size={'s'} bind:show>
  <h2>{@html $l.modals.language.title}</h2>
  <p>{@html $l.modals.language.content}</p>
  <div class="actions">
    <a class="not-a" href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2?tab=readme-ov-file#want-to-help" target="_blank">
      <button class="primary">{@html $l.main.more}...&nbsp;&nbsp;<i class="fa-solid fa-arrow-up-right-from-square" /></button>
    </a>
  </div>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';
</style>
