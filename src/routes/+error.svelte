<script lang="ts">
  import { page } from '$app/state'
  import { l } from '$lib/stores/language'
  import type { NotificationCode } from '$lib/utils/notifications'
  import Footer from '../components/layouts/Footer.svelte'

  const message = $state(
    page.error?.message && Object.keys($l.notifications).includes(page.error.message)
      ? $l.notifications[page.error.message as NotificationCode]
      : $l.notifications.INTERNAL_SERVER_ERROR
  )

  function reload() {
    window.location.reload()
  }
</script>

<div class="flex">
  <div class="img">
    <img src="/images/emlat-mc.png" alt="EML AdminTool" />
  </div>
  <div class="msg">
    <h1>
      <span>Error</span><br />
      {page.status}
    </h1>
    <p class="msg">{message}</p>

    <button class="secondary" onclick={reload}><i class="fa-solid fa-rotate-right"></i>&nbsp;&nbsp;Try to reload the page</button>
  </div>
</div>

<div class="footer-container">
  <Footer />
</div>

<style lang="scss">
  div.flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 0 100px;
  }

  div.img {
    flex: 1;
    display: flex;
    justify-content: center;

    img {
      width: 375px;
      height: 385px;
      object-fit: contain;
      filter: grayscale(100%);
    }
  }

  div.msg {
    flex: 1;
    text-align: center;

    h1 {
      font-size: 80px;
      margin-bottom: 20px;
      line-height: 1.1;

      span {
        font-size: 50px;
      }
    }

    p.msg {
      font-size: 20px;
      color: #333;
    }

    button {
      display: block;
      margin: 50px auto 100px auto;
    }
  }

  div.footer-container {
    padding: 50px 100px 0 100px;
    position: relative;
  }
</style>
