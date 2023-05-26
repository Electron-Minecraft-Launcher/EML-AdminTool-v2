<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import { env$ } from '$services/store'
  import LoadingSplash from '../LoadingSplash.svelte'
  import ApiConfigureService from '$services/api/api-configure.service'
  import '$assets/scss/configure.scss'
  import utils from '$services/utils'

  export let step: number
  export let cond: boolean = true
  export let prev: boolean = true
  export let next: boolean = true
  export let data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any }

  const apiConfigure = new ApiConfigureService()

  let env!: Env
  let l: typeof en | typeof fr

  let splash = false

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  async function submit() {
    if (data.data == 'LANGUAGE') {
      splash = true
      ;(await apiConfigure.putLanguage(data.value)).subscribe({
        next: async (res) => {
          // this.stepManagerService.updateStep(2)
          await utils.sleep(500)
          splash = false
        },
      })
    }
    if (data.data == 'DATABASE') {
      splash = true
      ;(await apiConfigure.putDbPassword(data.value)).subscribe({
        next: async (res) => {
          // this.stepManagerService.updateStep(3)
          await utils.sleep(500)
          splash = false
        },
      })
    }
    if (data.data == 'ADMIN') {
      splash = true
      ;(await apiConfigure.putAdmin(data.value.name + '', data.value.password + '')).subscribe({
        next: async (res) => {
          // this.stepManagerService.updateStep(4)
          await utils.sleep(500)
          splash = false
        },
      })
    }
  }

  async function onPrevious() {}
</script>

<form on:submit|preventDefault={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}
  <slot />
  <div class="steps-actions">
    {#if prev}
      <div class="prev" style={'width: ' + (!next ? '100%' : 'auto')}>
        <button type="button" class="secondary" on:click={onPrevious}>
          <i class="fa-solid fa-arrow-left" />&nbsp;&nbsp;<span>{l.main.prev}</span>
        </button>
      </div>
    {/if}
    {#if next}
      <div class="next" style={'width: ' + (!prev ? '100%' : 'auto')}>
        <button type="submit" class="primary" disabled={!cond}>
          <span>{step < 3 ? l.main.next : l.main.finish}</span>&nbsp;&nbsp;<i class="fa-solid fa-arrow-right" />
        </button>
      </div>
    {/if}
  </div>
</form>
