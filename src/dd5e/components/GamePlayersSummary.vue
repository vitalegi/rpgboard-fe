<template>
  <v-card>
    <v-list-group
      v-for="player in players"
      :key="player.playerId"
      :prepend-icon="
        ['0', '1', '2', '3'].findIndex((i) => player.playerId === i) != -1
          ? 'mdi-account-circle'
          : 'mdi-robot-excited-outline'
      "
      no-action
    >
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="player.name"></v-list-item-title>
          <v-list-item-subtitle
            v-text="playerRoles(player)"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </template>
      <DD5eCharacterSheet :characterId="player.playerId" />
    </v-list-group>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import DD5eCharacterSheet from "@/dd5e/character-sheet/components/DD5eCharacterSheet.vue";
import GamePlayer from "@/models/GamePlayer";
import { DD5eStoreService } from "../store/DD5eStore";
import Container from "typedi";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("DD5e.Components.GamePlayerSummary");

export default Vue.extend({
  name: "GamePlayersSummary",
  components: {
    DD5eCharacterSheet,
  },
  props: {},
  data: () => ({
    dd5eService: Container.get<DD5eStoreService>(DD5eStoreService),
    playersCallback: {},
  }),
  computed: {
    players(): Array<GamePlayer> {
      return this.$store.getters[`${this.moduleName()}/players`];
    },
  },
  methods: {
    playerRoles(player: GamePlayer): string {
      return player.roles.join(", ");
    },
    moduleName(): string {
      const gameId = this.$store.getters["game/getGameId"];
      return this.dd5eService.moduleName(gameId);
    },
    listener(): string {
      const gameId = this.$store.getters["game/getGameId"];
      return `${gameId}.players`;
    },
    handlePlayers(body: any): void {
      console.log("handle", body);
    },
  },
});
</script>

<style scoped lang="scss"></style>
