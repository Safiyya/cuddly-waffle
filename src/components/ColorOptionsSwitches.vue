
<template>
  <div class="flex justify-between">
    <div class="switch_container">
      <label class="switch">

        <input
          type="checkbox"
          id="hex_option"
          :value="'HEX'"
          v-model="localOptions"
          @change="onClick()"
        >
        <span class="slider round"></span>
      </label>
      <span>HEX</span>
    </div>

    <div class="switch_container">

      <label class="switch">

        <input
          type="checkbox"
          id="hsl_option"
          :value="'HSL'"
          v-model="localOptions"
          @change="onClick()"
        >
        <span class="slider round"></span>
      </label>
      <span>HSL</span>
    </div>

    <div class="switch_container">
      <label class="switch">

        <input
          type="checkbox"
          id="rgb_option"
          :value="'RGB'"
          v-model="localOptions"
          @change="onClick()"
        >
        <span class="slider round"></span>
      </label>
      <span>RGB</span>
    </div>

  </div>

</template>
<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { ColorDisplayOption } from "../models/color-display-options";

@Component({})
export default class ColorOptionsSwitches extends Vue {
  @Prop() public value!: ColorDisplayOption[];

  private localOptions: ColorDisplayOption[] = [];

  public mounted() {
    this.localOptions = this.value.slice(0);
  }

  private onClick() {
    this.$emit("selectColorOptions", this.localOptions);
  }
}
</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
  /* width: 60px;
  height: 34px; */
  @apply relative inline-block w-12 h-6;
}

.switch_container {
  @apply flex items-center mx-3;
}

.switch_container > span {
  @apply ml-1;
}

/* Hide default HTML checkbox */
.switch input {
  /* opacity: 0;
  width: 0;
  height: 0; */
  @apply opacity-0;
}

/* The slider */
.slider {
  /* position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc; */
  -webkit-transition: 0.4s;
  transition: 0.4s;
  @apply absolute cursor-pointer pin bg-grey-lighter;
}

.slider:before {
  content: "";
  left: 6px;
  bottom: 4px;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  @apply absolute h-4 w-4  bg-white;
}

input:checked + .slider {
  /* background-color: #2196f3; */
  @apply bg-blue-dark;
}

input:focus + .slider {
  /* box-shadow: 0 0 1px #2196f3; */
  /* @apply shadow; */
}

input:checked + .slider:before {
  -webkit-transform: translateX(22px);
  -ms-transform: translateX(22px);
  transform: translateX(22px);
}

/* Rounded sliders */
.slider.round {
  /* border-radius: 34px; */
  @apply rounded-full;
}

.slider.round:before {
  /* border-radius: 50%; */
  @apply rounded-full;
}
</style>
