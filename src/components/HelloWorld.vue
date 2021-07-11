<template>
  <v-container>
    <v-row>
      <v-col>
        <DD5eCharacterSheet />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import DD5eCharacterSheet from "@/dd5e/components/DD5eCharacterSheet.vue";

export default Vue.extend({
  name: "HelloWorld",
  components: { DD5eCharacterSheet },
  data: () => ({}),
});
</script>

<style scoped lang="scss"></style>
