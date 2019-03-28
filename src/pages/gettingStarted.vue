<template>
  <q-page style="overflow: hidden" class="q-pa-md">
    <div class="q-title">BEFORE YOU START</div>
      <div class="q-subheading">In order to secure EOS with a Ledger Nano S, you will need:</div>
      <div class="q-body-1">
        <ul>
          <li>An <a href="https://support.ledgerwallet.com/hc/en-us/articles/360000613793">initialized</a> Ledger Nano S with the latest firmware <a href="https://support.ledgerwallet.com/hc/en-us/articles/360002731113">installed</a></li>
          <li>Ledger Live <a href="https://support.ledgerwallet.com/hc/en-us/articles/360006395233">installed and ready to use</a></li>
          <li>Google Chrome <a href="https://www.google.com/chrome/">installed</a></li>
        </ul>
      </div>

    <div class="q-title">INSTALL THE EOS DEVELOPER APP USING LEDGER LIVE</div>
    <div class="q-body-1">
      <ol>
        <li>Open the <strong>Manager</strong> in Ledger Live</li>
        <li>Connect and unlock your Ledger Nano S</li>
        <li>If asked, allow the manager on your device by pressing the right button</li>
        <li>Open the <strong>Settings</strong> menu in Ledger Live</li>
        <li>Enable the <strong>Development Mode</strong> option</li>
        <li>Open the <strong>Manager</strong> in Ledger Live</li>
        <li>Find <strong>EOS (developer)</strong> in the app catalog</li>
        <li>Click the Install button of the app
          <ul>
            <li>An installation window appears</li>
            <li>Your device will display Processing…</li>
            <li>The app installation is confirmed</li>
          </ul>
        </li>
      </ol>
    </div>

      <!-- A quick note on addresses: Your Ledger Nano S will have generated a large number of private keys for you, each of which is identified by a public address. These keys and addresses are deterministic; that is, they'll be the same every time you use the device (or at least until you reset it and change your PIN). The public addresses, like most addresses in the kUSD network, are long strings of seemingly random numbers and letters preceded by EOS. You can think of them like bank account numbers — except, unlike bank accounts, there is no personal data associated with them. Proof of ownership is established by the fact that you have possession of the Ledger Nano S and know its PIN. -->

      <div class="q-title">Option #1: ACCESS YOUR ACCOUNTS IN INTERACTIVE MODE (Ledger Device Required)</div>
      <div class="q-body-1">
        <ol>
          <li>Visit <a href="https://altShiftDev.com">altShiftDev.com</a> in your browser</li>
          <li>Make sure your Ledger Nano S is connected and unlocked, and that you’ve opened the EOS (developer) app</li>
          <li>Click on the button that says <strong>Connect to EOS using my Ledger</strong></li>
          <li>A selection of five public keys will appear, if you have an EOS account linked with any of the displayed keys the button will change color and an indicator on the top right of the button tells you how many EOS accounts are associated with each public key</li>
          <li>Click on a public key and a sub-menu below will appear</li>
          <li>To verify your public key belongs to your device click the button labeled <strong>Confirm on Ledger Device</strong>. Your device should now show you the same public key you see on your browser screen.</li>
          <li>Click the button with your account name to view your account page in interactive mode</li>
          <li>Once on your account page it is highly recommended to create a bookmark to easily access your account in the future</li>
        </ol>
      </div>
      <div class="q-title">Option #2: ACCESS YOUR ACCOUNTS IN READ-ONLY MODE (Ledger Device Not Required)</div>
      <div class="q-body-1">
        <ol>
          <li>Visit <a href="https://altShiftDev.com">altShiftDev.com</a> in your browser</li>
          <!-- <li>Make sure your Ledger Nano S is connected and unlocked, and that you’ve opened the EOS (developer) app</li> -->
          <li>Find the <strong>search box</strong> below the text that says <strong>use MEOW as an account viewer</strong></li>
          <li>Enter an EOS account name without spaces or extra characters and press <strong>ENTER</strong></li>
          <li>A sub-menu with your public key will appear</li>
          <li>Click the button with your account name to view your account page in read-only mode</li>
          <li>Once on your account page it is highly recommended to create a bookmark to easily access your account in the future</li>
        </ol>
      </div>
  </q-page>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'home',
  data () {
    return {
    }
  },
  methods: {
    openURL
  }
}
</script>
<style lang="stylus">
@import '~variables'

</style>
