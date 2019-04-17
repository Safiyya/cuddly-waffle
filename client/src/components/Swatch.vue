
<template>
  <div class="flex flex-col items-center cursor-pointer">
    <div
      class="swatch-square relative rounded  w-32 h-20 border-2 border-solid "
      :class="{'is-light-swatch':isLight(), 'is-dark-swatch':isDark()}"
      :style="{backgroundColor:color.rgb.raw, borderColor:color.rgb.raw}"
    >
      <div class="copy centered  w-1/3 fill-current" :style="{color:color.rgb.raw}">

        <simple-svg
          :width="'100%'"
          :height="'100%'"
          :filepath="require('../assets/copy.svg')"
        />
      </div>
    </div>
    <span class="my-2 lowercase">{{color.hex.raw}}</span>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import Color from "../models/color";

@Component({})
export default class Swatch extends Vue {
  @Prop(Color) color: Color;

  /**
   * HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
   */
  private getHSP(): number {
    let r: number, g: number, b: number, hsp: number;

    r = this.color.rgb.values[0];
    g = this.color.rgb.values[1];
    b = this.color.rgb.values[2];

    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp ;
  }

  private isLight(): boolean {
    return this.getHSP() > 240;
  }

  private isDark(): boolean {
    return this.getHSP() < 5;
  }
}
</script>

<style>
.is-light-swatch {
  border-color: #e8ecef!important;
}

.is-light-swatch > .copy {
  @apply text-grey-dark fill-current !important;
}


.swatch-square > .copy {
    opacity: 0;
    transition:all 400ms;
}

.swatch-square:hover{
    transition:all 400ms;
    @apply bg-white border-2 !important;
}

.swatch-square:hover > .copy {
    opacity: 1;
    transition:all 400ms;
}
</style>
