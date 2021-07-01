<template>
  <v-card id="create" height="90%">
    <v-container fluid>
      <v-row class="child-flex">
        <v-col cols="10">
          <v-card>
            <v-responsive :aspect-ratio="16 / 4">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="4" v-for="(el, id) in dummy(10)" :key="id">
                      Block {{ id }} - {{ el }}
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-responsive>
          </v-card>
        </v-col>
        <v-col cols="2">
          <v-container>
            <v-row>
              <v-col cols="12" v-for="(el, id) in dummy(10)" :key="id">
                <v-btn elevation="2" fab outlined> {{ id }} </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
      </v-row>
      <v-speed-dial
        v-model="fab"
        :bottom="true"
        :right="true"
        direction="left"
        :open-on-hover="true"
        transition="transition"
      >
        <template v-slot:activator>
          <v-btn v-model="fab" color="blue darken-2" dark fab>
            <v-icon v-if="fab"> mdi-close </v-icon>
            <v-icon v-else> mdi-account-circle </v-icon>
          </v-btn>
        </template>
        <v-btn fab dark small color="green">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn fab dark small color="indigo">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
        <v-btn fab dark small color="red">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </v-speed-dial>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "About",
  components: {},
  data: () => ({
    fab: false,
  }),
  methods: {
    dummy: (n: number) => {
      const arr = new Array<string>();
      for (let i = 0; i < n; i++) {
        arr.push("Sample data " + i);
      }
      return arr;
    },
  },
});
</script>

<style scoped lang="scss">
#create .v-speed-dial {
  position: absolute;
}

#create .v-btn--floating {
  position: relative;
}
</style>
