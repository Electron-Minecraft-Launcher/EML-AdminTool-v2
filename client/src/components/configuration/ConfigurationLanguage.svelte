<script lang="ts">
  import ConfigurationFormTemplate from './ConfigurationFormTemplate.svelte'
  import LanguageModal from '../modals/LanguageModal.svelte'
  import en from '../../assets/language/en'
  import fr from '../../assets/language/fr'
  import da from '../../assets/language/da'
  import enFlag from '../../assets/images/en.png'
  import frFlag from '../../assets/images/fr.png'
  import daFlag from '../../assets/images/da.png'
  import { env, l } from '../../services/store'

  interface Props {
    nextStep: (arg: { step: number }) => void
  }

  let { nextStep }: Props = $props()

  let data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any } = $state({
    data: 'LANGUAGE',
    value: undefined
  })

  let showLanguageModal = $state(false)

  async function toEn() {
    if (data.value != 'en') {
      if (data.value == 'fr' || data.value == 'da') {
        data.value = undefined
      }
      data.value = 'en'
      let env_ = $env
      env_.language = en
      env.set(env_)
      l.set(en)
    } else {
      data.value = undefined
    }
  }

  async function toFr() {
    if (data.value != 'fr') {
      if (data.value == 'en' || data.value == 'da') {
        data.value = undefined
      }
      data.value = 'fr'
      let env_ = $env
      env_.language = fr
      env.set(env_)
      l.set(fr)
    } else {
      data.value = undefined
      let env_ = $env
      env_.language = en
      env.set(env_)
      l.set(en)
    }
  }

  async function toDa() {
    if (data.value != 'da') {
      if (data.value == 'en' || data.value == 'fr') {
        data.value = undefined
      }
      data.value = 'da'
      let env_ = $env
      env_.language = da
      env.set(env_)
      l.set(da)
    } else {
      data.value = undefined
    }
  }

  async function languageModal() {
    showLanguageModal = true
  }
</script>

<ConfigurationFormTemplate step={1} prev={false} cond={data.value ? true : false} {data} {nextStep}>
  <h2>{@html $l.configuration.step1.title}</h2>
  <p><b>{$l.configuration.step1.subtitle}</b></p>
  <div class="actions language">
    <button type="button" class="secondary" class:selected={data.value == 'en'} id="en-button" onclick={toEn}>
      <p>
        <img src={enFlag} alt="English flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary" class:selected={data.value == 'fr'} id="fr-button" onclick={toFr}>
      <p>
        <img src={frFlag} alt="French flag" />
        Français
      </p>
    </button>
    <button type="button" class="secondary" class:selected={data.value == 'da'} id="fr-button" onclick={toDa}>
      <p>
        <img src={daFlag} alt="French flag" />
        Dansk
      </p>
    </button>
    <p class="center">
      <!-- svelte-ignore a11y_missing_attribute -->
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <a class="small-link" onclick={languageModal}>{$l.configuration.step1.other}</a>
    </p>
  </div>
</ConfigurationFormTemplate>

<LanguageModal bind:show={showLanguageModal} />

<style lang="scss">
  @use '../../assets/scss/configure.scss';

  div.language {
    width: 650px;
    margin: 0 auto;

    button {
      display: inline-block !important;
      padding: 0;
      margin-bottom: 15px;
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

    p.center {
      margin-bottom: 0;
    }
  }

  // app-language-modal {
  //   position: absolute;
  //   top: -5px;
  // }
</style>
