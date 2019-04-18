
<template>
  <div>
    
    <swatch-group
      v-for="(value, key) in colorGroups"
      :key="key"
      class="swatch-group"
      :label="key"
      :colors="getGroup(key)"
      :display-options="displayOptions"
    ></swatch-group>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import {Color, ColorDisplayOption} from "../models/color";
import SwatchGroup from "./SwatchGroup.vue";

@Component({
  components: {
    "swatch-group": SwatchGroup
  }
})
export default class SwatchResults extends Vue {
  @Prop() colors: Color[];
  @Prop() displayOptions:ColorDisplayOption[];

  public get colorGroups() {
    return this.colors
      .map(c => {
       return this.matchColor(c);
      })
      .sort((a, b)=> a.order-b.order)
      .reduce(
        (r, v, i, a, k = v.label) => ((r[k] || (r[k] = [])).push(v), r),
        {}
      )
      
  }

  getGroup(key: string): Color[] {
    return this.colorGroups[key].map(i => i.color);
  }

  matchColor(c: Color) {
    if (this.isGrey(c)) {
      return { label: "Grey", color: c, order:1 };
    } else if (this.isRed(c)) {
      return { label: "Red", color: c , order:2};
    }else if (this.isOrange(c)) {
      return { label: "Orange", color: c , order:3};
    }else if (this.isYellow(c)) {
      return { label: "Yellow", color: c , order:4};
    }else if (this.isGreen(c)) {
      return { label: "Green", color: c, order:5 };
    }else if (this.isBlue(c)) {
      return { label: "Blue", color: c, order:6 };
    }else if (this.isPurple(c)) {
      return { label: "Purple", color: c, order:7 };
    }else if (this.isPink(c)) {
      return { label: "Pink", color: c, order:8 };
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

