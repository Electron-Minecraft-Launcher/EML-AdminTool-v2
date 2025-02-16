<script lang="ts">
  import ModalTemplate from './ModalTemplate.svelte'
  import { l } from '../../services/store'
  import type { User } from '../../../../shared/types/features/user'
  import apiAdminService from '../../services/api/api-admin.service'
  import { invalidateAll } from '$app/navigation'

  interface Props {
    show: boolean
    selectedAccount: User
    action: 'accept' | 'edit'
  }

  let { show = $bindable(), selectedAccount = $bindable(), action = $bindable() }: Props = $props()

  let name = $state('' as string)
  let p_files_updater_add_del = $state(false as boolean)
  let p_files_updater_loader_mod = $state(false as boolean)
  let p_bootstraps_mod = $state(false as boolean)
  let p_maintenance_mod = $state(false as boolean)
  let p_news_add = $state(false as boolean)
  let p_news_mod_del = $state(false as boolean)
  let p_news_categories_add_mod_del = $state(false as boolean)
  let p_news_tags_add_mod_del = $state(false as boolean)
  let p_background_mod = $state(false as boolean)
  let p_stats_see = $state(false as boolean)
  let p_stats_del = $state(false as boolean)

  function update() {
    name = selectedAccount.name + ''
    p_files_updater_add_del = selectedAccount.p_files_updater_add_del == 1
    p_files_updater_loader_mod = selectedAccount.p_files_updater_loader_mod == 1
    p_bootstraps_mod = selectedAccount.p_bootstraps_mod == 1
    p_maintenance_mod = selectedAccount.p_maintenance_mod == 1
    p_news_add = selectedAccount.p_news_add == 1
    p_news_mod_del = selectedAccount.p_news_mod_del == 1
    p_news_categories_add_mod_del = selectedAccount.p_news_categories_add_mod_del == 1
    p_news_tags_add_mod_del = selectedAccount.p_news_tags_add_mod_del == 1
    p_background_mod = selectedAccount.p_background_mod == 1
    p_stats_see = selectedAccount.p_stats_see == 1
    p_stats_del = selectedAccount.p_stats_del == 1
  }

  async function submit(e: SubmitEvent) {
    e.preventDefault()
    const tempUser = {
      name,
      status: 1,
      p_files_updater_add_del: p_files_updater_add_del ? 1 : 0,
      p_files_updater_loader_mod: p_files_updater_loader_mod ? 1 : 0,
      p_bootstraps_mod: p_bootstraps_mod ? 1 : 0,
      p_maintenance_mod: p_maintenance_mod ? 1 : 0,
      p_news_add: p_news_add ? 1 : 0,
      p_news_mod_del: p_news_mod_del ? 1 : 0,
      p_news_categories_add_mod_del: p_news_categories_add_mod_del ? 1 : 0,
      p_news_tags_add_mod_del: p_news_tags_add_mod_del ? 1 : 0,
      p_background_mod: p_background_mod ? 1 : 0,
      p_stats_see: p_stats_see ? 1 : 0,
      p_stats_del: p_stats_del ? 1 : 0
    }
    ;(await apiAdminService.putUser(selectedAccount.id, tempUser)).subscribe({
      next: (res) => {
        show = false
        selectedAccount = res.body.data?.user!
        invalidateAll()
      }
    })
  }

  $effect(() => {
    if (show) update()
  })
</script>

<ModalTemplate size={'s'} bind:show>
  <form onsubmit={submit}>
    <h2>{action === 'accept' ? 'Accept' : 'Edit'} user</h2>

    <div class="overflow">
      <label for="name" style="margin-top: 0">{$l.dashboard.account.nameOrPseudo}</label>
      <input type="text" id="name" bind:value={name} />

      <p class="label" style="margin-top: 20px">Files Updater</p>
      <label class="p" for="p_files_updater_add_del">
        <input
          type="checkbox"
          id="p_files_updater_add_del"
          bind:checked={p_files_updater_add_del}
          onchange={() => {
            if (!p_files_updater_add_del) p_files_updater_loader_mod = false
          }}
        /> Add and delete files
      </label>
      <label class="p" for="p_files_updater_loader_mod">
        <input
          type="checkbox"
          id="p_files_updater_loader_mod"
          bind:checked={p_files_updater_loader_mod}
          onchange={() => {
            if (p_files_updater_loader_mod) p_files_updater_add_del = true
          }}
        /> Change and delete Minecraft loader
      </label>

      <p class="label">Bootstraps</p>
      <label class="p" for="p_bootstraps_mod">
        <input type="checkbox" id="p_bootstraps_mod" bind:checked={p_bootstraps_mod} /> Change bootstrap files
      </label>

      <p class="label">Maintenance</p>
      <label class="p" for="p_maintenance_mod">
        <input type="checkbox" id="p_maintenance_mod" bind:checked={p_maintenance_mod} /> Change maintenance status
      </label>

      <p class="label">News</p>
      <label class="p" for="p_news_add">
        <input
          type="checkbox"
          id="p_news_add"
          bind:checked={p_news_add}
          onchange={() => {
            if (!p_news_add) {
              p_news_mod_del = false
              p_news_categories_add_mod_del = false
              p_news_tags_add_mod_del = false
            }
          }}
        /> Add news
      </label>
      <label class="p" for="p_news_mod_del">
        <input
          type="checkbox"
          id="p_news_mod_del"
          bind:checked={p_news_mod_del}
          onchange={() => {
            if (p_news_mod_del) p_news_add = true
          }}
        /> Edit and Delete every news
      </label>
      <label class="p" for="p_news_categories_add_mod_del">
        <input
          type="checkbox"
          id="p_news_categories_add_mod_del"
          bind:checked={p_news_categories_add_mod_del}
          onchange={() => {
            if (p_news_categories_add_mod_del) p_news_add = true
          }}
        /> Add, Edit and Delete news categories
      </label>
      <label class="p" for="p_news_tags_add_mod_del">
        <input
          type="checkbox"
          id="p_news_tags_add_mod_del"
          bind:checked={p_news_tags_add_mod_del}
          onchange={() => {
            if (p_news_tags_add_mod_del) p_news_add = true
          }}
        /> Add, Edit and Delete news tags
      </label>

      <p class="label">Background</p>
      <label class="p" for="p_background_mod">
        <input type="checkbox" id="p_background_mod" bind:checked={p_background_mod} /> Change background
      </label>

      <p class="label">Stats</p>
      <label class="p" for="p_stats_see">
        <input
          type="checkbox"
          id="p_stats_see"
          bind:checked={p_stats_see}
          onchange={() => {
            if (!p_stats_see) p_stats_del = false
          }}
        /> View stats
      </label>
      <label class="p" for="p_stats_del">
        <input
          type="checkbox"
          id="p_stats_del"
          bind:checked={p_stats_del}
          onchange={() => {
            if (p_stats_del) p_stats_see = true
          }}
        /> Delete stats
      </label>
    </div>

    <div class="actions">
      <button class="secondary" onclick={() => (show = false)} type="button">{$l.main.cancel}</button>
      <button class="primary">{$l.main.save}</button>
    </div>
  </form>
</ModalTemplate>

<style lang="scss">
  @use '../../assets/scss/modals.scss';

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
