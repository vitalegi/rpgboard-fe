import { factory } from "@/utils/ConfigLog4j";

const logger = factory.getLogger("Utils.LocalStorage");

class LocalStorage {}

export const localStorage = new LocalStorage();
