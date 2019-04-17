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
            @keydown="resetPreview()"
          >
        </div>
        <button
          @click="get()"
          class=" mx-2 cursor-pointer whitespace-no-wrap bg-blue-dark text-white rounded-full uppercase p-3 border-0"
        >Get colors</button>

      </form>

      <div class="my-12 flex-grow">
        <preview
          :url="url"
          :screenshot="screenshot"
          :is-loading="isLoading"
        ></preview>
      </div>

      <div>

      </div>
      <signature class="self-end"></signature>
    </div>
    <div class="w-3/5 max-h-full overflow-y-auto bg-white">
      <div class="w-full bg-grey-lightest flex flex-col">

        <swatch-results :colors="colors"></swatch-results>

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
import Signature from "../components/Signature.vue";
import Preview from "../components/Preview.vue";
import SwatchResults from "../components/SwatchResults.vue";

@Component({
  components: {
    navigation: Navigation,
    signature: Signature,
    preview: Preview,
    "swatch-results": SwatchResults
  }
})
export default class ResultsPage extends Vue {
  private url: string = "https://vuejs.org/";
  private isLoading: boolean = false;
  private screenshot: string = "";
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

  private resetPreview() {
    this.screenshot = "";
    this.colors = [];
  }

  private get() {
    this.error = "";
    this.isLoading = true;
    this.colors = [];
    this.screenshot = "";
    let start: number = Date.now();

    Promise.all([
      axios.get(`http://localhost:3000/parse/${encodeURIComponent(this.url)}`),
      axios.get(
        `http://localhost:3000/screenshot/${encodeURIComponent(this.url)}`
      )
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
        )
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
</style>
