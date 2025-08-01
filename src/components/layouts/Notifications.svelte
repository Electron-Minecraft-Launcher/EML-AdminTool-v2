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
    <div class="notification {notif.type.toLocaleLowerCase()}" in:fly={{ y: -20, duration: 300 }}>
      <i
        class="fa-solid {notif.type === 'SUCCESS'
          ? 'fa-circle-check'
          : notif.type === 'INFO'
            ? 'fa-circle-info'
            : notif.type === 'WARNING'
              ? 'fa-circle-exclamation'
              : 'fa-circle-xmark'}"
      ></i>
      <p class="message">
        {notif.message}
      </p>
    </div>
  {/each}
</div>

<style lang="scss">
  div.notification-container {
    position: fixed;
    right: 1rem;
    top: 1rem;
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    z-index: 9999;
    width: 400px;

    div.notification {
      display: flex;
      padding: 15px 17px;
      border-radius: 10px;
      backdrop-filter: blur(3px);
      box-shadow: 0 0 30px #00000030;
      font-size: 14px;
      position: relative;
      align-items: center;
      gap: 12px;

      &.info {
        background: #6aaae2a0;
        border: 1px solid #91aec6;
      }

      &.warning {
        background: #e9d876a0;
        border: 1px solid #c0b785;
      }

      &.success {
        background: #86c786a0;
        border: 1px solid #94c194;
      }

      &.error {
        background: #eb7575a0;
        border: 1px solid #dda5a5;
      }
    }
  }

  i.fa-solid {
    display: block;
    font-size: 16px;
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
</style>
