<template>
  <div class="row col-12 bg-white" style="position: relative;">
    <q-table
      class="col-12 q-card"
      table-class="items-center"
      color="primary"
      :filter="filter"
      selection="none"
      row-key="contract"
      :loading="loading"
      :data="!tokenData ? [] : tokenData"
      :columns="columns"
      :pagination.sync="pagination"
      no-data-label="No airdrops found"
      no-results-label="No results, try another search term"
    >
      <div slot="top" slot-scope="props" class="row items-center justify-between fit">
        <span class="row col-4 items-center q-pb-sm">
          <img src="statics/airdrops.svg" style="height: 30px" type="image/svg+xml" class="on-left col-auto"/>
          <div class="col">
            <span class="q-headline">{{ $t('account.airdrops')}}</span>
            <span class="q-card-subtitle block">Token Breakdown</span>
          </div>

        </span>

        <q-btn-toggle v-if="$route.meta[$route.params.network].hasValue"
          class="col-auto"
          v-model="showUSD"
          toggle-color="primary"
          :options="[
            {label: $route.meta[$route.params.network].symbol, value: false},
            {label: 'USD', value: true}
          ]"
        />
        <q-search inverted color="white" class="text-black col-sm-auto col-xs-12" placeholder="Search tokens" hide-underline v-model="filter" clearable/>
      </div>

      <q-td slot="body-cell-value" slot-scope="props" :props="props">
        <object class="" height="25px" :data="`statics/icons/${props.value.toLowerCase()}.png?v=1`" type="image/png"></object>
        <span class="on-right" style="vertical-align: super;">{{ props.value }}</span>
      </q-td>

      <q-td slot="body-cell-balance" slot-scope="props" :props="props">
         {{ props.value.toLocaleString(undefined, { maximumFractionDigits: props.row.precision }).toString() }}
      </q-td>

      <div slot="bottom" slot-scope="props" class="row justify-end fit">
        <span class="q-subheading text-weight-light">Total Value of Airdrops: <strong>{{ totalValue }}</strong></span>
      </div>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'Tokens',
  props: ['loading', 'tokenData', 'eosPrice'],
  data () {
    return {
      showUSD: false,
      rowsPerPageOptions: [0],
      pagination: {
        page: 1,
        rowsPerPage: 0,
        sortBy: 'usd_value',
        descending: true
      },
      filter: '',
      columns: [
        { name: 'value', label: 'Token', field: 'value', align: 'left', sortable: true },
        { name: 'balance',
          label: 'Balance',
          field: 'balance',
          align: 'left',
          sortable: true
        },
        { name: 'price',
          label: 'Each',
          field: 'price',
          align: 'left',
          sortable: true,
          format: x => {
            if (x) {
              let current = this.showUSD ? x : (x / this.eosPrice.USD)
              return this.showUSD ? `$${current.toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 2 : 4 })} USD` : `${current.toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 4 : 6 })} ${this.$route.meta[this.$route.params.network].symbol}`
            }
          }
        },
        { name: 'usd_value',
          label: 'Total Value',
          field: 'usd_value',
          align: 'left',
          sortable: true,
          format: x => {
            if (x) {
              let current = this.showUSD ? x : (x / this.eosPrice.USD)
              return this.showUSD ? `$${current.toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 2 : 4 })} USD` : `${current.toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 4 : 6 })} ${this.$route.meta[this.$route.params.network].symbol}`
            }
          }
        }
      ]
    }
  },
  computed: {
    totalValue () {
      let current = 0
      let total = ''
      for (var x of this.tokenData) {
        if (x.price) {
          if (this.showUSD) {
            current = x.usd_value + current
          }
          else {
            current = ((x.price / this.eosPrice.USD) * x.balance) + current
          }
        }
      }

      total = this.showUSD ? `$${current.toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 2 : 4 })} USD` : `${(current).toLocaleString(undefined, { maximumFractionDigits: current >= 1 ? 4 : 6 })} ${this.$route.meta[this.$route.params.network].symbol}`
      return total
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'

</style>
