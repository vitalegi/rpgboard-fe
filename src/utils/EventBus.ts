import Vue from "vue";

import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Utils.EventBus");

const eventBus = new Vue();
export default eventBus;
