<template>
  <div
    id="app"
    class=""
  >
    <!-- <navigation></navigation> -->
    <router-view></router-view>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { colorConverter } from "./services/color-converter";
import axios from "axios";
import Color from "./models/color";
import Navigation from "@/components/Navigation.vue";

@Component({
  components: {
    "navigation": Navigation
  }
})
export default class AppVue extends Vue {}
</script>


<style lang="scss">
</style>
