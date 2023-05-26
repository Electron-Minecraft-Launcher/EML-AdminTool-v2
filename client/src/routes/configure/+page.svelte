<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import ConfigurationAdmin from '$components/configuration/ConfigurationAdmin.svelte'
  import ConfigurationDatabase from '$components/configuration/ConfigurationDatabase.svelte'
  import ConfigurationLanguage from '$components/configuration/ConfigurationLanguage.svelte'
  import type { Env } from '$models/data/env.model'
  import { env$ } from '$services/store'
  import { goto } from '$app/navigation'
  import type { PageData } from './$types'
  import utils from '$services/utils'
  import { fade } from 'svelte/transition'

  export let data: PageData

  if (data.start) {
    start()
  }

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  let h1Visible = false
  let sliderVisible = false
  let h1 = ''

  let step = 0

  async function start() {
    await utils.sleep(1000)
    h1 = 'Welcome!'
    h1Visible = true
    await utils.sleep(2000)
    h1Visible = false
    await utils.sleep(1000)
    h1 = 'You can now configure the EML&nbsp;Admintool.'
    h1Visible = true
    await utils.sleep(3000)
    h1Visible = false
    await utils.sleep(500)

    sliderVisible = true
    step = 1
  }

  async function finish() {
    // await displayUtils.changeTexteWithTransition('h1', 0, 500, '')
    // document.querySelector<HTMLElement>('div.config-slider')!.style.display = 'none'
    // await displayUtils.displayElementWithTransition('h1', 0, 0)
    // await displayUtils.changeTexteWithTransition('h1', 500, 1000, 'You can now use the EML&nbsp;AdminTool!')
    // await displayUtils.unDisplayElementWithTransition('h1', 1500, 500)
    // await displayUtils.unDisplayElementWithTransition('h1', 0, 500)
    goto('/')
  }
</script>

<svelte:head>
  <title>{l.configuration.configuration} • {env.name} AdminTool</title>
</svelte:head>

<div class="progress">
  <span class={'step-' + step} />
</div>

{#if h1Visible}
  <h1 transition:fade>{@html h1}</h1>
{/if}

{#if sliderVisible}
  <div class="config-slider step-1" id="config-slider" transition:fade>
    <div class="config-1">
      <ConfigurationLanguage />
    </div>
    <div class="config-2">
      <ConfigurationDatabase />
    </div>
    <div class="config-3">
      <ConfigurationAdmin />
    </div>
  </div>
{/if}

<style lang="scss">
  h1 {
    text-align: center;
    font-size: 56px;
    margin-top: 33vh;
    transition: opacity 0.5s, display 0.5s;
  }

  div.config-slider {
    width: 400vw;
    overflow-x: hidden;
    position: relative;
    transition: left 0.5s ease;

    &.step-1,
    &.step-0 {
      left: 0;
    }

    &.step-2 {
      left: -100vw;
    }

    &.step-3 {
      left: -200vw;
    }

    &.step-4 {
      left: -300vw;
    }

    div.config-1,
    div.config-2,
    div.config-3,
    div.config-4 {
      width: 100vw;
      display: inline-block;
      vertical-align: top;
      height: calc(100vh - 5px);
    }
  }

  div.progress {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: var(--medium-background-color);

    span {
      height: 5px;
      width: 0;
      transition: width 0.8s cubic-bezier(0, 0, 0.2, 1);
      background-color: var(--primary-color);
      display: block;
      border-top-right-radius: 50rem;
      border-bottom-right-radius: 50rem;

      &.step-0 {
        width: 1%;
      }

      &.step-1 {
        width: 17%;
      }

      &.step-2 {
        width: 50%;
      }

      &.step-3 {
        width: 84%;
      }

      &.step-4 {
        width: 100%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
  }
</style>
