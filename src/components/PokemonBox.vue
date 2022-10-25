<script setup lang="ts">
defineProps<{
  pokemon: any;
  isSearched: boolean;
}>();

const capitalizeWords = (string: string) => {
  return string.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase();
  });
};
</script>

<template>
  <div
    v-if="pokemon"
    :class="['pokemon-box', isSearched ? 'searched-pokemon-box' : '']"
  >
    <figure>
      <img :src="pokemon.sprites.front_default" alt="Trulli" />
      <figcaption class="pokemon-name">
        {{ capitalizeWords(pokemon.name.replace(/\-/g, " ")) }}
      </figcaption>
    </figure>

    <div class="pokemon-id">#{{ pokemon.id }}</div>
  </div>
</template>

<style scoped>
.pokemon-box {
  position: relative;
  box-shadow: 0px 0.313rem 0.625rem #5538ee14;
  border: 0.063rem solid #5538ee24;
  border-radius: 0.938rem;
  margin: 1rem;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  height: auto;
}
.pokemon-box:hover {
  background-color: rgb(205, 255, 255);
  cursor: pointer;
}
.pokemon-box figure {
  margin: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}

.pokemon-box figure img {
  width: 7.7rem;
  height: 7.7rem;
}

.pokemon-box .pokemon-name {
  font-size: 1.1rem;
  margin: 5px;
}

.pokemon-box .pokemon-type {
  font-size: 0.9rem;
  text-align: center;
  margin: 5px;
}

.pokemon-box .pokemon-id {
  position: absolute;
  left: 0.313rem;
  top: 0.313rem;
  opacity: 0.4;
  color: black;
  font-size: 1rem;
}

.searched-pokemon-box {
  border: 1px solid #ffff00;
  background-color: #ffffcc;
}
</style>
