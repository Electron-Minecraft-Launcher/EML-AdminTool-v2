<script lang="ts">
  import Skeleton from '../../../components/layouts/Skeleton.svelte'
  import { env, user, l } from '../../../services/store'
</script>

<svelte:head>
  <title>{$env.name} AdminTool</title>
</svelte:head>

<h2>{$l.main.home}</h2>

{#if !user}
  <Skeleton randomWidth={{ times: 100, min: 200 }} />
{:else}
  <h3>{$l.dashboard.welcome}, {$user.name + ($l.l == 'fr' ? ' ' : '')}!</h3>
{/if}

<div class="wip">
  <p class="wip">We are still building this area!</p>
  <p class="sub-wip">You will be able to use it in a future update.</p>
</div>

<style lang="scss">
  @use '../../../assets/scss/dashboard.scss';

  div.wip {
    border-radius: 10px;
    width: calc(100% - 10px);
    // box-shadow: 0 0 0 5px #090909;
    position: relative;
    margin-top: 50px;
    padding: 100px 0;
    text-align: center;
    background: #fafafa;
    opacity: 0.6;
    transition: opacity 0.3s, box-shadow 0.3s;

    &:hover {
      opacity: 1;
      box-shadow: 0 0 50px #00000008;
    }

    p.wip {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 0;
    }

    p.sub-wip {
      font-size: 14px;
      margin-top: 5px;
    }
  }
</style>
