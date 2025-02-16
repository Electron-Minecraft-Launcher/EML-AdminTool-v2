<script lang="ts">
  import { notification$ } from '../../services/store'

  let notificationValue: {
    type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
    content: string
  } | null = $state(null)

  notification$.subscribe((value) => {
    notificationValue = value
  })
</script>

{#if notificationValue && notificationValue.type == 'INFO'}
  <div class="notification info">
    <i class="fa-solid fa-circle-info"></i>{@html notificationValue.content}
  </div>
{/if}

{#if notificationValue && notificationValue.type == 'SUCCESS'}
  <div class="notification success">
    <i class="fa-solid fa-circle-check"></i>{@html notificationValue.content}
  </div>
{/if}

{#if notificationValue && notificationValue.type == 'WARNING'}
  <div class="notification warning">
    <i class="fa-solid fa-circle-exclamation"></i>{@html notificationValue.content}
  </div>
{/if}

{#if notificationValue && notificationValue.type == 'ERROR'}
  <div class="notification error">
    <i class="fa-solid fa-circle-xmark"></i>{@html notificationValue.content}
  </div>
{/if}

<style lang="scss">
  div.notification {
    position: fixed;
    top: 20px;
    right: -350px;
    padding: 15px 17px;
    border-radius: 10px;
    backdrop-filter: blur(3px);
    background-color: #ffffffa0;
    box-shadow: 0 0 30px #00000030;
    font-size: 14px;
    color: #303030;
    width: 300px;
    z-index: 10000;
    animation:
      in 0.5s ease 0.5s 1 forwards,
      out 0.5s ease 5s 1 forwards;

    i.fa-solid {
      display: inline-block;
      width: 22px;
    }

    &.info {
      border: 1px solid #dedede70;
    }
    &.success {
      border: 1px solid #50805070;
    }
    &.error {
      border: 1px solid #d0bd5070;
    }
    &.error {
      border: 1px solid #d0505070;
    }
  }

  @keyframes in {
    0% {
      right: -350px;
    }
    100% {
      right: 20px;
    }
  }

  @keyframes out {
    0% {
      right: 20px;
    }

    100% {
      right: -350px;
    }
  }
</style>
