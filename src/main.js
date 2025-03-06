import "./assets/main.css";

import { createApp } from "vue";
import store from "./vuex/index.js";
import App from "./App.vue";
import router from "./router/index.js";
import BaseButton from "./components/ui/BaseButton.vue";
import BaseTickbutton from "./components/ui/BaseTickbutton.vue";
import BaseBinbutton from "./components/ui/BaseBinbutton.vue";
import {
  Trash2,
  ChevronLeft,
  ArrowLeftFromLine,
  CircleCheckBig,
} from "lucide-vue-next";
import Tasks from "./components/Tasks.vue";
import TasksSections from "./components/TasksSections.vue";
import BaseSpinner from "./components/ui/BaseSpinner.vue";
import AlertModule from "./components/AlertModule.vue";

const app = createApp(App);

app.use(store);
app.use(router);

app.component("BaseButton", BaseButton);
app.component("BaseTickButton", BaseTickbutton);
app.component("BaseBinbutton", BaseBinbutton);
app.component("Trash2", Trash2);
app.component("ChevronLeft", ChevronLeft);
app.component("ArrowLeftFromLine", ArrowLeftFromLine);
app.component("CircleCheckBig", CircleCheckBig);
app.component("Tasks", Tasks);
app.component("TasksSections", TasksSections);
app.component("BaseSpinner", BaseSpinner);
app.component("AlertModule", AlertModule);

app.mount("#app");
