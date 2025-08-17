<script lang="ts">
  import { page } from '$app/state'
  import { l } from '$lib/stores/language'
  import getEnv from '$lib/utils/env'
  import type { NotificationCode } from '$lib/utils/notifications'

  const env = getEnv()

  const message = $state(
    page.status === 404
      ? $l.notifications.NOT_FOUND
      : page.error?.message && Object.keys($l.notifications).includes(page.error.message)
        ? $l.notifications[page.error.message as NotificationCode]
        : $l.notifications.INTERNAL_SERVER_ERROR
  )
</script>

<svelte:head>
  <title>{page.status} • {env.name} AdminTool</title>
</svelte:head>

&lcub;
  "success": false,
  "message": {message}
&rcub;
