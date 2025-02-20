import "./assets/main.css";

import { createApp } from "vue";
import store from "./vuex/index.js";
import App from "./App.vue";
import router from "./router/index.js";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseTickbutton from "./components/ui/BaseTickbutton.vue";
import BaseBinbutton from "./components/ui/BaseBinbutton.vue";

const app = createApp(App);

app.use(store);
app.use(router);

app.mount("#app");
app.component("BaseButton", BaseButton);
app.component("BaseTickButton", BaseTickbutton);
app.component("BaseBinbutton", BaseBinbutton);
