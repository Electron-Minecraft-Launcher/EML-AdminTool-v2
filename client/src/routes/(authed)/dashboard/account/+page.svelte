<script lang="ts">
  import Skeleton from '$components/Skeleton.svelte'
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$, user$ } from '$services/store'
  import EditAccountModal from '$components/modals/EditAccountModal.svelte'

  let env!: Env
  let l: typeof en | typeof fr
  let user: User

  env$.subscribe((value) => {
    if (value && value.language && typeof value.language !== 'string') {
      env = value
      l = value.language
    }
  })

  user$.subscribe((value) => {
    if (value) {
      user = value
    }
  })

  let showEditAccountModal = false

  async function editAccountModal() {
    showEditAccountModal = true   
  }
</script>

<svelte:head>
  <title>{l.dashboard.account.accountSettings} • {env.name} AdminTool</title>
</svelte:head>

<h2>{l.dashboard.account.accountSettings}</h2>

<section class="section">
  <button class="secondary right" on:click={editAccountModal}><i class="fa-solid fa-pen" /></button>
  <h3>{l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{l.dashboard.account.nameOrPseudo}</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{user.name}</p>
      {/if}
    </div>

    <div>
      <p class="label">{l.main.password}</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>••••••••••</p>
      {/if}
    </div>

    <div>
      <p class="label">{l.dashboard.account.accountType}</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else}
        <p>{user.admin ? 'Administrator' : 'Standard'}</p>
      {/if}
    </div>
  </div>
</section>

<section class="section">
  <h3>{l.dashboard.permissions}</h3>

  <div class="container">
    <div>
      <p class="label">Files updater</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_files_updater_add_del}
        <p>Add and Delete files</p>
      {:else}
        <p>None</p>
      {/if}
    </div>

    <div>
      <p class="label">Bootstrap</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_bootstrap_mod}
        <p>Modify bootstrap</p>
      {:else}
        <p>None</p>
      {/if}
    </div>

    <div>
      <p class="label">Maintenance</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_maintenance_mod}
        <p>Modify maintenance status</p>
      {:else}
        <p>None</p>
      {/if}
    </div>

    <div>
      <p class="label">News</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_news_add || user.p_news_mod_del || user.p_news_category_add_mod_del || user.p_news_tag_add_mod_del}
        {#if user.p_news_add}
          <p>Add{user.p_news_mod_del ? ', Edit and Delete' : ''} news</p>
        {/if}
        {#if user.p_news_category_add_mod_del}
          <p>Add, Edit and Delete news categories</p>
        {/if}
        {#if user.p_news_tag_add_mod_del}
          <p>Add, Edit and Delete news tags</p>
        {/if}
      {:else}
        <p>None</p>
      {/if}
    </div>

    <div>
      <p class="label">Background</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_background_mod}
        <p>Change background</p>
      {:else}
        <p>None</p>
      {/if}
    </div>

    <div>
      <p class="label">Stats</p>
      {#if !user}
        <Skeleton randomWidth={{ times: 100, min: 100 }} height={'18px'} />
      {:else if user.p_stats_see}
        <p>View{user.p_stats_del ? 'and Delete' : ''} stats</p>
      {:else}
        <p>None</p>
      {/if}
    </div>
  </div>
</section>

<EditAccountModal bind:show={showEditAccountModal} />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';
</style>
