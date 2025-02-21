import "./assets/main.css";

import { createApp } from "vue";
import store from "./vuex/index.js";
import App from "./App.vue";
import router from "./router/index.js";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseTickbutton from "./components/ui/BaseTickbutton.vue";
import BaseBinbutton from "./components/ui/BaseBinbutton.vue";
import { Trash2, ChevronLeft } from "lucide-vue-next";

const app = createApp(App);

app.use(store);
app.use(router);

app.component("BaseButton", BaseButton);
app.component("BaseTickButton", BaseTickbutton);
app.component("BaseBinbutton", BaseBinbutton);
app.component("Trash2", Trash2);
app.component("ChevronLeft", ChevronLeft);

app.mount("#app");
