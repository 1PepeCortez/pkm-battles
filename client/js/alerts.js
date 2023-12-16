const alertDiv = document.getElementById('warn-list');

function crearAlerta(mensaje) {

    var toastPrincipal = document.createElement("div");
    toastPrincipal.className = 'toast-create';
    toastPrincipal.innerHTML = mensaje;

    alertDiv.appendChild(toastPrincipal);

    //

    setTimeout(() => {
        toastPrincipal.className += ' toast-delete';

        toastPrincipal.addEventListener('animationend', () => {
            alertDiv.removeChild(toastPrincipal);
        }, false);
    }, 2000);
}