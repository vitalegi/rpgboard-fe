<template>
  <v-app>
    <v-container id="nav">
      <v-row>
        <v-col style="text-align: left">
          <router-link to="/" class="bolder">Home</router-link> |
          <router-link to="/about" class="bolder">About</router-link>
        </v-col>
        <v-spacer></v-spacer>
        <v-col style="text-align: right">
          <router-link to="/login" v-if="!isAuthenticated()">Login</router-link>
          <span v-else>
            Benvenuto, {{ username }}!
            <router-link to="/logout">Non sei tu?</router-link>
          </span>
        </v-col>
      </v-row>
    </v-container>
    <router-view />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  components: {},

  data: () => ({
    //
  }),
  computed: {
    username(): string {
      const user = this.$store.getters["auth/localUser"];
      if (user == null) {
        return "";
      }
      return user.name;
    },
  },
  methods: {
    isAuthenticated(): boolean {
      return this.$store.getters["auth/authenticated"];
    },
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    //font-weight: bold;

    &.router-link-exact-active {
      color: white;
      text-decoration-line: none;
    }
  }
}

.bolder {
  font-weight: bolder;
}
</style>
