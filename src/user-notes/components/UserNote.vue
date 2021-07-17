<template>
  <v-container v-if="editMode">
    <v-row>
      <v-col cols="4">
        <v-text-field label="Title" v-model="note.title"></v-text-field>
        <v-textarea
          outlined
          label="Notes"
          v-model="note.text"
          rows="10"
        ></v-textarea>
      </v-col>
      <v-col cols="8">
        <v-card :max-height="350">
          <v-card-text>
            <div
              class="processed-text"
              v-html="processMarkdown(note.text)"
            ></div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-card v-else>
    <v-card-title> {{ note.title }}</v-card-title>
    <v-card-text>
      <div class="processed-text" v-html="processMarkdown(note.text)"></div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import MarkDownService from "@/services/MarkDownService";
import NoteService from "@/user-notes/services/NoteService";
import { Container } from "typedi";
import { factory } from "@/utils/ConfigLog4j";
import Note from "../models/Note";
const logger = factory.getLogger("UserNotes.Components.UserNote");

export default Vue.extend({
  name: "UserNote",
  components: {},
  props: {
    noteId: { type: String },
  },
  data: () => ({
    note: new Note(),
    editMode: false,
    markDownService: Container.get<MarkDownService>(MarkDownService),
    noteService: Container.get<NoteService>(NoteService),
  }),
  computed: {},
  methods: {
    processMarkdown(text: string): string {
      return this.markDownService.parse(text);
    },
  },
  async mounted(): Promise<void> {
    this.note = await this.noteService.getNote(this.noteId);
  },
});
</script>

<style scoped lang="scss">
.processed-text {
  text-align: justify;
}
.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
