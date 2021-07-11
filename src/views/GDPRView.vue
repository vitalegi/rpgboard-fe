<template>
  <v-card id="gdpr">
    <v-card-text> <GDPRPolicy /> </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import GDPRPolicy from "@/login/components/GDPRPolicy.vue";
export default Vue.extend({
  name: "GDPR",
  components: { GDPRPolicy },
});
</script>

<style scoped lang="scss"></style>
