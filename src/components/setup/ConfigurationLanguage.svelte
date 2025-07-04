<script lang="ts">
  import LanguageModal from '../modals/Language.svelte'
  import enFlag from '../../../assets/images/en.png'
  import frFlag from '../../../assets/images/fr.png'
  import daFlag from '../../../assets/images/da.png'
  import { currentLanguage, l, type LanguageCode } from '$lib/store/language'

  interface Props {
    step: number
    setupData: { language: LanguageCode | ''; dbPassword: string; adminUsername: string; adminPassword: string }
  }

  let { step = $bindable(), setupData = $bindable() }: Props = $props()

  let showLanguageModal = $state(false)

  function switchLanguage(language: LanguageCode) {
    currentLanguage.set(language)
    setupData.language = language
  }

  function submit(e: SubmitEvent) {
    e.preventDefault()
    if (!setupData.language) return
    step++
    showLanguageModal = false
  }
</script>

<form onsubmit={submit}>
  <h2>{@html $l.configuration.step1.title}</h2>
  <p><b>{$l.configuration.step1.subtitle}</b></p>

  <div class="language">
    <button type="button" class="secondary" class:selected={setupData.language === 'en'} id="en-button" onclick={() => switchLanguage('en')}>
      <p>
        <img src={enFlag} alt="English flag" />
        English
      </p>
    </button>
    <button type="button" class="secondary" class:selected={setupData.language === 'fr'} id="fr-button" onclick={() => switchLanguage('fr')}>
      <p>
        <img src={frFlag} alt="French flag" />
        Français
      </p>
    </button>
    <button type="button" class="secondary" class:selected={setupData.language === 'da'} id="da-button" onclick={() => switchLanguage('da')}>
      <p>
        <img src={daFlag} alt="Danish flag" />
        Dansk
      </p>
    </button>

    <p class="center">
      <button class="a small-link" type="button" onclick={() => (showLanguageModal = true)}>{$l.configuration.step1.other}</button>
    </p>
  </div>

  <div class="actions">
    <button type="submit" class="primary" disabled={!setupData.language}>{$l.main.next}&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i></button>
  </div>
</form>

<LanguageModal bind:show={showLanguageModal} />

<style lang="scss">
  @use '../../assets/scss/setup.scss';

  div.language {
    width: 650px;
    margin: 0 auto;

    button:not(.a) {
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
