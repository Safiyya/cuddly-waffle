
<template>
  <div
    class="swatch-group flex flex-col bg-white"
    v-if="colors.length>0"
  >
    <span class="text-lg font-thin my-4">{{label}}</span>
    <div class="flex flex-wrap">
      <swatch
        v-for="(color, cix) in colors"
        :key="cix"
        class="mr-3 mb-3"
        :color="color"
        :display-options="displayOptions"
      ></swatch>

    </div>

  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import {Color, ColorDisplayOption} from "../models/color";
import Swatch from "./Swatch.vue";

@Component({
  components: {
    swatch: Swatch
  }
})
export default class SwatchGroup extends Vue {
  @Prop() colors: Color[];
  @Prop() displayOptions:ColorDisplayOption[];
  @Prop() label: string;
}
</script>

<style>
.is-light-swatch {
  border-color: #e8ecef;
}
</style>
