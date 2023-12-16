const btnBattle = document.getElementById('btn-battles');
const btnRanking = document.getElementById('btn-ranking');

const containerBattle = document.getElementById('container-battle');
const containerRanking = document.getElementById('container-ranking');

//

addEventListener("DOMContentLoaded", (event) => {
    btnBattle.disabled = true;
});

btnBattle.onclick = async () => {
    btnBattle.disabled = true;
    btnRanking.disabled = false;

    containerBattle.style.display = 'block';
    containerRanking.style.display = 'none';

    btnBattle.blur();
};

btnRanking.onclick = async () => {
    btnBattle.disabled = false;
    btnRanking.disabled = true;

    containerBattle.style.display = 'none';
    containerRanking.style.display = 'block';

    btnRanking.blur();
};

// SOCKET IO

var socket = io.connect("http://localhost:8000", { forceNew: true });

//