<template>
  <div
    id="app"
    v-html="innerHTML"
  >
    {{innerHTML}}
    {{color}}

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
        console.log(res.data)
      })
      // .then((response: AxiosResponse) => {
      //   this.innerHTML = response.data;
      //   dom.innerHTML = response.data;
      //   let oDocument = dom.ownerDocument;
      //   let el = dom.querySelector("#announcement-banner");

      //   console.log("style", window.getComputedStyle(dom.querySelector("#announcement-banner")).getPropertyValue("background-color"))
        
      //   // this.color = (this.dom.querySelector("#annoucement-banner") as HTMLElement).style.backgroundColor;
      // })
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
