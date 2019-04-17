
<template>
  <div
    class="flex flex-col items-center cursor-pointer"
    @click="copy()" @mouseleave="isCopied=false"
  >
    <div
      class="swatch-square relative rounded  w-32 h-20 border-2 border-solid "
      :class="{'is-light-swatch':isLight(), 'is-dark-swatch':isDark()}"
      :style="{backgroundColor:color.rgb.raw, borderColor:color.rgb.raw}"
    >
      <div
        class="copy centered  w-1/4 fill-current"
        :style="{color:color.rgb.raw}"
      >
        <simple-svg
          v-show="!isCopied"
          :width="'100%'"
          :height="'100%'"
          :filepath="require('../assets/copy.svg')"
        />
        <span v-show="isCopied">Copied!</span>
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

  private isCopied: boolean = false;

  /**
   * HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
   */
  private getHSP(): number {
    let r: number, g: number, b: number, hsp: number;

    r = this.color.rgb.values[0];
    g = this.color.rgb.values[1];
    b = this.color.rgb.values[2];

    hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

    return hsp;
  }

  private isLight(): boolean {
    return this.getHSP() > 240;
  }

  private isDark(): boolean {
    return this.getHSP() < 5;
  }

  private copy() {
      this.isCopied = false;
    const el = document.createElement("textarea"); // Create a <textarea> element
    el.value = this.color.hex.raw; // Set its value to the string that you want copied
    el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
    el.style.position = "absolute";
    el.style.left = "-9999px"; // Move outside the screen to make it invisible
    document.body.appendChild(el); // Append the <textarea> element to the HTML document
    const selected =
      document.getSelection().rangeCount > 0 // Check if there is any content selected previously
        ? document.getSelection().getRangeAt(0) // Store selection if found
        : false; // Mark as false to know no selection existed before
    el.select(); // Select the <textarea> content
    document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
    document.body.removeChild(el); // Remove the <textarea> element
    if (selected) {
      // If a selection existed before copying
      document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
      document.getSelection().addRange(selected); // Restore the original selection
    }
      this.isCopied = true;
  }
}
</script>

<style>
.is-light-swatch {
  border-color: #e8ecef !important;
}

.is-light-swatch > .copy {
  @apply text-grey-dark fill-current !important;
}

.swatch-square > .copy {
  opacity: 0;
  transition: all 400ms;
}

.swatch-square:hover {
  transition: all 400ms;
  @apply bg-white border-2 !important;
}

.swatch-square:hover > .copy {
  opacity: 1;
  transition: all 400ms;
}
</style>
