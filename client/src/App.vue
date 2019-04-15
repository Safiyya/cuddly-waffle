<template>
  <div id="app">
    <span class="text-red">{{error}}</span>
    <input
      v-model="url"
      type="text"
      name=""
      id="input-url"
    >
    <button @click="get()">Get</button>

    <div class="flex flex-wrap">
      <div
        v-for="(color, cix) in colors"
        :key="cix"
      >
        <div
          class=" w-48 h-48"
          :style="{backgroundColor:color.rgb.raw}"
        >

        </div>
        <div>
          HSL {{color.hsl.raw}}
        </div>
        <div>
          RGB {{color.rgb.raw}}
        </div>
        <div>
          HEX {{color.hex.raw}}
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { colorConverter } from "./services/color-converter";
import axios from "axios";
import Color from "./models/color";

@Component({})
export default class AppVue extends Vue {
  private url: string = "https://www.fullstory.com/";
  private error: string = "";
  private colors: Color[] = [];

  private uniqBy = (arr, predicate) => {
    const cb = typeof predicate === "function" ? predicate : o => o[predicate];

    return [
      ...arr
        .reduce((map, item) => {
          const key = cb(item);

          map.has(key) || map.set(key, item);

          return map;
        }, new Map())
        .values()
    ];
  };

  private get() {
    this.error = "";
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
        this.colors = this.uniqBy([...new Set(Object.keys(result))]
          .map(c => colorConverter.convert(c)), (c:Color) => c.hex.raw)
          .sort((a: Color, b: Color) => {
            return a.hsl.values[0] - b.hsl.values[0];
          });
      })
      .catch(err => {
        this.error = err;
      });
  }
}
</script>


<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
