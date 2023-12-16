var pokemonSelected = [];

const btnSelected = document.getElementById('select-pokemon');

//

btnSelected.onclick = async () => {

    if(pokemonSelected.length != 2) return crearAlerta('¡Selecciona 2 primero!');

    btnSelected.disabled = true;
    socket.emit('voteForNext', { voteFor: pokemonSelected });
};

function selectedPokemon(index) {

    if(pokemonSelected.includes(index) == true) return;

    var elementRemove = null;

    if(pokemonSelected.length >= 2) {
        elementRemove = pokemonSelected.shift();
    }
    pokemonSelected.push(index);

    if(elementRemove != null) document.getElementById('selected-index-' +elementRemove).style.backgroundColor = 'transparent';
    document.getElementById('selected-index-' +index).style.backgroundColor = 'rgb(120, 120, 120)';
}

