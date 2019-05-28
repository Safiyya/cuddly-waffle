
<template>
  <header>
    <nav class="my-3 flex flex-col items-start justify-center">
      <h1 class="text-grey-darker flex items-end">
        <img
          class="w-6 h-6"
          src="@/assets/logo.svg"
          alt="Logo"
          srcset=""
        >
        <span class="mx-1 font-bold uppercase text-xl">CuddlyWaffle</span>
      </h1>
      <h1 class="my-0">Stop wasting time with color pickers</h1>
      <h2 class="my-0">Download the colors from any website. No color picker, no palette generator.</h2>

    </nav>
  </header>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";

@Component({})
export default class Navigation extends Vue {}
</script>

<style>
</style>
