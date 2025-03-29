<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { env, l } from '../../services/store'
  import apiAdminService from '../../services/api/api-admin.service'
  import enFlag from '../../assets/images/en.png'
  import frFlag from '../../assets/images/fr.png'
  import daFlag from '../../assets/images/da.png'
  import LoadingSplash from '../../components/layouts/LoadingSplash.svelte'

  interface Props {
    show: boolean
  }

  let { show = $bindable() }: Props = $props()

  let name: string = $state('')
  let language: string = $state('en')
  let pin: any = $state(false)
  let splash = $state(false)

  env.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') language = $l.l
  })

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    splash = true
    ;(await apiAdminService.putAdminTool(name, language, pin)).subscribe({
      next: (res) => {
        window.location.href = '/dashboard/emlat-settings'
      },
      finally: () => {
        splash = false
      }
    })
  }
</script>

<ModalTemplate size={'m'} bind:show>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}

  <h2>{$l.dashboard.emlatSettings.editEmlat}</h2>

  <form onsubmit={submit}>
    <p>{$l.dashboard.emlatSettings.leaveBlank}</p>

    <label for="name">{$l.dashboard.emlatSettings.emlAdminToolName}</label>
    <input type="text" id="name" placeholder={$l.dashboard.emlatSettings.newName} bind:value={name} />
    <p class="warn">{$l.dashboard.emlatSettings.nameWarn}</p>

    <p class="label">{$l.dashboard.emlatSettings.language}</p>
    <button type="button" class="secondary language" class:selected={language == 'en'} id="en-button" onclick={() => (language = 'en')}>
      <p>
        <img src={enFlag} alt="English flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary language" class:selected={language == 'fr'} id="fr-button" onclick={() => (language = 'fr')}>
      <p>
        <img src={frFlag} alt="French flag" />
        Français
      </p>
    </button>
    <button type="button" class="secondary language" class:selected={language == 'da'} id="fr-button" onclick={() => (language = 'da')}>
      <p>
        <img src={daFlag} alt="Danish flag" />
        Danish
      </p>
    </button>

    <p class="label">{$l.main.pin}</p>
    <label class="p" for="regenerate-pin">
      <input type="checkbox" bind:checked={pin} id="regenerate-pin" />
      {$l.dashboard.emlatSettings.regeneratePin}
    </label>

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  p.warn {
    margin: 5px 0 0 0;
    color: #fa5650;
    font-size: 12px;
  }

  button.language {
    display: inline-block !important;
    padding: 0;
    margin-top: 0px;
    margin-bottom: 0;
    margin-right: 25px;

    &:hover img {
      filter: brightness(115%);
    }

    &:last-of-type {
      margin-right: 0;
    }

    &.selected {
      background: var(--primary-light-color);

      &:hover {
        background: var(--primary-light-color-hover);
      }
    }

    width: calc(33% - 17.5px);
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
