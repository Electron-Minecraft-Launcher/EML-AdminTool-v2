<script lang="ts">
  import ConfigurationFormTemplate from './ConfigurationFormTemplate.svelte'
  import en from '$assets/language/en'
  import fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import enflag from '$assets/images/en.png'
  import frflag from '$assets/images/fr.png'
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

  console.log(data.value)

  async function toEn() {
    let enButton = document.getElementById('en-button')
    let frButton = document.getElementById('fr-button')

    if (!enButton?.classList.contains('selected')) {
      if (frButton?.classList.contains('selected')) {
        frButton.classList.remove('selected')
      }
      enButton?.classList.add('selected')
      data.value = 'en'
      let env_ = env
      env_.language = en
      env$.set(env_)
    } else {
      enButton.classList.remove('selected')
      data.value = undefined
    }
  }

  async function toFr() {
    let enButton = document.getElementById('en-button')
    let frButton = document.getElementById('fr-button')

    if (!frButton?.classList.contains('selected')) {
      if (enButton?.classList.contains('selected')) {
        enButton.classList.remove('selected')
      }
      frButton?.classList.add('selected')
      data.value = 'fr'
      let env_ = env
      env_.language = fr
      env$.set(env_)
    } else {
      frButton.classList.remove('selected')
      data.value = undefined
      let env_ = env
      env_.language = en
      env$.set(env_)
    }
  }

  async function onLanguageModal() {}
</script>

<ConfigurationFormTemplate step={1} prev={false} cond={data.value ? true : false} {data}>
  <h2>{@html l.configuration.step1.title}</h2>
  <p><b>{l.configuration.step1.subtitle}</b></p>
  <div class="actions language">
    <button type="button" class="secondary" id="en-button" on:click={toEn}>
      <p>
        <img src={enflag} alt="French flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary" id="fr-button" on:click={toFr}>
      <p>
        <img src={frflag} alt="French flag" />
        Français
      </p>
    </button>
    <p class="center">
      <a class="small-link">{l.configuration.step1.other}</a>
    </p>
  </div>
</ConfigurationFormTemplate>

<!-- <app-language-modal [id]="'language-modal'" /> -->

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
