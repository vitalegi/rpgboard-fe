<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>GraphQL - sample</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col> getLinks </v-col>
      <v-col>
        <ul>
          <li v-for="link in links" :key="link.url">
            {{ link.postedBy.name }} posted {{ link.url }}
          </li>
        </ul>
      </v-col>
    </v-row>
    <v-row>
      <v-col> subLinks </v-col>
      <v-col>
        <ul>
          <li v-for="link in subLinks" :key="link.url">
            {{ link.postedBy.name }} posted {{ link.url }}
          </li>
        </ul>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-text-field
          v-model="link"
          label="Link"
          outlined
          clearable
        ></v-text-field>
        <v-text-field
          v-model="postedBy"
          label="Posted By"
          outlined
          clearable
        ></v-text-field>
        <v-btn @click="submit(link, postedBy)">Insert</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import gql from "graphql-tag";
import { factory } from "@/utils/ConfigLog4j";
const logger = factory.getLogger("Game.Components.GraphQLSample");

export default Vue.extend({
  name: "GraphQLSample",

  data: () => ({
    name: "",
    link: "",
    postedBy: "",
  }),
  apollo: {
    links: {
      query: gql`
        query($secure: Boolean) {
          allLinks(secureOnly: $secure) {
            url
            postedBy {
              name
            }
          }
        }
      `,
      variables: { secure: true },
      update: (data) => data.allLinks,
    },
    subLinks: {
      query: gql`
        query($secure: Boolean) {
          allLinks(secureOnly: $secure) {
            url
            postedBy {
              name
            }
          }
        }
      `,
      variables: { secure: true },
      subscribeToMore: {
        document: gql`
          subscription links {
            links {
              url
              postedBy {
                name
              }
            }
          }
        `,
        // Variables passed to the subscription. Since we're using a function,
        // they are reactive
        variables() {
          return {};
        },
        // Mutate the previous result
        updateQuery: (previousResult, { subscriptionData }) => {
          // Here, return the new result from the previous with the new data
          console.log("updateQuery", previousResult, subscriptionData);
        },
      },
    },
  },
  computed: {},
  methods: {
    async submit(newLink: string, newName: string): Promise<void> {
      console.log("insert name, link");
      const result = await this.$apollo.mutate({
        mutation: gql`
          mutation($link: String!, $name: String!) {
            addLink(link: $link, name: $name) {
              url
              postedBy {
                name
              }
            }
          }
        `,
        variables: {
          link: newLink,
          name: newName,
        },
      });
      console.log("done, ", result);
    },
  },
});
</script>

<style scoped lang="scss"></style>
