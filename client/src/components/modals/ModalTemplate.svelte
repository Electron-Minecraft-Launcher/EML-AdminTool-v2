<script lang="ts">
  import { scale } from 'svelte/transition'

  interface Props {
    size?: 's' | 'm' | 'l'
    show: boolean
    translateX?: string
    children?: import('svelte').Snippet
  }

  let { size = 'm', show = $bindable(), translateX = '0', children }: Props = $props()
</script>

{#if show}
  <div class="modal-background" transition:scale={{ start: 1.5 }}>
    <div class={'modal size-' + size} style="transform: translateX({translateX})">
      <section class="close">
        <button class="close" onclick={() => (show = false)}>Close&nbsp;&nbsp;<i class="fa-solid fa-times"></i></button>
      </section>
      {@render children?.()}
    </div>
  </div>
{/if}

<style lang="scss">
  @use '../../assets/scss/modals.scss';

  div.modal-background {
    position: fixed;
    display: flex;
    vertical-align: middle;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.4);
    transition:
      opacity 0.3s,
      transform 0.3s;
    overflow: hidden;
    z-index: 1000;
  }

  div.modal {
    vertical-align: middle;
    transition:
      opacity 0.3s,
      transform 0.3s;

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
      height: calc(100% - 177px);
      margin: 45px 30px 30px 30px;
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
