<template>
  <div class="w-full  h-screen flex justify-between">

    <div class="w-2/5 h-full ml-20 mr-12 flex flex-col">
      <navigation></navigation>
      <form class="flex w-full mt-32">
        <div class="flex w-full ">
          <input
            class="bg-grey-lighter appearance-none border-2 border-grey-lighter rounded w-full py-2 px-4 text-grey-darker leading-tight focus:outline-none focus:bg-white focus:border-blue-dark"
            id="inline-full-name"
            type="text"
            v-model="url"
          >
        </div>
        <button
          @click="get()"
          class=" mx-2 cursor-pointer whitespace-no-wrap bg-blue-dark text-white rounded-full uppercase p-3 border-0"
        >Get colors</button>

      </form>

      <div class="my-12 flex-grow">
        <div class="relative">
          <simple-svg :filepath="require('../assets/browser-header.svg')" />
          <span v-if="colors.length>0" class="text-sm absolute  ml-24 pin-t mt-4 opacity-25">{{url}}</span>
        </div>

        <div class="bg-white rounded-b h-64 relative overflow-auto">
          <span
            class="centered"
            v-show="isLoading"
          >Loading...</span>
         <img class="w-full" :src="screenshot" />
        </div>
      </div>

      <div>

      </div>
      <signature class="self-end"></signature>
    </div>
    <div class="w-3/5 max-h-full overflow-y-auto bg-white">
      <div class="w-full bg-grey-lightest flex flex-col">

        <swatch-group
          class="swatch-group"
          :label="'Greys'"
          :colors="filterGrey(colors)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Reds'"
          :colors="filterWithHue(colors, 0, 20)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Oranges'"
          :colors="filterWithHue(colors, 20, 50)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Yellows'"
          :colors="filterWithHue(colors, 50, 70)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Greens'"
          :colors="filterWithHue(colors,70, 170)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Blues'"
          :colors="filterWithHue(colors,170, 260)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Purples'"
          :colors="filterWithHue(colors,260, 310)"
        ></swatch-group>
        <swatch-group
          class="swatch-group"
          :label="'Pinks'"
          :colors="filterWithHue(colors,310, 360)"
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
import Signature from "../components/Signature.vue";

@Component({
  components: {
    navigation: Navigation,
    signature: Signature,
    "swatch-group": SwatchGroup
  }
})
export default class ResultsPage extends Vue {
  private url: string = "https://vuejs.org/";
  private isLoading: boolean = false;
  private screenshot:string="";
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
    return colors.filter(
      c =>
        c.hsl.values[1] >= 20 && c.hsl.values[0] > min && max >= c.hsl.values[0]
    );
  }

  private get() {
    this.error = "";
    this.isLoading = true;
    this.colors = [];
    this.screenshot = "";
    let start: number = Date.now();

    Promise.all([
       axios
      .get(`http://localhost:3000/parse/${encodeURIComponent(this.url)}`),
       axios
      .get(`http://localhost:3000/screenshot/${encodeURIComponent(this.url)}`)
    ])
      .then(([colorsResponse, screenshotResponse]) => {
        console.log("query", Date.now() - start);
        this.screenshot = `data:image/png;base64, ${screenshotResponse.data}`;
        return colorsResponse.data;
      })
      .then((data: any[]) => {
        console.log("reduce", Date.now() - start);
        return data.reduce(
          (prev, cur, i, a, k = cur.color) => (
            (prev[k] || (prev[k] = [])).push(cur), prev
          ),
          {}
        );
      })
      .then(result => {
        console.log("sort", Date.now() - start);
        this.colors = this.uniqBy(
          [...new Set(Object.keys(result))].map(c => colorConverter.convert(c)),
          (c: Color) => c.hex.raw
        ).sort((a: Color, b: Color) => {
          return a.hsl.values[0] - b.hsl.values[0];
        });
      })
      .then(() => {
        console.log("end", Date.now() - start);
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
.swatch-group {
  @apply my-4 pl-12 rounded-l;
}
.swatch-group:first-child {
  @apply mt-0 rounded-bl rounded-tl-none;
}
</style>
