<template>
  <v-card>
    <v-card-title>
      {{ game.name }}
      <v-spacer></v-spacer>

      <v-dialog v-model="dialog" width="500" v-if="canDelete">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-delete</v-icon></v-btn
          >
        </template>
        <v-card>
          <v-card-title> Danger zone </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  Deletion can't be undone. Proceed if and only if you are sure
                  what you are doing.
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  Please type the <code>{{ game.name }}</code> to confirm the
                  deletion.
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field v-model="confirmDeletion"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="deleteGame()"
              :disabled="confirmDeletion !== game.name"
            >
              I accept
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-card-text style="text-align: left">
      Game: {{ game.type }}<br />
      Status: {{ game.status }}
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="select()">Join</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import Game from "@/models/Game";
import { factory } from "@/utils/ConfigLog4j";
import AuthService from "@/login/services/AuthService";
import Container from "typedi";
const logger = factory.getLogger("Game.Components.SelectableGamePreview");

export default Vue.extend({
  name: "SelectableGamePreview",
  props: { game: { type: Game } },

  data: () => ({
    dialog: false,
    confirmDeletion: "",
    authService: Container.get<AuthService>(AuthService),
  }),
  computed: {
    canDelete(): boolean {
      return this.$store.getters["auth/localUser"].userId === this.game.ownerId;
    },
  },
  methods: {
    select(): void {
      this.$emit("select", this.game.gameId);
    },
    deleteGame() {
      this.dialog = false;
      this.$emit("delete", this.game.gameId);
    },
  },
});
</script>

<style scoped lang="scss"></style>
