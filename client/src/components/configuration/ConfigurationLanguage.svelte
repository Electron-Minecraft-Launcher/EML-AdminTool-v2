<script lang="ts">
  import ConfigurationFormTemplate from './ConfigurationFormTemplate.svelte'
  import LanguageModal from '../modals/LanguageModal.svelte'
  import en from '$assets/language/en'
  import fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import enFlag from '$assets/images/en.png'
  import frFlag from '$assets/images/fr.png'
  import { env$ } from '$services/store'
  import '$assets/scss/configure.scss'

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  let data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any } = {
    data: 'LANGUAGE',
    value: undefined,
  }

  let showLanguageModal = false

  async function toEn() {
    if (data.value != 'en') {
      if (data.value == 'fr') {
        data.value = undefined
      }
      data.value = 'en'
      let env_ = env
      env_.language = en
      env$.set(env_)
    } else {
      data.value = undefined
    }
  }

  async function toFr() {
    if (data.value != 'fr') {
      if (data.value == 'en') {
        data.value = undefined
      }
      data.value = 'fr'
      let env_ = env
      env_.language = fr
      env$.set(env_)
    } else {
      data.value = undefined
      let env_ = env
      env_.language = en
      env$.set(env_)
    }
  }

  async function languageModal() {
    showLanguageModal = true   
  }
</script>

<ConfigurationFormTemplate step={1} prev={false} cond={data.value ? true : false} {data} on:nextStep>
  <h2>{@html l.configuration.step1.title}</h2>
  <p><b>{l.configuration.step1.subtitle}</b></p>
  <div class="actions language">
    <button type="button" class="secondary" class:selected={data.value == 'en'} id="en-button" on:click={toEn}>
      <p>
        <img src={enFlag} alt="French flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary" class:selected={data.value == 'fr'} id="fr-button" on:click={toFr}>
      <p>
        <img src={frFlag} alt="French flag" />
        Français
      </p>
    </button>
    <p class="center">
      <!-- svelte-ignore a11y-missing-attribute -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <a class="small-link" on:click={languageModal}>{l.configuration.step1.other}</a>
    </p>
  </div>
</ConfigurationFormTemplate>

<LanguageModal bind:show={showLanguageModal} />

<style lang="scss">
  div.language {
    width: 500px;
    margin: 0 auto;

    button {
      display: inline-block !important;
      padding: 0;
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

    p.center {
      margin-bottom: 0;
    }
  }

  // app-language-modal {
  //   position: absolute;
  //   top: -5px;
  // }
</style>
