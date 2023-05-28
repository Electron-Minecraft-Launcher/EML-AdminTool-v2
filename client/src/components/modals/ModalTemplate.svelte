<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import { env$ } from '$services/store'
  import { cubicOut } from 'svelte/easing'
  import '$assets/scss/modals.scss'

  export let size: 's' | 'm' | 'l' = 'm'
  export let show: boolean

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  async function closeModal() {
    show = false
  }

  function unscale(node: any, { duration }: any) {
    return {
      duration,
      easing: cubicOut,
      css: (t: any) => {
        return `
          display: ${t};
          opacity: ${t};
					transform: scale(${1.5 - t / 2});`
      },
    }
  }
</script>

{#if show}
  <div class="modal-background" transition:unscale={{ duration: 200 }}>
    <div class={'modal size-' + size}>
      <section class="close">
        <button class="close" on:click={closeModal}>Close&nbsp;&nbsp;<i class="fa-solid fa-times" /></button>
      </section>
      <slot />
    </div>
  </div>
{/if}
