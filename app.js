const cartContainer = document.querySelector('.cart-container');
eventListeners();

// eventos

function eventListeners() {
    // desplegar navbar

    document.querySelector('.navbar-toggler')
        .addEventListener('click', () => {
            document.querySelector('.navbar-collapse')
                .classList.toggle('show-navbar');
        });

    // mostrar-ocultar carrito


    document.getElementById('cart-btn')
        .addEventListener('click', () => {
            cartContainer.classList.toggle('show-cart-container');
        });
}