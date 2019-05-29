
<template>
  <div
    class="swatch-group flex flex-col bg-white"
    v-if="colors.length>0"
    @mouseover="toggleDetails(true)"
    @mouseout="toggleDetails(false)"
  >
    <div class="flex items-baseline">
      <h2 class="">{{label}}</h2>
      <span
        :class="{'show':isShowDetails}"
        class="description mx-2 text-grey text-sm"
      >{{description}}</span>
    </div>
    <div class="flex flex-wrap">
      <swatch
        v-for="(color, cix) in colors"
        :key="cix"
        class="mr-4 mb-3"
        :color="color"
        :display-options="displayOptions"
      ></swatch>

    </div>

  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import Color from "../models/color";
import { ColorDisplayOption } from "../models/color-display-options";
import Swatch from "./Swatch.vue";

@Component({
  components: {
    swatch: Swatch
  }
})
export default class SwatchGroup extends Vue {
  @Prop() public colors!: Color[];
  @Prop() public description!: string;
  @Prop() public displayOptions!: ColorDisplayOption[];
  @Prop() public label!: string;

  private isShowDetails: boolean = false;

  private toggleDetails(show: boolean) {
    this.isShowDetails = show;
  }
}
</script>

<style>
.is-light-swatch {
  border-color: #e8ecef;
}

.description {
  opacity: 0;
  transition: all 400ms;
}

.description.show {
  opacity: 1;
  transition: all 400ms;
}
</style>
