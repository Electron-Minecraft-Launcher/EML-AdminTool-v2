<script lang="ts">
  import type en from '$assets/language/en'
  import type fr from '$assets/language/fr'
  import type { Env } from '$models/data/env.model'
  import type { User } from '$models/features/user.model'
  import { env$ } from '$services/store'

  export let user: User

  let env!: Env
  let l: typeof en | typeof fr

  env$.subscribe((value) => {
    env = value
    l = value.language
  })
</script>

<h4>Permissions of {user.name}</h4>

<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
<p class="label">{l.main.username}</p>
<p>{user.name}</p>
