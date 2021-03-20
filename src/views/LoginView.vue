<template>
  <div class="login">
    <guest-login />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GuestLogin from "@/components/GuestLogin.vue";

export default Vue.extend({
  name: "LoginView",
  components: {
    GuestLogin,
  },
});
</script>
