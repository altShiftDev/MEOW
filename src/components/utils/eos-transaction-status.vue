<template>
  <div>
    <div class="row col-12 justify-center">
      <div class="col-auto text-left">
        <div>
          <q-spinner-oval v-if="status.validated === undefined && status.loading"/>
          <q-icon v-else-if="status.validated" name="done" color="secondary"></q-icon>
          <q-icon v-else name="error" color="negative"></q-icon>
          <span class="on-right">Transaction Validated</span>
        </div>
        <div>
          <q-spinner-oval v-if="status.walletFound === undefined && status.loading"/>
          <q-icon v-else-if="status.walletFound" name="done" color="secondary"></q-icon>
          <q-icon v-else name="error" color="negative"></q-icon>
          <span class="on-right">Ledger Found</span>
        </div>
        <div v-if="status.ledgerRequiresArbitrary">
          <q-spinner-oval v-if="ledger.arbitraryEnabled === undefined && status.loading"/>
          <q-icon v-else-if="ledger.arbitraryEnabled" name="done" color="secondary"></q-icon>
          <q-icon v-else name="error" color="negative"></q-icon>
          <span class="on-right">Arbitrary Data Mode Enabled</span>
        </div>
        <div>
          <q-spinner-oval v-if="status.txSigned === undefined && status.loading"/>
          <q-icon v-else-if="status.txSigned" name="done" color="secondary"></q-icon>
          <q-icon v-else name="error" color="negative"></q-icon>
          <span class="on-right">Transaction Signed</span>
        </div>
        <div>
          <q-spinner-oval v-if="status.txSent === undefined && status.loading"/>
          <q-icon v-else-if="status.txSent" name="done" color="secondary"></q-icon>
          <q-icon v-else name="error" color="negative"></q-icon>
          <span class="on-right">Pushed to Network</span>
        </div>
      </div>
      <span v-if="status.message" class="text-center col-12 q-px-sm">{{ status.message }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'transactionStatusHelper',
  props: ['status', 'ledger'],
  data () {
    return {}
  }
}
</script>

<style lang="stylus">
</style>
