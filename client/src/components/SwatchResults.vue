
<template>
  <div>

    <swatch-group
      v-for="(value, key) in colorGroups"
      :key="key"
      class="swatch-group"
      :label="key"
      :description="getGroupDescription(key)"
      :colors="getGroup(key)"
      :display-options="displayOptions"
    ></swatch-group>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { Color, ColorDisplayOption } from "../models/color";
import SwatchGroup from "./SwatchGroup.vue";

@Component({
  components: {
    "swatch-group": SwatchGroup
  }
})
export default class SwatchResults extends Vue {
  @Prop() colors: Color[];
  @Prop() displayOptions: ColorDisplayOption[];

  public get colorGroups() {
    return this.colors
      .map(c => {
        return this.matchColor(c);
      })
      .sort((a, b) => a.order - b.order)
      .reduce(
        (r, v, i, a, k = v.label) => ((r[k] || (r[k] = [])).push(v), r),
        {}
      );
  }

  getGroup(key: any): Color[] {
    console.log(this.colorGroups);
    return this.colorGroups[key]
      .map(i => i.color)
      .sort((a: Color, b: Color) => b.getPerceivedBrightness() - a.getPerceivedBrightness());
  }

  getGroupDescription(key: any): string {
    return this.colorGroups[key].map(i => i.description)[0];
  }

  matchColor(c: Color) {
    if (this.isGrey(c)) {
      return {
        label: "Grey",
        description: "Low saturation",
        color: c,
        order: 1
      };
    } else if (this.isRed(c)) {
      return { label: "Red", description: "Hue below 20", color: c, order: 2 };
    } else if (this.isOrange(c)) {
      return {
        label: "Orange",
        description: "Hue between 20 and 50",
        color: c,
        order: 3
      };
    } else if (this.isYellow(c)) {
      return {
        label: "Yellow",
        description: "Hue between 50 and 70",
        color: c,
        order: 4
      };
    } else if (this.isGreen(c)) {
      return {
        label: "Green",
        description: "Hue between 70 and 170",
        color: c,
        order: 5
      };
    } else if (this.isBlue(c)) {
      return {
        label: "Blue",
        description: "Hue between 170 and 260",
        color: c,
        order: 6
      };
    } else if (this.isPurple(c)) {
      return {
        label: "Purple",
        description: "Hue between 260 and 310",
        color: c,
        order: 7
      };
    } else if (this.isPink(c)) {
      return {
        label: "Pink",
        description: "Hue abobe 310",
        color: c,
        order: 8
      };
    }
  }

  isGrey(c: Color) {
    return c.hsl.values[1] < 20;
  }

  isHueBetween(c: Color, min: number, max: number) {
    return c.hsl.values[0] > min && max >= c.hsl.values[0];
  }

  isRed(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 0, 20);
  }

  isOrange(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 20, 50);
  }

  isYellow(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 50, 70);
  }
  isGreen(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 70, 170);
  }

  isBlue(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 170, 260);
  }

  isPurple(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 260, 310);
  }

  isPink(c: Color) {
    return !this.isGrey(c) && this.isHueBetween(c, 310, 360);
  }
}
</script>

<style>
.swatch-group {
  @apply my-4 pl-12 rounded-l;
}
.swatch-group:first-child {
  @apply mt-0 rounded-bl rounded-tl-none;
}
</style>

