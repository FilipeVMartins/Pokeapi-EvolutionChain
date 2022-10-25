<script lang="ts">
import { usePokemonStore } from "@/stores/pokemon";
import PokemonBox from "../components/PokemonBox.vue";

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
};
</script>

<template>
  <div class="details">
    <div>
      <h1>Pokemon Details</h1>
    </div>
    <div>
      <PokemonBox
        :key="storePokemon.clickedPokemon?.name"
        :pokemon="storePokemon.clickedPokemon"
        :isSearched="
          storePokemon.clickedPokemon?.name === storePokemon.searchedPokemonName
        "
      />
    </div>
    <div class="details-data">
      <div class="column-data">
        <span>Name: {{ storePokemon.clickedPokemon?.name }}</span>
        <span
          >Type:
          {{
            storePokemon.clickedPokemon?.types
              .map((type: any) => type.type.name)
              .join(", ")
          }}</span
        >
        <span
          >Abilities:
          {{
            storePokemon.clickedPokemon?.abilities
              .map((ability: any) => ability.ability.name)
              .join(", ")
          }}
        </span>
      </div>
      <div class="column-data">
        <span
          v-for="statIndex in storePokemon.clickedPokemon?.stats.length"
          :key="statIndex"
        >
          {{
            storePokemon.clickedPokemon?.stats[statIndex - 1].stat.name +
            ": " +
            storePokemon.clickedPokemon?.stats[statIndex - 1].base_stat
          }}</span
        >
      </div>
    </div>
    <div class="back-page" @click="$router.go(-1)">
      <a>Go Back</a>
    </div>
  </div>
</template>
