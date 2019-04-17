
<template>
  <div>
    <div class="relative">
      <simple-svg :filepath="require('../assets/browser-header.svg')" />
      <span
        class="text-sm absolute  ml-24 pin-t mt-4 opacity-25"
      >{{url}}</span>
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
    @Prop(String) url:string;
    @Prop(String) screenshot:string;
    @Prop(Boolean) isLoading:boolean;

}
</script>

<style>
</style>
