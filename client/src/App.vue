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
        <div  class=" w-48 h-48"
        :style="{backgroundColor:color}">

        </div>
        <div>
          {{color}}
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { htmlParser } from "./services/parse";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class AppVue extends Vue {
  private url: string = "";
  private error: string = "";
  private colors: string[] = [];

  private get() {
    this.error = "";
    this.colors = [];
    axios
      .get(`http://localhost:3000/get/${encodeURIComponent(this.url)}`)
      .then(res => res.data)
      .then(html => {
        return axios.post("http://localhost:3000/parse", html, {
          headers: {
            "Content-Type": "text/html"
          }
        });
      })
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
        this.colors = [...new Set(Object.keys(result))]; ;
        console.log(result, this.colors);
      })
      .catch(err => {
        this.error = err;
      });

    // let html: HTMLElement = document.createElement("html");

    // this.htmlString = html.outerHTML;
    // this.colors = htmlParser.parse(html);
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
