<template>
  <div class="col-12 self-end q-pt-md">
    <span class="float-right relative-position border-bottom-white" style="width: 250px">

      <svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Malcolm_X_Signature" fill="#FFFFFF" fill-rule="nonzero">
            <path d="M20.2138835,9.97299009 C19.488035,11.2551113 18.8285728,12.5100178 18.752,13.659 C18.371,19.37 18.603,24.681 23.754,28.353 C24.534,28.909 23.786,30.211 22.996,29.648 C17.0735382,25.4258132 16.1481788,18.6957919 17.8019562,12.387789 C12.463843,18.0948327 8.2603117,25.069793 5.273,31.629 C4.873,32.508 3.581,31.745 3.978,30.871 C7.41189668,23.330138 12.4180077,15.3620438 18.8508604,9.23715576 C18.9955469,8.87905608 19.1477579,8.52413809 19.307,8.173 C19.561,7.612 20.217,4.828 20.796,4.654 C19.561,5.025 18.396,5.603 17.256,6.201 C14.561,7.614 11.931,9.143 9.256,10.592 C7.628,11.474 1.985,15.198 0.478,12.754 C0.35,12.547 0.325,12.2 0.478,11.996 C1.212,11.022 2.104,10.754 3.301,10.526 C4.246,10.348 4.649,11.793 3.699,11.974 C6.737,11.398 13.346,6.394 17.416,4.443 C18.467,3.939 21.564,1.995 22.135,4.074 C22.3503288,4.85651733 22.2381224,5.68137144 21.9507276,6.52534623 C25.0384448,4.055352 28.4096,2.0286 32.051,0.651 C32.957,0.309 33.345,1.76 32.45,2.099 C27.926001,3.81000882 23.8401686,6.58165317 20.2138835,9.97299009 Z" id="Shape"></path>
          </g>
        </g>
      </svg>

      <svg v-if="signed" id="signature" class="absolute-bottom-right" width="250" height="100">
        <text x="10" y="90" fill="none" opacity="0.9" stroke="white" stroke-width="0.9" font-size="50">
          {{ $route.params.accountName.toLowerCase() }}
        </text>
      </svg>

    </span>
  </div>
</template>

<script>
export default {
  name: 'Signature',
  props: ['signed']
}
</script>

<style lang="stylus">
  @import url('https://fonts.googleapis.com/css?family=Allura');

  .border-bottom-white
    border-style: solid;
    border-color: #616161;
    border-width: 0px 0px 1px 0px

  #signature
    left 15px

    text {
      font-family: 'Allura', cursive;
      FONT-weight: 800;
      stroke-dasharray: 100%;
      stroke-dashoffset: 100%;
      -webkit-transform: rotate(350deg) /* rtl:ignore */;
      transform: rotate(350deg) /* rtl:ignore */;

      -webkit-animation: draw 4s forwards;
      -moz-animation: draw 4s forwards;
      -o-animation: draw 4s forwards;
      -ms-animation: draw 4s forwards;
      animation: draw 4s forwards;
    }

  @-webkit-keyframes draw {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @-moz-keyframes draw {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @-o-keyframes draw {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @-ms-keyframes draw {
    100% {
      stroke-dashoffset: 0;
    }
  }
  @keyframes draw {
    100% {
      stroke-dashoffset: 0;
    }
  }
</style>
