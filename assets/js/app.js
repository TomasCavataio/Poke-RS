const pokeapiBase = "https://pokeapi.co/api/v2/pokemon";
const pokemonImage = document.querySelector(".pokemon-image");
const name = document.querySelector(".name");
const pokeball = document.querySelector(".pokeball");
const openPokeball = document.querySelector(".open-pokeball");
const types = document.querySelector(".types");

/**
 *  Fetches a random pokémon through pokéAPI.
 */
function fetchPokemon() {
  hidePreviousPokemon();
  const randomPokemon = Math.floor(Math.random() * 807 + 1);
  fetch(`${pokeapiBase}/${randomPokemon}/`)
    .then((response) => response.json())
    .then(renderPokemon)
    .catch((error) => {
      console.warn(error);
      getRandomCachedPokemon().then(renderPokemon);
    });
}

/**
 * Returns a random cached pokémon as a json Promise.
 */
async function getRandomCachedPokemon() {
  const cacheStorage = await getCacheStorage();
  const cacheStorageKeys = await cacheStorage.keys();
  const pokemonUrls = cacheStorageKeys.filter((item) =>
    item.url.includes("https://pokeapi.co/api")
  );
  if (!pokemonUrls || !pokemonUrls.length) {
    return false;
  }

  const randomIndex = Math.floor(Math.random() * pokemonUrls.length);
  const cachedPokemonUrl = pokemonUrls[randomIndex];
  const cachedPokemonResponse = await cacheStorage.match(cachedPokemonUrl);
  if (!cachedPokemonResponse || !cachedPokemonResponse.ok) {
    return false;
  }

  return await cachedPokemonResponse.json();
}

/**
 * Returns the app's cache storage.
 */
async function getCacheStorage() {
  return await caches.open("poke-cache");
}

/**
 * Renders a pokémon's data on the DOM.
 * @param {object} pokemonData A given pokémon's data.
 */
function renderPokemon(pokemonData) {
  pokemonImage.src = pokemonData.sprites.front_default;
  name.innerText = pokemonData.name;

  types.innerHTML = "";
  for (let i = 0; i < pokemonData.types.length; i++) {
    const type = pokemonData.types[i].type.name;
    const typeSpan = document.createElement("span");
    typeSpan.classList.add("type");
    typeSpan.style.color = getTypesColor(type);
    typeSpan.innerText += " " + type;
    types.appendChild(typeSpan);
    if (i + 1 !== pokemonData.types.length) {
      addSeparator();
    }
  }

  showNewPokemon();
}

/**
 * Adds a separator ("|") if there is more than one type.
 */
function addSeparator() {
  const separatorSpan = document.createElement("span");
  separatorSpan.innerText = " | ";
  types.appendChild(separatorSpan);
}

/**
 * Hides the previously generated pokémon from the DOM.
 */
function hidePreviousPokemon() {
  pokemonImage.style.display = "none";
  name.style.display = "none";
  openPokeball.style.display = "block";
}

/**
 * Displays the new pokémon to the DOM.
 */
function showNewPokemon() {
  pokemonImage.style.display = "block";
  name.style.display = "block";
  openPokeball.style.display = "none";
}

/**
 * Returns the color associated with a pokémon type.
 * @param {string} type A pokémon type.
 */
function getTypesColor(type) {
  switch (type) {
    case "normal":
      return "#a8a878";
    case "fire":
      return "#f08030";
    case "fighting":
      return "#c03028";
    case "water":
      return "#6890f0";
    case "flying":
      return "#a890f0";
    case "grass":
      return "#78c850";
    case "poison":
      return "#a040a0";
    case "electric":
      return "#f8d030";
    case "ground":
      return "#e0c068";
    case "psychic":
      return "#f85888";
    case "rock":
      return "#b8a038";
    case "ice":
      return "#98d8d8";
    case "bug":
      return "#a8b820";
    case "dragon":
      return "#7038f8";
    case "ghost":
      return "#705898";
    case "dark":
      return "#705848";
    case "steel":
      return "#b8b8d0";
    case "fairy":
      return "#ee99ac";
    default:
      console.warn("Unsupported type found.");
      break;
  }
}

// Event listeners to generate pokémons.
pokeball.addEventListener("click", fetchPokemon);
document.body.onkeyup = (e) => {
  if (e.keyCode === 32 || e.keyCode === 13) {
    fetchPokemon();
  }
};

// Service worker.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./serviceWorker.js")
    .then(() => {
      console.log("Service Worker registered.");
      return navigator.serviceWorker.ready;
    })
    .then(() => {
      fetchPokemon();
    });
}
