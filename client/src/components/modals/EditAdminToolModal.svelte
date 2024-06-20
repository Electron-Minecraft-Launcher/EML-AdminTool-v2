<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { env, l } from '../../services/store'
  import apiAdminService from '../../services/api/api-admin.service'
  import enFlag from '../../assets/images/en.png'
  import frFlag from '../../assets/images/fr.png'
  import LoadingSplash from '../../components/layouts/LoadingSplash.svelte'

  export let show: boolean

  let name: string = ''
  let language: string = 'en'
  let pin: any = false
  let splash = false

  env.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') language = $l.l
  })

  async function closeModal() {
    show = false
  }

  async function toEn() {
    language = 'en'
  }

  async function toFr() {
    language = 'fr'
  }

  async function submit() {
    splash = true
    ;(await apiAdminService.putAdminTool(name, language, pin)).subscribe({
      next: (res) => {
        window.location.href = '/dashboard/emlat-settings'
      },
      finally: () => {
        splash = false
      },
    })
  }
</script>

<ModalTemplate size={'m'} bind:show>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>Edit EML AdminTool information</h2>

  <form on:submit|preventDefault={submit}>
    <p>Leave blank if you don't want to change.</p>

    <label for="name">{$l.dashboard.emlatSettings.emlAdminToolName}</label>
    <input type="text" id="name" placeholder={$l.dashboard.emlatSettings.newName} bind:value={name} />
    <p class="warn">Changing the EML AdminTool name will change your username/pseudo too!</p>

    <p class="label">{$l.dashboard.emlatSettings.language}</p>
    <button type="button" class="secondary language" class:selected={language == 'en'} id="en-button" on:click={toEn}>
      <p>
        <img src={enFlag} alt="English flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary language" class:selected={language == 'fr'} id="fr-button" on:click={toFr}>
      <p>
        <img src={frFlag} alt="French flag" />
        Français
      </p>
    </button>

    <p class="label">{$l.main.pin}</p>
    <label class="p" for="regenerate-pin"><input type="checkbox" bind:checked={pin} id="regenerate-pin" /> Regenerate PIN</label>

    <div class="actions">
      <button class="secondary" on:click={closeModal} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.warn {
    margin: 5px 0 0 0;
    color: #fa5650;
    font-size: 12px;
  }

  button.language {
    display: inline-block !important;
    padding: 0;
    margin-top: 0px;
    margin-bottom: 15px;

    &:hover img {
      filter: brightness(115%);
    }

    &:nth-of-type(1) {
      margin-right: 31px;
    }

    &.selected {
      background: var(--primary-light-color);

      &:hover {
        background: var(--primary-light-color-hover);
      }
    }

    width: calc(50% - 18px);
    text-align: left;

    img {
      width: 80px;
      height: 40px;
      display: inline-block;
      vertical-align: middle;
      border-radius: 4px;
      margin-right: 20px;
      transition: all 0.3s ease;
    }

    p {
      display: inline-block;
      vertical-align: middle;
      margin: 0;
      font-weight: 600;
    }
  }
</style>
