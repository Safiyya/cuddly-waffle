<template>
  <div
    id="app"
  >
  <div v-for="(color, cix) in colors" :key="cix" class="w-48 h-48" :style="{backgroundColor:color}" >
{{color}}
  </div>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Provide, Watch } from "vue-property-decorator";
import { htmlParser } from "./services/parse";
import axios, { AxiosResponse } from "axios";

@Component({})
export default class AppVue extends Vue {
  private htmlString: string = "";
  private innerHTML: string = "";
  private colors: string[] = [];
  private color: string = "";

  mounted() {
    let url =
      "https%3A%2F%2Fstackoverflow.com%2Fquestions%2F10585029%2Fparse-an-html-string-with-js";
    let dom = document.createElement("html");

    axios
      .get(`http://localhost:3000/get/${url}`)
      .then(res => res.data)
      .then(html=>{
        return axios.post("http://localhost:3000/parse",html,{
          headers : {
            "Content-Type":"text/html"
          }
        
        } )
      })
      .then(res=>{
        return res.data
      })
      .then((data:any[]) =>{
        return data.reduce((prev, cur, i, a, k = cur.color) => ((prev[k] || (prev[k] = [])).push(cur), prev), {});
      })
      .then((result)=>{
        this.colors = Object.keys(result);
        console.log(this.colors)
      })
      .catch(err => {
        this.innerHTML = err;
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
