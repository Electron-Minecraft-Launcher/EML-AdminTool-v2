<script lang="ts">
  import p from '../../../../package.json'
  import cookiesService from '../../services/cookies.service'
</script>

<footer>
  <hr />
  <p>
    EML AdminTool v{p.version} – <a href="https://discord.gg/nfEHKtghPh" target="_blank">Discord</a> –
    <a href="https://github.com/Electron-Minecraft-Launcher/EML-AdminTool-v2" target="_blank">GitHub</a>
  </p>
  {#if process.env.NODE_ENV === 'development'}
    <p style="font-size: 8px">User JWT: <code>{cookiesService.get('JWT')}</code></p>
  {/if}
</footer>

<style lang="scss">
  footer {
    width: 100%;
    text-align: center;
    margin-top: 75px;
    position: relative;
    z-index: 0;
  }

  p {
    font-size: 13px;
    line-height: 1.4;
    opacity: 0.8;
  }

  hr {
    background-color: #d8d8d8;
    height: 1px;
    border-width: 0px;
    margin-bottom: 30px;
  }
</style>
