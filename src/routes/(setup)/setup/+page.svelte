<script lang="ts">
  import ConfigurationAdmin from '../../../components/setup/ConfigurationAdmin.svelte'
  import ConfigurationDatabase from '../../../components/setup/ConfigurationDatabase.svelte'
  import ConfigurationLanguage from '../../../components/setup/ConfigurationLanguage.svelte'
  import { l, type LanguageCode } from '$lib/store/language'
  import { goto } from '$app/navigation'
  import type { PageProps } from './$types'
  import { sleep } from '$lib/utils/utils'
  import { fade } from 'svelte/transition'
  import { getContext, onMount } from 'svelte'
  import type { Env } from '$lib/utils/types'

  let { data }: PageProps = $props()

  const env = getContext<Env>('env')

  let setupData = $state({
    language: '' as LanguageCode | '',
    dbPassword: '',
    adminUsername: '',
    adminPassword: ''
  })

  let showH1: boolean = $state(false)
  let showSlider: boolean = $state(false)
  let h1: string = $state('')

  let step = $state(0)

  async function finish() {
    await sleep(1000)
    showSlider = false
    await sleep(500)
    h1 = $l.configuration.finally
    showH1 = true
    await sleep(2000)
    showH1 = false
    await sleep(1000)
    await fetch('/api/setup/mark-as-configured', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {
      goto('/')
    }).catch((err) => {
      // TODO
    })
  }

  onMount(async () => {
    await sleep(1000)
    // h1 = 'Welcome!'
    // h1Visible = true
    // await sleep(2000)
    // h1Visible = false
    // await sleep(1000)
    // h1 = 'You can now configure EML&nbsp;Admintool.'
    // h1Visible = true
    // await sleep(3000)
    showH1 = false
    await sleep(500)

    showSlider = true
    step = 1
  })

  $effect(() => {
    if (step >= 4) finish()
  })
</script>

<svelte:head>
  <title>{$l.configuration.configuration} • {env.name} AdminTool</title>
</svelte:head>

<div class="progress">
  <span class:step-0={step == 0} class:step-1={step == 1} class:step-2={step == 2} class:step-3={step == 3} class:step-4={step == 4}></span>
</div>

{#if showH1}
  <h1 transition:fade>{@html h1}</h1>
{/if}

{#if showSlider}
  <div
    class="config-slider"
    class:step-0={step === 0}
    class:step-1={step === 1}
    class:step-2={step === 2}
    class:step-3={step === 3}
    class:step-4={step === 4}
    id="config-slider"
    transition:fade
  >
    <div class="config-1">
      <ConfigurationLanguage bind:step bind:setupData />
    </div>
    <div class="config-2">
      <ConfigurationDatabase bind:step bind:setupData />
    </div>
    <div class="config-3">
      <ConfigurationAdmin bind:step bind:setupData />
    </div>
  </div>
{/if}

<style lang="scss">
  h1 {
    text-align: center;
    font-size: 56px;
    margin-top: 33vh;
    transition:
      opacity 0.5s,
      display 0.5s;
  }

  div.config-slider {
    width: 400vw;
    overflow-x: hidden;
    transition: transform 0.5s ease;
    display: flex;

    &.step-1,
    &.step-0 {
      transform: translateX(0);
    }

    &.step-2 {
      transform: translateX(-100vw);
    }

    &.step-3 {
      transform: translateX(-200vw);
    }

    &.step-4 {
      transform: translateX(-300vw);
    }

    div.config-1,
    div.config-2,
    div.config-3 {
      width: 100vw;
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
