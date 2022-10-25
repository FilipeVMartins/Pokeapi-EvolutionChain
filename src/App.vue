<script lang="ts">
/// <amd-dependency path="lib/errorInfoHandler">
import { RouterView } from "vue-router";
import { usePokemonStore } from "@/stores/pokemon";

export interface AppViewProps {
  pokemonNameSearch: string;
  foundPokemon: null | any;
  foundEvolutionChain: null | any;
  completeEvolutionChain: null | any;
  noPokemonFound: boolean;
  searchingState: boolean;
  speciesFromEvolutionChain: any[];
  P: any;
  storePokemon: any;
}

export default {
  components: {
    RouterView,
  },

  data() {
    return {
      pokemonNameSearch: "",
      foundPokemon: null,
      foundEvolutionChain: null,
      completeEvolutionChain: null,
      noPokemonFound: false,
      searchingState: false,
      speciesFromEvolutionChain: [],
      // acording to pokeapi rules, results must be cashed to avoid IP address getting permanently banned. 'pokeapi-js-wrapper' is a library recomended in the docs to perform the caching, both json and images results.
      // eslint-disable-next-line no-undef
      P: new Pokedex.Pokedex(),
      storePokemon: usePokemonStore(),
    } as AppViewProps;
  },

  methods: {
    searchPokemon(e: Event) {
      e.preventDefault();
      if (this.pokemonNameSearch.trim() === "") {
        this.clearResults(e);
        return;
      }

      this.$router.push({ name: "results" });
      this.searchingState = true;

      this.P.resource([
        // gets a pokemon by its name, if it exists
        `/api/v2/pokemon/${this.pokemonNameSearch.trim().toLowerCase()}`,
      ])
        .then((response: any) => {
          const pokemon = response[0];
          console.log("response - pokemon: ", pokemon);

          // check valid return
          if (
            pokemon?.name == this.pokemonNameSearch.trim().toLowerCase() &&
            pokemon?.species?.url
          ) {
            // set the found pokemon
            this.foundPokemon = pokemon;
            // search for its species
            this.searchPokemonSpecies(pokemon);
            // clear previous not found message
            this.noPokemonFound = false;
          }
        })
        .catch((error: any) => {
          if (error.response.status == 404) {
            // enable no pokemon found page
            this.noPokemonFound = true;
            this.searchingState = false;
          }
        });
      // .finally(() => {
      //   this.searchingState = false;
      // });
    },

    searchPokemonSpecies(pokemon: any) {
      this.searchingState = true;

      this.P.resource([
        // gets the found pokemon species
        pokemon.species.url,
      ])
        .then((response: any) => {
          const pokemonSpecies = response[0];
          console.log("response - species: ", pokemonSpecies);

          // check valid return
          if (
            pokemonSpecies?.name ==
              this.pokemonNameSearch.trim().toLowerCase() &&
            pokemonSpecies?.evolution_chain?.url
          ) {
            // search for its evolution chain
            this.searchPokemonEvolutionChain(pokemonSpecies);
          }
        })
        .catch((error: any) => {
          if (error.response.status == 404) {
            // enable no pokemon found page
            this.noPokemonFound = true;
            this.searchingState = false;
            alert(error.response.status);
          }
        });
      // .finally(() => {
      //   this.searchingState = false;
      // });
    },

    searchPokemonEvolutionChain(pokemonSpecies: any) {
      this.searchingState = true;

      this.P.resource([
        // gets the found pokemonSpecies evolution_chain
        pokemonSpecies.evolution_chain.url,
      ])
        .then((response: any) => {
          const evolution_chain = response[0];
          console.log("response - evolution_chain: ", evolution_chain);

          // check valid return
          if (evolution_chain?.id) {
            // set the found evolution_chain
            this.foundEvolutionChain = evolution_chain;
            const speciesNeeded = this.getSpeciesFromEvolutionChain(
              evolution_chain.chain
            );
            // get data from all species contained within the evolution chain
            this.searchSpeciesListFromEvolutionChain(speciesNeeded);
          }
        })
        .catch((error: any) => {
          if (error.response.status == 404) {
            // enable no pokemon found page
            this.noPokemonFound = true;
            this.searchingState = false;
            alert(error.response.status);
          }
        });
      // .finally(() => {
      //   this.searchingState = false;
      // });
    },

    searchSpeciesListFromEvolutionChain(speciesList: any[]) {
      this.searchingState = true;

      this.P.resource(
        // gets species list
        speciesList.map((species) => species.url)
      )
        .then((response: any) => {
          const species_list = response;
          console.log("response - species_list: ", species_list);

          // check valid return
          if (species_list.length > 0) {
            // set the found species_list
            this.speciesFromEvolutionChain = species_list;
            const pokemonsNeeded =
              this.getPokemonsFromEvolutionChain(species_list);
            // get data from all pokemons contained within the evolution chain
            this.searchPokemonsListFromEvolutionChain(pokemonsNeeded);
          }
        })
        .catch((error: any) => {
          if (error.response.status == 404) {
            // enable no pokemon found page
            this.noPokemonFound = true;
            this.searchingState = false;
            alert(error.response.status);
          }
        });
      // .finally(() => {
      //   this.searchingState = false;
      // });
    },

    searchPokemonsListFromEvolutionChain(pokemonsList: any[]) {
      this.searchingState = true;

      this.P.resource(
        // gets species list
        pokemonsList.map((pokemon) => pokemon.url)
      )
        .then((response: any) => {
          const pokemons_list = response;
          console.log("response - pokemons_list: ", pokemons_list);

          // check valid return
          if (pokemons_list.length > 0) {
            // add species and pokemons data to evolution chain
            let complete_evolution_chain = this.buildCompleteEvolutionChainData(
              pokemons_list,
              this.speciesFromEvolutionChain,
              this.foundEvolutionChain
            );
            console.log("builded - complete_evolution_chain_data");
            this.completeEvolutionChain = complete_evolution_chain;
          }
        })
        .catch((error: any) => {
          console.log(error);
          if (error.response.status == 404) {
            // enable no pokemon found page
            this.noPokemonFound = true;
            alert(error.response.status);
          }
        })
        .finally(() => {
          this.searchingState = false;
        });
    },

    clearResults(e: Event) {
      e.preventDefault();
      this.pokemonNameSearch = "";
      this.noPokemonFound = false;
      this.foundPokemon = null;
      this.completeEvolutionChain = false;
    },

    getSpeciesFromEvolutionChain(chain: any) {
      let speciesNeeded: any[] = [];
      let chainQueue: any[] = [chain];

      while (chainQueue.length !== 0) {
        speciesNeeded.push(chainQueue[0].species);
        chainQueue[0].evolves_to.forEach((chainChild: any) => {
          chainQueue.push(chainChild);
        });
        chainQueue.shift();
      }
      return speciesNeeded;
    },

    // defaults only, not considering forms varieties evolutions
    getPokemonsFromEvolutionChain(species_list: any) {
      let pokemonsNeeded: any[] = [];
      let default_pokemon;
      species_list.forEach((species: any) => {
        default_pokemon = species.varieties.find(
          (variety: any) => variety.is_default === true
        );

        pokemonsNeeded.push(default_pokemon.pokemon);
      });
      return pokemonsNeeded;
    },

    buildCompleteEvolutionChainData(
      pokemons_list: any,
      species_list: any,
      evolution_chain: any
    ) {
      let complete_evolution_chain = evolution_chain.chain;
      let chainQueue: any[] = [complete_evolution_chain];
      let speciesData;
      let pokemonData;
      // evolutionData, structure that will contain an array of arrays each subarray representing one level of evolution and containing all pokemons within that level
      let evolutionData: any[][] = [];
      let countCurrentTreeDepth = 0;
      // countItemsLeftOnCurrentDepth, initialized with level 0 length
      let countItemsLeftOnCurrentDepth = chainQueue.length;
      let countItemsNextDepth = 0;

      while (chainQueue.length !== 0) {
        // add current depth index to evolutionData if not yet set
        if (evolutionData[countCurrentTreeDepth] === undefined) {
          evolutionData.push([]);
        }

        //add species data
        speciesData = species_list.find(
          (species: any) => species.name === chainQueue[0].species.name
        );
        chainQueue[0].species = speciesData;

        //add pokemons data
        if (speciesData) {
          // chainQueue[0].species.varieties.forEach((variety: any, index: any) => {
          speciesData.varieties.forEach((variety: any) => {
            pokemonData = pokemons_list.find(
              (pokemon: any) => pokemon.name === variety.pokemon.name
            );
            if (variety.is_default && pokemonData) {
              // chainQueue[0].species.varieties[index].pokemon = pokemonData;
              evolutionData[countCurrentTreeDepth].push(pokemonData);
            }
          });
        }

        // adds child node to the queue
        chainQueue[0].evolves_to.forEach((chainChild: any) => {
          chainQueue.push(chainChild);
          // count items of the next level
          countItemsNextDepth++;
        });
        chainQueue.shift();

        // handle depth, if countItemsLeftOnCurrentDepth get to 0, that means it's a new level
        countItemsLeftOnCurrentDepth--;
        if (countItemsLeftOnCurrentDepth == 0) {
          //count the new level
          countCurrentTreeDepth++;
          // restart items left on current depth countdown with the items count of the next level
          countItemsLeftOnCurrentDepth = countItemsNextDepth;
          // restart items count of the next level
          countItemsNextDepth = 0;
        }
      }

      // return complete_evolution_chain;
      return evolutionData;
    },
  },

  watch: {
    noPokemonFound(newValue) {
      if (newValue === true) {
        this.$router.push({ name: "notfound" });
      } else {
        this.$router.push({ name: "results" });
      }
    },
    $route(newValue) {
      //redirect in case notfound view is directly accessed
      if (newValue.name == "notfound" && !this.noPokemonFound) {
        this.$router.push({ name: "results" });
      }
    },
    completeEvolutionChain(newValue) {
      this.$router.push({
        // name: "results",
        params: {
          searchedPokemonName: this.foundPokemon?.name,
          completeEvolutionChain: JSON.stringify(newValue),
        },
      });
      // send to pokemon store
      this.storePokemon.searchedPokemonName = this.foundPokemon?.name;
      this.storePokemon.completeEvolutionChain = newValue;
    },

    // foundEvolutionChain(newValue) {
    //   this.$router.push({ params: { foundEvolutionChain: "1234" } });

    //   //
    // },

    // this.$router.push({ name: "details", params: { userId: "123" } });
  },

  // beforeMount() {
  //   this.$router.push({ params: { userId: "123" } });
  // },

  mounted() {
    // console.log(newObject === this.someObject); // false
    // this.$router.push({ params: { userId: "123" } });
  },
};
</script>

<template>
  <div class="app">
    <header className="app-header">
      <h1 className="header-title">Pokedex</h1>

      <form @submit="(e) => searchPokemon(e)" :disabled="searchingState">
        <!-- <small style={{display: this.state.validationDisplay}}>Search needs to be at least two characters long</small> -->
        <input
          className="input-pokemon-name"
          type="text"
          v-model="pokemonNameSearch"
          :disabled="searchingState"
        />

        <div className="buttons-wrapper">
          <button
            type="reset"
            @click="(e) => clearResults(e)"
            :disabled="searchingState"
          >
            Clear Results
          </button>
          <button
            type="submit"
            @click="(e) => searchPokemon(e)"
            :disabled="searchingState"
          >
            Search
          </button>
        </div>
      </form>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
  <!-- <header>
    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
</template>

<style scoped></style>
