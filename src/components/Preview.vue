
<template>
  <div class="flex flex-col shadow">
    <div class="relative">
      <simple-svg
        class="h-12 grayscale"
        :filepath="require('../assets/browser-header.svg')"
      />
      <span class="text-sm absolute  ml-24 pin-t mt-4 opacity-25">{{url}}</span>
    </div>

    <div class="bg-white rounded-b h-64 relative overflow-auto">
      <span
        class="centered"
        v-show="isLoading"
      >Loading...</span>
      <img
        class="w-full"
        :src="screenshot"
      />
    </div>
  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";

@Component({})
export default class Preview extends Vue {
  @Prop(String) public url: string;
  @Prop(String) public screenshot: string;
  @Prop(Boolean) public isLoading: boolean;
}
</script>

<style>
</style>
