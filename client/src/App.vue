<template>
  <div id="app">

    {{htmlString}}

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { htmlParser } from "./services/parse";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class AppVue extends Vue {
  private htmlString: string = "";
  private colors: string[] = [];

  mounted() {
    let url =
      "https%3A%2F%2Fstackoverflow.com%2Fquestions%2F10585029%2Fparse-an-html-string-with-js";
    axios.get(`http://localhost:3000/${url}`)
    .then((response: AxiosResponse) => {
      this.htmlString = response.data;
    })
    .catch(err =>{
      this.htmlString = err;
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
