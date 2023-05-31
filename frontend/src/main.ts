//Multiplayer
import {IO, App} from "./multiplayer";

//Style sheet
import "./assets/main.css";

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

//Font awesome icons
import {library} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {faStopwatch, faMap, faLocationPin, faClock, faRuler, faStar, faHashtag, faArrowDown19, faHourglass} from "@fortawesome/free-solid-svg-icons";
import {faTwitter, faFacebook, faDiscord, faInstagram} from "@fortawesome/free-brands-svg-icons";
library.add(faTwitter, faFacebook, faDiscord, faInstagram, faStopwatch, faMap, faLocationPin, faClock, faRuler, faStar, faHashtag, faArrowDown19, faHourglass);
app.component("font-awesome-icon", FontAwesomeIcon);

//Mount
app.mount("body");
