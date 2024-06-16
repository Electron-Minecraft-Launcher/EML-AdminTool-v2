<script lang="ts">
  import type en from '../../assets/language/en'
  import type fr from '../../assets/language/fr'
  import type { Env } from '../../../../shared/models/data/env.model'
  import { env$ } from '../../services/store'
  import { cubicOut } from 'svelte/easing'
  import { scale } from 'svelte/transition'

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
</script>

{#if show}
  <div class="modal-background" transition:scale={{ start: 1.5 }}>
    <div class={'modal size-' + size}>
      <section class="close">
        <button class="close" on:click={closeModal}>Close&nbsp;&nbsp;<i class="fa-solid fa-times" /></button>
      </section>
      <slot />
    </div>
  </div>
{/if}

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  div.modal-background {
    position: fixed;
    display: flex;
    vertical-align: middle;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    transition: opacity 0.3s, transform 0.3s;
    overflow: hidden;
    z-index: 1000;
  }

  div.modal {
    vertical-align: middle;
    transition: opacity 0.3s, transform 0.3s;

    background-color: white;
    padding: 50px;
    border: 1px solid var(--border-color);
    border-radius: 10px;

    box-shadow: 0 5px 50px rgba(0, 0, 0, 0.5);
    position: relative;
    margin: auto;

    &.size-s {
      width: 400px;
    }

    &.size-m {
      width: 750px;
    }

    &.size-l {
      width: calc(100% - 60px);
      height: calc(100% - 60px);
      margin: 30px;
    }
  }

  section.close {
    position: absolute;
    top: -35px;
    left: 0;
    text-align: right;
    width: 100%;

    button {
      display: inline-block;
      padding: 10px;
      color: white;
      background: none;
      font-weight: 600;
    }
  }
</style>
