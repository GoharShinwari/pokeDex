const pokeContainer = document.getElementById('poke-container');
const genButtons = document.getElementById('gen-buttons');
// may need to update this number when more pokemon are added to the API 
const pokemonCount = 1008; 

// pokemon type colors
const colors = {
  fire: '#FDDFDF',
  grass: '#DEFDE0',
  electric: '#FCF7DE',
  water: '#DEF3FD',
  ground: '#f4e7da',
  rock: '#d5d5d4',
  fairy: '#fceaff',
  poison: '#98d7a5',
  bug: '#f8d5a3',
  dragon: '#97b3e6',
  psychic: '#eaeda1',
  flying: '#F5F5F5',
  fighting: '#E6E0D4',
  normal: '#F5F5F5'
}
const mainTypes = Object.keys(colors);

// pulling information from the pokeAPI
const getPokemon = async (id) => {
  const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

// putting the information onto a "card" type design
const createPokemonCard = (pokemon) => {
    const pokemonEl = document.createElement('div');
    pokemonEl.classList.add('pokemon');
  
    const name = pokemon.name[0].toUpperCase() + pokemon.name.slice(1);
    const id = pokemon.id.toString().padStart(3, '0');
  
    const pokeTypes = pokemon.types.map(type => type.type.name);
    const type = pokeTypes.join('/');
    const color = colors[pokeTypes[0]];
  
    pokemonEl.style.backgroundColor = color;
  
    const spriteUrl = pokemon.sprites.front_default;
    const pokemonInnerHTML = `
    <div class="img-container">
      <img src="${spriteUrl}" alt="${name}" />
    </div>
    <div class="info">
      <span class="number">#${id}</span>
      <h3 class="name">${name}</h3>
      <div class="type" style="background-color: ${color};">${type}</div>
    </div>
  `;
  
    pokemonEl.innerHTML = pokemonInnerHTML;
  
    pokeContainer.appendChild(pokemonEl);
  }
  
const clearPokeContainer = () => {
  pokeContainer.innerHTML = '';
}

// start of every generation, ex: gen 3 first pokemon would start at 252 (treecko). default = 1 (venusaur)
const getStartIndex = (gen) => {
    switch (gen) {
      case 1:
        return 1;
      case 2:
        return 152;
      case 3:
        return 252;
      case 4:
        return 387;
      case 5:
        return 494;
      case 6:
        return 650;
      case 7:
        return 722;
      case 8:
        return 810;
      case 9:
        return 906;
      default:
        return 1;
    }
  };

// end of every generation, ex: gen 3 last pokemon would be 386 (Deoxys). default = 151 (mew)
const getEndIndex = (gen) => {
  switch (gen) {
    case 1:
      return 151;
    case 2:
      return 251;
    case 3:
      return 386;
    case 4:
      return 493;
    case 5:
      return 649;
    case 6:
      return 721;
    case 7:
      return 809;
    case 8:
      return 905;
    case 9: 
        return 1008;
    default:
      return 1;
  }
}

// fetches the pokemon from a specific generation and sorts them by their ID number when each button is clicked
const fetchPokemons = async (generation) => {
    clearPokeContainer();
    let start = 1;
    let end = pokemonCount;
    
    if (generation !== "all") {
      const gen = parseInt(generation);
      start = getStartIndex(gen);
      end = getEndIndex(gen);
    } else {
      for (let i = 1; i <= 9; i++) {
        const startIdx = getStartIndex(i);
        const endIdx = getEndIndex(i);
        
        for (let j = startIdx; j <= endIdx; j++) {
          try {
            const pokemon = await getPokemon(j);
            createPokemonCard(pokemon);
          } catch (error) {
            console.error(`Failed to fetch Pokemon with ID ${j}:`, error);
          }
        }
      }
      
      return;
    }

    const pokemons = [];

    for (let i = start; i <= end; i++) {
      try {
        const pokemon = await getPokemon(i);
        pokemons.push(pokemon);
      } catch (error) {
        console.error(`Failed to fetch Pokemon with ID ${i}:`, error);
      }
    }

    pokemons.sort((a, b) => a.id - b.id);

    pokemons.forEach(pokemon => createPokemonCard(pokemon));
  };

  // by default loads gen 1
  fetchPokemons(1);
  
