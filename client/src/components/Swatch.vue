
<template>
  <div class="flex flex-col items-center">
    <div
      class="rounded  w-32 h-20 border border-solid border-transparent"
      :class="{'is-light-swatch':isLight()}"
      :style="{backgroundColor:color.rgb.raw}"
    >
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
  private isLight(): boolean {
    let r: number, g: number, b: number, hsp: number;

    r = this.color.rgb.values[0];
    g = this.color.rgb.values[1];
    b = this.color.rgb.values[2];

    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp > 250;
  }
}
</script>

<style>
.is-light-swatch {
  border-color: #e8ecef;
}
</style>
