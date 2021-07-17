<template>
  <div>
    <v-list-group no-action v-for="group in groups" :key="group.id">
      <template v-slot:activator>
        <v-list-item-content>
          <v-list-item-title v-text="group.label"></v-list-item-title>
        </v-list-item-content>
      </template>
      <base-stats-overview
        v-if="group.id === 'BASE'"
        :baseStats="player.baseStats"
      />
      <saving-throws-overview
        v-if="group.id === 'SAVE'"
        :player="player"
        @update="updateSavingThrow"
      />
      <skills-overview
        v-if="group.id === 'SKILLS'"
        :player="player"
        @updateSkill="updateSkill"
      />
      <abilities-overview
        v-if="group.id === 'ABILITIES'"
        :player="player"
        @moveAbility="moveAbility"
      />
    </v-list-group>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { factory } from "@/utils/ConfigLog4j";
import { Container } from "typedi";
import StatsRetrieverService from "@/dd5e/services/StatsRetrieverService";
import { Stat } from "@/dd5e/models/Stats";
import SkillService from "@/dd5e/services/SkillService";
import Player from "@/dd5e/models/Player";
import BaseStatsOverview from "@/dd5e/character-sheet/components/BaseStatsOverview.vue";
import SavingThrowsOverview from "@/dd5e/character-sheet/components/SavingThrowsOverview.vue";
import SkillsOverview from "@/dd5e/character-sheet/components/SkillsOverview.vue";
import AbilitiesOverview from "@/dd5e/character-sheet/components/AbilitiesOverview.vue";
import SkillKeys from "@/dd5e/constants/SkillKeys";
import Ability, { Damage, Spell } from "@/dd5e/models/Ability";
import store from "@/store";
import dd5characterSheet from "../store/DD5eCharacterSheetStore";
const logger = factory.getLogger("Components.DD5eCharacterSheet");

export default Vue.extend({
  name: "DD5eCharacterSheet",
  components: {
    BaseStatsOverview,
    SavingThrowsOverview,
    SkillsOverview,
    AbilitiesOverview,
  },
  props: {
    characterId: { type: String, required: true },
  },
  data: () => ({
    player: new Player(),
    statsRetrieverService: Container.get<StatsRetrieverService>(
      StatsRetrieverService
    ),
    skillService: Container.get<SkillService>(SkillService),
  }),
  computed: {
    module(): string {
      return `dd5characterSheet${this.characterId}`;
    },
    count(): number {
      return this.$store.getters[`${this.module}/count`];
    },
    groups() {
      return [
        { id: "BASE", label: "Base Stats" },
        { id: "SAVE", label: "Saving Throws" },
        { id: "SKILLS", label: "Skills" },
        { id: "ABILITIES", label: "Abilities" },
      ];
    },
  },
  methods: {
    increment(): void {
      logger.info(`Increment for ${this.characterId} on ${this.module}`);
      this.$store.commit(`${this.module}/increment`);
    },
    moveAbility(dragAbility: string, dropAbility: string): void {
      logger.info(`Move ${dragAbility} before ${dropAbility}`);
      console.log(this.player.abilities.map((a) => a.name).join(", "));
      const fromIndex = this.player.abilities.findIndex(
        (a) => a.name === dragAbility
      );
      let toIndex = this.player.abilities.findIndex(
        (a) => a.name === dropAbility
      );
      logger.info(`Move ${fromIndex} to ${toIndex}`);
      const ability = this.player.abilities.splice(fromIndex, 1)[0];
      this.player.abilities.splice(toIndex, 0, ability);
      console.log(this.player.abilities.map((a) => a.name).join(", "));
    },
    updateSkill(id: string, proficiency: boolean): void {
      logger.info(`Update skill ${id} proficiency to ${proficiency}`);
      this.player.skills
        .filter((skill) => skill.id === id)
        .forEach((skill) => (skill.proficiency = proficiency));
    },
    updateSavingThrow(stat: string, proficiency: boolean): void {
      logger.info(`Update saving throw ${stat} proficiency to ${proficiency}`);
      this.statsRetrieverService.getStat(
        this.player.savingThrows,
        stat
      ).proficiency = proficiency;
    },
    abilityBastoneFerrato(): Ability {
      const ability = new Ability();
      ability.name = "Bastone Ferrato";
      ability.range = "melee";
      ability.attackFormula = "DEX + DEX* + 1d20";
      ability.damages.push(new Damage("DEX + 1d6"));
      ability.damages.push(new Damage("DEX"));
      ability.damages.push(new Damage("1d6", "poison"));
      return ability;
    },
    abilityBastoneFerratoVersatile(): Ability {
      const ability = new Ability();
      ability.name = "Bastone Ferrato Versatile";
      ability.range = "melee";
      ability.attackFormula = "STR + STR* + 1d20";
      ability.damages.push(new Damage("STR + 1d8"));
      return ability;
    },
    abilityPoisonSpray(): Spell {
      const ability = new Spell();
      ability.name = "Poison Spray";
      ability.description = `You extend your hand toward a creature you can see within range and project a puff of noxious gas from your palm. The creature must succeed on a __Constitution saving throw__ or take __1d12 poison damage__.

This spell's damage increases by 1d12 when you reach __5th__ Level (__2d12__), __11th__ level (__3d12__), and __17th__ level (__4d12__).`;
      ability.range = "10 feet";
      const damage = new Damage();
      damage.formula = "1d12";
      damage.type = "poison";
      ability.damages.push(damage);

      ability.components = "V S";
      ability.castingTime = "1 action";
      ability.duration = "Instantaneous";
      ability.spellSlot = 0;

      return ability;
    },
    abilityEldrichBlast(): Spell {
      const ability = new Spell();
      ability.name = "Eldrich Blast";
      ability.description = `A beam of crackling energy streaks toward a creature within range. Make a ranged spell attack against the target. On a hit, the target takes __1d10 force damage__.

The spell creates more than one beam when you reach higher levels: __two beams__ at __5th__ level, __three beams__ at __11th__ level, and __four beams__ at __17th__ level. You can direct the beams at the same target or at different ones. Make a separate attack roll for each beam.`;

      ability.attackFormula = "1d20 + PROFICIENCY + CHA";
      ability.range = "120 feet";
      const damage = new Damage();
      damage.formula = "1d10";
      damage.type = "force";
      ability.damages.push(damage);

      ability.components = "V S";
      ability.castingTime = "1 action";
      ability.duration = "Instantaneous";
      ability.spellSlot = 0;

      return ability;
    },
  },
  mounted(): void {
    this.player.name = "Sample";
    this.player.alignment = "BB";
    this.player.playerName = "Sample123";
    this.player.proficiencyBonus = 2;
    this.player.baseStats.strength = Stat.createBaseStat(2);
    this.player.baseStats.dexterity = Stat.createBaseStat(5);
    this.player.baseStats.constitution = Stat.createBaseStat(10);
    this.player.baseStats.intelligence = Stat.createBaseStat(13);
    this.player.baseStats.wisdom = Stat.createBaseStat(22);
    this.player.baseStats.charisma = Stat.createBaseStat(17);

    this.player.savingThrows.strength.proficiency = true;
    this.player.savingThrows.charisma.proficiency = true;

    this.player.skills.push(...this.skillService.createSkills());
    this.skillService.getSkill(
      SkillKeys.ACROBATICS,
      this.player
    ).proficiency = true;
    this.skillService.getSkill(
      SkillKeys.HISTORY,
      this.player
    ).proficiency = true;

    this.player.abilities.push(this.abilityBastoneFerrato());
    this.player.abilities.push(this.abilityPoisonSpray());
    this.player.abilities.push(this.abilityBastoneFerratoVersatile());
    this.player.abilities.push(this.abilityEldrichBlast());
  },
  created() {
    logger.info(`Register module ${this.module}`);
    store.registerModule(`${this.module}`, dd5characterSheet);
  },
  beforeDestroy() {
    store.unregisterModule(`${this.module}`);
  },
});
</script>

<style scoped lang="scss"></style>
