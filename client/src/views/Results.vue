<template>
  <div class="w-full  h-screen flex justify-between">

    <div class="w-2/5 h-full ml-20 mr-12">
      <navigation></navigation>
      <form class="flex w-full mt-32">
        <div class="flex w-full ">
          <input
            class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-blue"
            id="inline-full-name"
            type="text"
            v-model="url"
          >
        </div>
        <button
          @click="get()"
          class=" mx-2 cursor-pointer whitespace-no-wrap bg-blue text-white rounded-full uppercase p-3 border-0"
        >Get colors</button>

      </form>

      <div class="my-12">
        <simple-svg :filepath="require('../assets/browser-header.svg')" />
        <div class="bg-white rounded-b h-48 relative">
          <span
            class="absolute mx-auto my-auto"
            v-show="isLoading"
          >Loading...</span>
        </div>
      </div>

      <div>

      </div>
    </div>
    <div class="w-3/5 max-h-full overflow-y-auto pl-12 bg-white">
      <div class="flex flex-wrap w-full">

        <swatch-group
          :label="'Greys'"
          :colors="filterGrey(colors)"
        ></swatch-group>
        <swatch-group
          :label="'Reds'"
          :colors="filterWithHue(colors, 0, 30)"
        ></swatch-group>
          <swatch-group
          :label="'Oranges'"
          :colors="filterWithHue(colors, 30, 60)"
        ></swatch-group>
              <swatch-group
          :label="'Yellows'"
          :colors="filterWithHue(colors, 60, 90)"
        ></swatch-group>
         <swatch-group
          :label="'Greens'"
          :colors="filterWithHue(colors,90, 180)"
        ></swatch-group>
           <swatch-group
          :label="'Blues'"
          :colors="filterWithHue(colors,180, 270)"
        ></swatch-group>
            <swatch-group
          :label="'Purples'"
          :colors="filterWithHue(colors,270, 330)"
        ></swatch-group>
           <swatch-group
          :label="'Pinks'"
          :colors="filterWithHue(colors,330, 360)"
        ></swatch-group>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import Color from "../models/color";
import axios from "axios";
import { colorConverter } from "../services/color-converter";
import Navigation from "../components/Navigation.vue";
import SwatchGroup from "../components/SwatchGroup.vue";

@Component({
  components: {
    navigation: Navigation,
    "swatch-group": SwatchGroup
  }
})
export default class ResultsPage extends Vue {
  private url: string = "https://www.facebook.com";
  private isLoading: boolean = false;
  private error: string = "";
  private colors: Color[] = [];

  private uniqBy = (arr: any[], predicate: any) => {
    const cb =
      typeof predicate === "function" ? predicate : (o: any) => o[predicate];

    return [
      ...arr
        .reduce((map: any, item: any) => {
          const key = cb(item);

          map.has(key) || map.set(key, item);

          return map;
        }, new Map())
        .values()
    ];
  };

  private filterGrey(colors: Color[]) {
    return colors.filter(c => c.hsl.values[1] < 20);
  }

  private filterWithHue(colors: Color[], min: number, max: number) {
    return colors.filter(c => c.hsl.values[1] >= 20  && c.hsl.values[0] > min && max >= c.hsl.values[0]);
  }

  private get() {
    this.error = "";
    this.isLoading = true;
    this.colors = [];
    axios
      .get(`http://localhost:3000/evaluate/${encodeURIComponent(this.url)}`)
      .then(res => {
        return res.data;
      })
      .then((data: any[]) => {
        return data.reduce(
          (prev, cur, i, a, k = cur.color) => (
            (prev[k] || (prev[k] = [])).push(cur), prev
          ),
          {}
        );
      })
      .then(result => {
        this.colors = this.uniqBy(
          [...new Set(Object.keys(result))].map(c => colorConverter.convert(c)),
          (c: Color) => c.hex.raw
        ).sort((a: Color, b: Color) => {
          return a.hsl.values[0] - b.hsl.values[0];
        });
      })
      .then(() => {
        this.isLoading = false;
      })
      .catch(err => {
        this.isLoading = false;
        this.error = err;
      });
  }
}
</script>


<style>
</style>
