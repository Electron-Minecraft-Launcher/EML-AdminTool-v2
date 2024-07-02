<script lang="ts">
  import Skeleton from '../../../../components/layouts/Skeleton.svelte'
  import { env, user, l } from '../../../../services/store'
  import EditAccountModal from '../../../../components/modals/EditAccountModal.svelte'
  import apiAdminService from '../../../../services/api/api-admin.service'
  import { goto } from '$app/navigation'

  let showEditAccountModal = false

  async function editAccountModal() {
    showEditAccountModal = true
  }

  async function deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      ;(await apiAdminService.putUser('me', { status: -2 })).subscribe({
        finally: () => {
          localStorage.removeItem('JWT')
          goto('/')
        }
      })
    }
  }
</script>

<svelte:head>
  <title>{$l.dashboard.account.accountSettings} • {$env.name} AdminTool</title>
</svelte:head>

<h2>{$l.dashboard.account.accountSettings}</h2>

<section class="section">
  <button class="secondary right" on:click={editAccountModal}><i class="fa-solid fa-pen" /></button>
  <h3>{$l.dashboard.information}</h3>

  <div class="container">
    <div>
      <p class="label">{$l.dashboard.account.nameOrPseudo}</p>
      <p>{$user.name}</p>
    </div>

    <div>
      <p class="label">{$l.main.password}</p>
      <p>••••••••••</p>
    </div>

    <div>
      <p class="label">{$l.dashboard.account.accountType}</p>
      <p>{$user.admin ? 'Administrator' : 'Standard'}</p>
    </div>
  </div>
</section>

<section class="section">
  <h3>{$l.dashboard.permissions}</h3>

  <div class="container">
    <div>
      <p class="label">Files updater</p>
      {#if $user.p_files_updater_add_del}
        <p>Add and Delete files</p>
      {:else}
        <p>-</p>
      {/if}
    </div>

    <div>
      <p class="label">Bootstraps</p>
      {#if $user.p_bootstraps_mod}
        <p>Change bootstrap files</p>
      {:else}
        <p>-</p>
      {/if}
    </div>

    <div>
      <p class="label">Maintenance</p>
      {#if $user.p_maintenance_mod}
        <p>Change maintenance status</p>
      {:else}
        <p>-</p>
      {/if}
    </div>

    <div>
      <p class="label">News</p>
      {#if $user.p_news_add || $user.p_news_mod_del || $user.p_news_categories_add_mod_del || $user.p_news_tags_add_mod_del}
        {#if $user.p_news_add}
          <p>Add{$user.p_news_mod_del ? ', Edit and Delete' : ''} news</p>
        {/if}
        {#if $user.p_news_categories_add_mod_del}
          <p>Add, Edit and Delete news categories</p>
        {/if}
        {#if $user.p_news_tags_add_mod_del}
          <p>Add, Edit and Delete news tags</p>
        {/if}
      {:else}
        <p>-</p>
      {/if}
    </div>

    <div>
      <p class="label">Background</p>
      {#if $user.p_background_mod}
        <p>Change background</p>
      {:else}
        <p>-</p>
      {/if}
    </div>

    <div>
      <p class="label">Stats</p>
      {#if $user.p_stats_see}
        <p>View{$user.p_stats_del ? ' and Delete' : ''} stats</p>
      {:else}
        <p>-</p>
      {/if}
    </div>
  </div>
</section>

{#if !$user.admin}
  <section class="section">
    <h3>Danger zone</h3>
    <!-- ! Translation -->

    <div class="container">
      <div>
        <button class="primary danger" on:click={deleteAccount}>Delete account</button>
      </div>
    </div>
  </section>
{/if}

<EditAccountModal bind:show={showEditAccountModal} />

<style lang="scss">
  @import '../../../../assets/scss/dashboard.scss';
</style>
