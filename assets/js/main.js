const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const bodyElement = document.querySelector('body');

const modal = {
    box: document.querySelector(".modal"),
    overlay: document.querySelector(".overlay"),
    closeButton: document.querySelector(".btn-close")
}

const dadosPokemonMemoria = {};
const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    dadosPokemonMemoria[pokemon.number] = pokemon;
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function closeModal() {
    modal.box.classList.add("hidden");
    modal.overlay.classList.add("hidden");
    bodyElement.style.overflow = 'scroll';
}

function showModal(element) {
    const pokemonId = parseInt(element.getElementsByClassName('number')[0].textContent.replace(/#/, ''));
    const jsonPokemon = dadosPokemonMemoria[pokemonId];

    document.querySelector(".modal-image-info").src = jsonPokemon.photo;
    document.querySelector(".modal-nome-info").textContent = `#${jsonPokemon.number} - ${jsonPokemon.name} - ${jsonPokemon.weight}kg`;

    const modalDetailBaseStats = jsonPokemon.stats.map( element => {
        return `<tr><td>${element.description}</td><td>${element.points}</td></tr>\n`;
    }).join('');
    
    document.querySelector('.modal-table-base-stats-tbody').innerHTML = modalDetailBaseStats;

    modal.box.classList.remove("hidden");
    modal.overlay.classList.remove("hidden");
    modal.box.style.top = (window.scrollY + 90).toString() + "px";
    bodyElement.style.overflow = 'hidden';
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
        Array.from(document.getElementsByClassName('pokemon')).forEach(element => {
            element.addEventListener('click', event => { showModal(element) });
        });
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

modal.closeButton.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.box.classList.contains("hidden")) {
      closeModal();
    }
});
