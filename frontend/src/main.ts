import {IO, App} from "./multiplayer";

import "./assets/main.css";

import {createApp} from "vue";
import VueApp from "./App.vue";
import router from "./router";

const app = createApp(VueApp);

app.use(router);
app.mount("body");
