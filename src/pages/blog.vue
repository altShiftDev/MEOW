<template>
  <q-page class="flex row justify-center">

      <!--<account-header :key="$eos.config.chainId" :totalBalance="totalBalance" :eosPrice="eosPrice" :airdrops="resources.airdrops" :settings="settings"/>-->
    <!--<div class="q-headline q-ma-md col-12">My Blog</div>-->

    <div class="row col-6 justify-center">
      <!--<div>{{ x.previewContent.subtitle }}</div>-->
      <!--<div v-for="(y, yIndex) in x.previewContent.bodyModel.paragraphs" :key="yIndex">-->

      <q-card v-for="(x, index) in previews" :key="index" inline class="q-ma-md shadow-3 col-12" style="width: 600px; overflow: hidden;">
        <q-card-media>
          <img :src="`https://miro.medium.com/fit/c/1400/420/${x.virtuals.previewImage.imageId}`">
        </q-card-media>
        <q-card-title>
          {{ x.title }}
          <span slot="subtitle" class="ellipsis-2-lines">{{ x.virtuals.subtitle }}</span>
        </q-card-title>
        <q-card-main class="row justify-around">
          <!--{{ x.createdAt }}-->
          <div class="col-auto">
            <q-icon name="favorite"/>{{ x.virtuals.totalClapCount }}
          </div>
          <div class="col"></div>
          <div class="col-auto">
            <q-icon name="comment" class="on-left"/>{{ x.virtuals.responsesCreatedCount }}
          </div>
          <div class="col"></div>
          <div class="col-auto">
            <q-icon name="access_time"/> {{ Math.round((x.virtuals.wordCount / 265) + Math.round(x.virtuals.imageCount * .18)) }} min
          </div>
        </q-card-main>
      </q-card>
      <!--</div>-->

      <!--<div >-->
        <!--<div>{{ x.name }}</div>-->
        <!--<img v-if="x.name === 'previewImage'" />-->
      <!--</div>-->
    </div>
  </q-page>
</template>

<script>
// import accountHeader from 'components/account-header.vue'
import { openURL } from 'quasar'

export default {
  name: 'blog',
  components: {},
  data () {
    return {
      previews: []
      // article: this.$route.params.article
    }
  },
  methods: {
    openURL,
    async getArticle () {
      // let cors = 'https://crossorigin.me/'
      let cors = 'https://cors-escape.herokuapp.com/'
      let baseUrl = 'https://medium.com/@altshiftdev/latest?format=json'
      let apiUrl = cors + baseUrl
      // let apiUrl = 'https://medium.com/coinmonks/cf9677561db7?format=json'
      // let r = await this.$axios.get(apiUrl)

      let r = await this.$axios.get(apiUrl)
      console.log('Article:', r)
      let data = r.data.split('])}while(1);</x>')
      data = data[1]
      // console.log('data cleaned', data)
      data = JSON.parse(data)
      console.log('data parsed', data)
      this.previews = data.payload.references.Post
      console.log('Previews', this.previews)
    },
    async initialize () {
      // let article = this.$route.params.accountName
      this.getArticle()
    }
  },
  computed: {},
  watch: {},
  mounted () {
    this.initialize()
  },
  beforeMount () {
    console.log('Blog Routes:', this.$route.params)
    // if (this.$route.params.dPath) {
    // dPath.urlProvided = this.$route.params.dPath.replace(/-/g, '/')
    // }
  }
}
</script>

<style lang="stylus">

</style>
