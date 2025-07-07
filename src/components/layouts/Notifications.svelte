<script lang="ts">
  import { clearNotifications, notifications, type Notification } from '$lib/stores/notifications'
  import { fly, fade } from 'svelte/transition'
  import { onDestroy } from 'svelte'

  let items: Notification[] = []

  const unsubscribe = notifications.subscribe((value) => (items = value))

  onDestroy(() => {
    unsubscribe()
    clearNotifications()
  })
</script>

<div class="notification-container">
  {#each items as notif}
    <div class="notification {notif.type.toLocaleLowerCase()}" in:fly={{ y: 20, duration: 300 }} out:fade={{ duration: 200 }}>
      <p class="message">
        {notif.message}
      </p>
    </div>
  {/each}
</div>

<style lang="scss">
  div.notification-container {
    position: fixed;
    top: auto;
    right: 1rem;
    left: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    z-index: 9999;
    max-width: 400px;

    div.notification {
      padding: 15px 17px;
      border-radius: 10px;
      backdrop-filter: blur(3px);
      box-shadow: 0 0 30px #00000030;
      font-size: 14px;
      position: relative;

      &.info {
        background: #5094d040;
      }

      &.warning {
        background: #d0bd5040;
      }

      &.success {
        background: #50805040;
      }

      &.error {
        background: #d0505040;
      }
    }
  }

  p.message {
    margin: 0;
    padding-right: 10px;
    line-height: 1.5;

    span.title {
      font-weight: bold;
      margin: 0;
      padding-right: 10px;
    }
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.2rem;
    line-height: 1;
    color: var(--text-color);
    cursor: pointer;
    padding: 0;
    margin: 0;
  }
</style>
