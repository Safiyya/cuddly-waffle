
<template>
  <div
    class="flex flex-col items-center cursor-pointer"
    @click="copy()"
    @mouseleave="isCopied=false"
  >
    <div
      class="swatch-square relative rounded-lg  w-32 h-20 border border-solid "
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
    <div class="w-32">
      <div class="px-1 my-1 font-bold text-sm text-grey-darkest flex flex-col items-center color-codes">
        <span
          v-show="isHEXDisplayed()"
          class="hex my-1 lowercase  "
        >{{color.hex.raw}}</span>
        <span
          v-show="isHSLDisplayed()"
          class="hsl my-1  lowercase "
        >{{color.hsl.raw}}</span>
        <span
          v-show="isRGBDisplayed()"
          class="rgb my-1  lowercase "
        >{{color.rgb.raw}}</span>
      </div>

    </div>

  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { Color, ColorDisplayOption } from "../models/color";

@Component({})
export default class Swatch extends Vue {
  @Prop(Color) color: Color;
  @Prop() displayOptions: ColorDisplayOption[];

  private isCopied: boolean = false;

  

  private isHEXDisplayed() {
    return this.displayOptions.find(
      o =>
        o.toString().toLowerCase() ===
        ColorDisplayOption.HEX.toString().toLowerCase()
    );
  }

  private isHSLDisplayed() {
    return this.displayOptions.find(
      o =>
        o.toString().toLowerCase() ===
        ColorDisplayOption.HSL.toString().toLowerCase()
    );
  }

  private isRGBDisplayed() {
    return this.displayOptions.find(
      o =>
        o.toString().toLowerCase() ===
        ColorDisplayOption.RGB.toString().toLowerCase()
    );
  }

  private isLight(): boolean {
    return this.color.getPerceivedBrightness() > 250;
  }

  private isDark(): boolean {
    return this.color.getPerceivedBrightness() < 5;
  }

  private getCopiedText() {
    let hex = this.isHEXDisplayed() ? this.color.hex.raw : null;
    let hsl = this.isHSLDisplayed() ? this.color.hsl.raw : null;
    let rgb = this.isRGBDisplayed() ? this.color.rgb.raw : null;
    return [hex, hsl, rgb].filter(i => i).join("\r\n");
  }

  private copy() {
    this.isCopied = false;
    const el = document.createElement("textarea");
    el.value = this.getCopiedText()
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
  border-color: hsl(0 , 0%, 0%, 0.1) !important;
}

/* .is-light-swatch:hover > .copy {
  @apply text-grey-darkest fill-current !important;
} */

.swatch-square > .copy {
  opacity: 0;
   @apply text-grey-dark fill-current !important;
  transition: all 400ms;
}

.swatch-square:hover {
  transition: all 400ms;
  /* @apply bg-white border !important; */
}

.swatch-square:hover > .copy {
  opacity: 1;
  transition: all 400ms;
}
</style>
