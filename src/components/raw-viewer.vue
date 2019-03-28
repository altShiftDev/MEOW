<template>
  <div class="row justify-around full-width " style="position: relative; height: auto;z-index: 99999999999;">

    <q-card v-if="JSONOne" inline class="q-ma-sm q-pb-none bg-white col-xs-12 no-wrap elipsis">

<!--       <q-card-title class="q-pb-sm elipsis">
        <span slot="subtitle" class="col-12 q-card-subtitle">{{ titleOne }}</span>
      </q-card-title> -->

      <q-collapsible :opened="false" icon="account_circle" :label="titleOne">
        <div class="full-width raw-viewer">
          <pre v-highlightjs="JSONOne" class="q-mb-none raw-viewer">
            <code class="json" v-html="JSONOne"></code>
          </pre>
        </div>
      </q-collapsible>
    </q-card>

    <q-card v-if="!(Object.keys(JSONTwo).length === 0 && JSONTwo.constructor === Object)" inline class="q-ma-sm q-pb-none bg-white col-xs-12 no-wrap elipsis">

      <q-collapsible :opened="false" :icon="icon" color="red" :label="titleTwo" :sublabel="sublabel">
        <div class="full-width raw-viewer">
          <pre v-highlightjs="JSONTwo" class="q-mb-none raw-viewer">
            <code :class="titleTwo === 'Transaction Data' ? 'JSON' : 'HTTP'" v-html="JSONTwo"></code>
          </pre>
        </div>
      </q-collapsible>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'rawViewer',
  props: ['titleOne', 'titleTwo', 'JSONOne', 'JSONTwo'],
  data () {
    return {
      success: (this.JSONTwo.transaction_id)
    }
  },
  computed: {
    icon () {
      if (this.titleTwo === 'Transaction Data') {
        return 'history'
      }
      else {
        return (this.success) ? 'check_circle' : 'highlight_off'
      }
    },
    sublabel () {
      if (this.titleTwo === 'Transaction Data') {
        return ''
      }
      else {
        return (this.success) ? 'Transaction Succeeded' : 'Transaction Failed'
      }
    }
  },
  watch: {
    JSONTwo: function (newVal, oldVal) {
      this.success = (newVal.transaction_id)
    }
  }
}
</script>

<style lang="stylus">
@import '~variables'
.raw-viewer
  background: #272822
  overflow: scroll
  // height: 400px

.hljs
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #272822;
  color: #ddd;

</style>
<style>
.hljs {
  display: block;
  overflow-x: auto;
  padding: 0.5em;
  background: #272822; color: #ddd;
}

.hljs-tag,
.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-strong,
.hljs-name {
  color: #f92672;
}

.hljs-code {
  color: #66d9ef;
}

.hljs-class .hljs-title {
  color: white;
}

.hljs-attribute,
.hljs-symbol,
.hljs-regexp,
.hljs-link {
  color: #bf79db;
}

.hljs-string,
.hljs-bullet,
.hljs-subst,
.hljs-title,
.hljs-section,
.hljs-emphasis,
.hljs-type,
.hljs-built_in,
.hljs-builtin-name,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-addition,
.hljs-variable,
.hljs-template-tag,
.hljs-template-variable {
  color: #a6e22e;
}

.hljs-comment,
.hljs-quote,
.hljs-deletion,
.hljs-meta {
  color: #75715e;
}

.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-doctag,
.hljs-title,
.hljs-section,
.hljs-type,
.hljs-selector-id {
  font-weight: bold;
}
</style>
