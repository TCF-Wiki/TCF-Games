//Multiplayer
import {IO, App} from "./multiplayer";

//Style sheet
import "./assets/main.css";
// floating vue
import FloatingVue from "floating-vue";
import "floating-vue/dist/style.css";
//Vue
import {createApp} from "vue";
import VueApp from "./App.vue";
export const app = createApp(VueApp);
//Router
import router from "./router";
app.use(router);
//Toast notifications
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-default.css";

app.use(ToastPlugin, {
	position: "top-right",
	duration: 8000,
	dismissible: true
});

//Mount
app.mount("main");

import NavBar from "./constantComponents/NavBar.vue";
const NavbarApp = createApp(NavBar).use(FloatingVue).use(router);
NavbarApp.mount("#header");

import Footer from "./constantComponents/Footer.vue";
const FooterApp = createApp(Footer);
FooterApp.mount("#footer");