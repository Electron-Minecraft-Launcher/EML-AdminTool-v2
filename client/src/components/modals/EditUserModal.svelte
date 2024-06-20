<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { user, l } from '../../services/store'
  import type { User } from '../../../../shared/models/features/user.model'
  import apiAdminService from '../../services/api/api-admin.service'
  import { invalidateAll } from '$app/navigation'

  export let show: boolean
  export let account: User
  export let action: 'accept' | 'edit'

  let name = account.name
  let p_files_updater_add_del = account.p_background_mod ? true : false
  let p_bootstrap_mod = account.p_bootstrap_mod ? true : false
  let p_maintenance_mod = account.p_maintenance_mod ? true : false
  let p_news_add = account.p_news_add ? true : false
  let p_news_mod_del = account.p_news_mod_del ? true : false
  let p_news_category_add_mod_del = account.p_news_category_add_mod_del ? true : false
  let p_news_tag_add_mod_del = account.p_news_tag_add_mod_del ? true : false
  let p_background_mod = account.p_background_mod ? true : false
  let p_stats_see = account.p_stats_see ? true : false
  let p_stats_del = account.p_stats_del ? true : false

  async function closeModal() {
    show = false
  }

  async function submit() {
    const tempUser = {
      name,
      status: 1,
      p_files_updater_add_del: p_files_updater_add_del ? 1 : 0,
      p_bootstrap_mod: p_bootstrap_mod ? 1 : 0,
      p_maintenance_mod: p_maintenance_mod ? 1 : 0,
      p_news_add: p_news_add ? 1 : 0,
      p_news_mod_del: p_news_mod_del ? 1 : 0,
      p_news_category_add_mod_del: p_news_category_add_mod_del ? 1 : 0,
      p_news_tag_add_mod_del: p_news_tag_add_mod_del ? 1 : 0,
      p_background_mod: p_background_mod ? 1 : 0,
      p_stats_see: p_stats_see ? 1 : 0,
      p_stats_del: p_stats_del ? 1 : 0
    }
    ;(await apiAdminService.putUser(account.id, tempUser)).subscribe({
      next: (res) => {
        account = tempUser
        user.set(res.body.data?.user!)
        closeModal()
        invalidateAll()
      }
    })
  }
</script>

<ModalTemplate size={'s'} bind:show>
  <form on:submit|preventDefault={submit}>
    <h2>{action === 'accept' ? 'Accept' : 'Edit'} user</h2>

    <div class="overflow">
      <label for="name" style="margin-top: 0">{$l.dashboard.account.nameOrPseudo}</label>
      <input type="text" id="name" bind:value={name} />

      <p class="label">Files Updater</p>
      <label class="p" for="p_files_updater_add_del">
        <input type="checkbox" id="p_files_updater_add_del" bind:value={p_files_updater_add_del} /> Add and delete files
      </label>

      <p class="label">Bootstrap</p>
      <label class="p" for="p_bootstrap_mod">
        <input type="checkbox" id="p_bootstrap_mod" bind:value={p_bootstrap_mod} /> Modify bootstrap
      </label>

      <p class="label">Maintenance</p>
      <label class="p" for="p_maintenance_mod">
        <input type="checkbox" id="p_maintenance_mod" bind:value={p_maintenance_mod} /> Modify maintenance
      </label>

      <p class="label">News</p>
      <label class="p" for="p_news_add">
        <input
          type="checkbox"
          id="p_news_add"
          bind:value={p_news_add}
          on:change={() => {
            if (!p_news_add) p_news_mod_del = false
          }}
        /> Add news
      </label>
      <label class="p" for="p_news_mod_del">
        <input
          type="checkbox"
          id="p_news_mod_del"
          bind:value={p_news_mod_del}
          on:click={() => {
            if (p_news_mod_del) p_news_add = true
          }}
        /> Edit and Delete every news
      </label>
      <label class="p" for="p_news_category_add_mod_del">
        <input type="checkbox" id="p_news_category_add_mod_del" bind:value={p_news_category_add_mod_del} /> Add, Edit and Delete news categories
      </label>
      <label class="p" for="p_news_tag_add_mod_del">
        <input type="checkbox" id="p_news_tag_add_mod_del" bind:value={p_news_tag_add_mod_del} /> Add, Edit and Delete news tags
      </label>

      <p class="label">Background</p>
      <label class="p" for="p_background_mod">
        <input type="checkbox" id="p_background_mod" bind:value={p_background_mod} /> Change background
      </label>

      <p class="label">Stats</p>
      <label class="p" for="p_stats_see">
        <input
          type="checkbox"
          id="p_stats_see"
          bind:value={p_stats_see}
          on:change={() => {
            if (!p_stats_see) p_stats_del = false
          }}
        /> View stats
      </label>
      <label class="p" for="p_stats_del">
        <input
          type="checkbox"
          id="p_stats_del"
          bind:value={p_stats_del}
          on:change={() => {
            if (p_stats_del) p_stats_see = true
          }}
        /> Delete stats
      </label>
    </div>

    <div class="actions">
      <button class="secondary" on:click={closeModal} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @import '../../assets/scss/modals.scss';

  p.label {
    margin-top: 15px;
  }

  label.p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: black;
  }

  div.overflow {
    max-height: 350px;
    overflow-y: auto;
    overflow-x: visible;
  }
</style>
