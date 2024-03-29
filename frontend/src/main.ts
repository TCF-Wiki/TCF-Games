// @ts-ignore
import mitt, {Emitter} from "mitt";
export const emitter: Emitter = mitt();

//Multiplayer
import {IO, App} from "./multiplayer";
IO.init();
IO.socket.connect();

//Style sheet
import "./assets/main.css";
import "leaflet/dist/leaflet.css";
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
	duration: 5000,
	dismissible: true
}).use(FloatingVue);

export const toast = app.config.globalProperties.$toast;

//Mount
app.mount("body");
