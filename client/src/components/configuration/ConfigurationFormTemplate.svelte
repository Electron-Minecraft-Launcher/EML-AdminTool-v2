<script lang="ts">
  import { l } from '../../services/store'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import apiConfigureService from '../../services/api/api-configure.service'
  import { createEventDispatcher } from 'svelte'
  import utils from '../../services/utils'

  export let step: number
  export let cond: boolean = true
  export let prev: boolean = true
  export let next: boolean = true
  export let data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any }

  const dispatch = createEventDispatcher()

  let splash = false

  function nextStep() {   
    dispatch('nextStep', {
      step: step + 1,
    })
  }

  function prevStep() {
    dispatch('prevStep', {
      step: step - 1,
    })
  }

  async function submit() {
    if (data.data == 'LANGUAGE') {
      splash = true
      ;(await apiConfigureService.putLanguage(data.value)).subscribe({
        next: async (res) => {
          nextStep()
          await utils.sleep(500)
          splash = false
        },
      })
    }
    if (data.data == 'DATABASE') {
      splash = true
      ;(await apiConfigureService.putDbPassword(data.value)).subscribe({
        next: async (res) => {
          nextStep()
          await utils.sleep(500)
          splash = false
        },
      })
    }
    if (data.data == 'ADMIN') {
      splash = true
      ;(await apiConfigureService.putAdmin(data.value.name + '', data.value.password + '')).subscribe({
        next: async (res) => {
          nextStep()
          await utils.sleep(500)
          splash = false
        },
      })
    }
  }

</script>

<form on:submit|preventDefault={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}
  <slot />
  <div class="steps-actions">
    {#if prev}
      <div class="prev" style={'width: ' + (!next ? '100%' : 'auto')}>
        <button type="button" class="secondary" on:click={prevStep}>
          <i class="fa-solid fa-arrow-left" />&nbsp;&nbsp;<span>{$l.main.prev}</span>
        </button>
      </div>
    {/if}
    {#if next}
      <div class="next" style={(!prev ? 'width: 100%' : 'float: right; position: relative; top: -5px')}>
        <button type="submit" class="primary" disabled={!cond}>
          <span>{step < 3 ? $l.main.next : $l.main.finish}</span>&nbsp;&nbsp;<i class="fa-solid fa-arrow-right" />
        </button>
      </div>
    {/if}
  </div>
</form>

<style lang="scss">
  @import '../../assets/scss/configure.scss';
</style>
