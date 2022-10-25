<script lang="ts">
// import TheWelcome from "../components/TheWelcome.vue";
import PokemonBox from "../components/PokemonBox.vue";
import { usePokemonStore } from "@/stores/pokemon";

export interface ResultsViewProps {
  storePokemon: any;
}

export default {
  components: {
    PokemonBox,
  },

  data() {
    return {
      storePokemon: usePokemonStore(),
    } as ResultsViewProps;
  },

  methods: {
    handlePokemonCLick(e: Event, pokemon: any) {
      this.storePokemon.clickedPokemon = pokemon;
      this.$router.push({
        name: "details",
      });
    },
  },
};
</script>

<template>
  <div class="pokemon-results">
    <div
      class="pokemon-level"
      v-for="evolutionLevel in storePokemon.completeEvolutionChain?.length"
      :key="evolutionLevel"
    >
      <span>Level: {{ evolutionLevel }}</span>
      <PokemonBox
        v-for="pokemon in storePokemon.completeEvolutionChain[
          evolutionLevel - 1
        ]"
        :key="pokemon.name"
        :pokemon="pokemon"
        :isSearched="pokemon.name === storePokemon.searchedPokemonName"
        @click="(e) => handlePokemonCLick(e, pokemon)"
      />
    </div>
  </div>
</template>
