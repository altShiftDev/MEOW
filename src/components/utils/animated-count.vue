<template>
    <span>{{ tweeningValue }}</span>
</template>

<script>
import TWEEN from 'tween.js'
/* eslint-disable no-undef */
if (typeof TWEEN === 'function') {
  console.log('Tween')
}
console.log(typeof TWEEN)
export default {
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      function animate () {
        if (TWEEN.update()) {
          requestAnimationFrame(animate)
        }
      }
      new TWEEN.Tween({
        tweeningValue: startValue
      })
        .to({
          tweeningValue: endValue
        }, 1000)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toLocaleString(undefined, { maximumFractionDigits: 4 })
        })
        .start()
      animate()
    }
  }
}
</script>

<style lang="stylus">

</style>
