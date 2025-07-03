<script lang="ts">
  import { l } from '../../lib/store/language'
  import LoadingSplash from '../layouts/LoadingSplash.svelte'
  import { sleep } from '../../lib/utils/utils'

  interface Props {
    step: number
    cond?: boolean
    prev?: boolean
    next?: boolean
    nextStep: (arg: { step: number }) => void
    prevStep?: (arg: { step: number }) => void
    data: { data: 'LANGUAGE' | 'DATABASE' | 'ADMIN'; value: any }
    children?: import('svelte').Snippet
  }

  let { step, cond = true, prev = true, next = true, nextStep, prevStep, data, children }: Props = $props()

  let splash = $state(false)

  async function submit(e: SubmitEvent) {
    // e.preventDefault()
    // if (data.data == 'LANGUAGE') {
    //   splash = true
    //   ;(await apiConfigureService.putLanguage(data.value)).subscribe({
    //     next: async (res) => {
    //       nextStep({ step: step + 1 })
    //       await utils.sleep(500)
    //       splash = false
    //     }
    //   })
    // }
    // if (data.data == 'DATABASE') {
    //   splash = true
    //   ;(await apiConfigureService.putDbPassword(data.value)).subscribe({
    //     next: async (res) => {
    //       nextStep({ step: step + 1 })
    //       await utils.sleep(500)
    //       splash = false
    //     }
    //   })
    // }
    // if (data.data == 'ADMIN') {
    //   splash = true
    //   ;(await apiConfigureService.putAdmin(data.value.name + '', data.value.password + '')).subscribe({
    //     next: async (res) => {
    //       nextStep({ step: step + 1 })
    //       await utils.sleep(500)
    //       splash = false
    //     }
    //   })
    // }
  }
</script>

<form onsubmit={submit}>
  {#if splash}
    <LoadingSplash transparent={true} />
  {/if}
  {@render children?.()}
  <div class="steps-actions">
    {#if prev}
      <div class="prev" style={'width: ' + (!next ? '100%' : 'auto')}>
        <button
          type="button"
          class="secondary"
          onclick={() => {
            if (prevStep) prevStep({ step: step - 1 })
          }}
        >
          <i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;<span>{$l.main.prev}</span>
        </button>
      </div>
    {/if}
    {#if next}
      <div class="next" style={!prev ? 'width: 100%' : 'float: right; position: relative; top: -5px'}>
        <button type="submit" class="primary" disabled={!cond}>
          <span>{step < 3 ? $l.main.next : $l.main.finish}</span>&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    {/if}
  </div>
</form>

<style lang="scss">
  @use '../../assets/scss/configure.scss';
</style>
