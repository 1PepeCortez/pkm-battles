const rankTable = document.getElementById('rank-table');
const btnShowMore = document.getElementById('btn-rank-table');
const inputSearch = document.getElementById('searchRank');
const btnClearSearch = document.getElementById('searchClear');

var filtroDesc = true;
var filtroLast = 'winrate';

var arrayAllList = [];
var arraySearch = [];
var posView = 0;

//

socket.on("setupRanking", function (data) {
    arrayAllList = data.ranking;

    arrayAllList.forEach(e => {
        e.battles = e.wins + e.loses + e.ties;
        e.winrate = e.battles == 0 ? 0.0 : parseFloat(e.wins / e.battles * 100);
    });

    rankTable.innerHTML = '<tbody>' +createTableRanking([...arrayAllList].splice(0, 10))+ '</tbody>';
});

function createTableRanking(pokemons) {

    var finalStr = '';

    pokemons.forEach(e => {
        finalStr += '<tr>';
        finalStr += '<td>#' +e.Id+ ' &middot; ' +e.name+ '</td>';
        finalStr += '<td style="width: 40%; text-align: center;"><img src="./imagenes/pokemons/' +e.Id+ '.png"/></td>';
        finalStr += '<td style="text-align: right;">';
        finalStr += '<span style="color: green">W:' +e.wins+'</span><br/>';
        finalStr += '<span style="color: red">L:' +e.loses+'</span><br/>';
        finalStr += '<span style="color: orange">T:' +e.ties+'</span><br/>';
        finalStr += e.winrate.toFixed(2)+ '%';

        finalStr += ' <span class="text-muted">(' +e.battles+ ')</span>';
    });

    return finalStr;
}

btnShowMore.onclick = () => {
    posView++;
    rankTable.firstChild.innerHTML += createTableRanking([...arrayAllList].splice(10 * posView, 10));

    if((posView + 1) * 10 >= arrayAllList.length) {
        btnShowMore.disabled = true;
    }
};

btnClearSearch.onclick = () => {
    inputSearch.value = '';
    rankTable.innerHTML = '<tbody>' +createTableRanking([...arrayAllList].splice(0, 10))+ '</tbody>';

    btnShowMore.disabled = false;
};

inputSearch.onkeyup = () => {
    const searchName = inputSearch.value.toLowerCase();
    arraySearch = arrayAllList.filter(e => e.name.toLowerCase().includes(searchName));

    rankTable.innerHTML = '<tbody>' +createTableRanking(arraySearch)+ '</tbody>';

    if(searchName == '') {
        btnShowMore.disabled = false;
        rankTable.innerHTML = '<tbody>' +createTableRanking([...arrayAllList].splice(0, 10))+ '</tbody>';

    } else {
        btnShowMore.disabled = true;
    }
};

//

document.getElementById('btn-rank-winrate').onclick = () => {
    changeFiltro('winrate');
};

document.getElementById('btn-rank-wins').onclick = () => {
    changeFiltro('wins');
};

document.getElementById('btn-rank-loses').onclick = () => {
    changeFiltro('loses');
};

document.getElementById('btn-rank-ties').onclick = () => {
    changeFiltro('ties');
};

document.getElementById('btn-rank-battles').onclick = () => {
    changeFiltro('battles');
};

function changeFiltro(newFiltro) {

    const btnChanged = document.getElementById('btn-rank-' +newFiltro);
    const upLetter = newFiltro.charAt(0).toUpperCase() + newFiltro.slice(1);

    if(newFiltro == filtroLast) {
        filtroDesc = !filtroDesc;

        if(filtroDesc == false) btnChanged.innerHTML = '<i class="fa-solid fa-arrow-up"></i> ' +upLetter;
        else btnChanged.innerHTML = '<i class="fa-solid fa-arrow-down"></i> ' +upLetter;

    } else {

        const btnLast = document.getElementById('btn-rank-' +filtroLast);
        const lastLetter = filtroLast.charAt(0).toUpperCase() + filtroLast.slice(1);

        btnLast.innerHTML = lastLetter;
        btnLast.className = 'btn btn-sm btn-primary';

        filtroLast = newFiltro;
        filtroDesc = true;

        btnChanged.innerHTML = '<i class="fa-solid fa-arrow-down"></i> ' +upLetter;
        btnChanged.className = 'btn btn-sm btn-warning';
    }

    //

    posView = 0;
    btnShowMore.disabled = false;

    //

    if(inputSearch.value == '') {

        arrayAllList.sort(sortByElement(filtroLast));
        if(filtroDesc == true) arrayAllList.reverse();
    
        rankTable.innerHTML = '<tbody>' +createTableRanking([...arrayAllList].splice(0, 10))+ '</tbody>';

    } else {

        arraySearch.sort(sortByElement(filtroLast));
        if(filtroDesc == true) arraySearch.reverse();
    
        rankTable.innerHTML = '<tbody>' +createTableRanking(arraySearch)+ '</tbody>';
    }
}

function sortByElement(type) {
    return function(a, b) {

        if(a[type] < b[type]) return -1;
        if(a[type] > b[type]) return 1;

        if(a.Id > b.Id) return -1;
        if(a.Id < b.Id) return 1;
        
        return 0;
    }
}