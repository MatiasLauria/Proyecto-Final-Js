const cartContainer = document.querySelector('.cart-container');
const productList = document.querySelector('.product-list');
const cartList = document.querySelector('.cart-list');
const cartTotalValue = document.getElementById('cart-total-value');
const cartCountInfo = document.getElementById('cart-count-info');

let cartItemID = 1;



eventListeners();

// eventos

function eventListeners() {
    window.addEventListener('DOMContentLoaded', () => {
        loadJSON();
        loadCart();
    })

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

    productList.addEventListener('click', purchaseProduct);
}

// actualizar info de carrito

function updateCartInfo() {
    let cartInfo = findCartInfo();
    //console.log(cartInfo);
    cartCountInfo.textContent = cartInfo.productCount;
    cartTotalValue.textContent = cartInfo.total;
}

updateCartInfo();

// cargar los productos del json

function loadJSON() {
    fetch('productos.json')
        .then(response => response.json())
        .then(data => {
            let html = '';
            data.forEach(product => {
                html += `
                    <div class="product-item">
                        <div class="product-img">
                            <img src="${product.imgSrc}" alt="img de producto">
                            <button type="button" class="add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i>Comprar
                            </button>
                        </div>
                        <div class="product-content">
                            <h3 class="product-name">${product.name}</h3>
                            <span class="product-category">${product.category}</span>
                            <p class="product-price">$${product.price}</p>
                        </div>
                    </div>
            `;
            });
            productList.innerHTML = html;
        })
        .catch(error => {
            alert(`usar live server para que tome correctamente productos.json`);
        })
}

// funcion para agregar productos

function purchaseProduct(e) {
    if (e.target.classList.contains('add-to-cart-btn')) {
        let product = e.target.parentElement.parentElement;
        getProductInfo(product);
    }
}


// obtengo la informacion del producto luego de comprar
function getProductInfo(product) {
    let productInfo = {
        id: cartItemID,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').textContent,
        category: product.querySelector('.product-category').textContent,
        price: product.querySelector('.product-price').textContent
    }

    cartItemID++;
    //console.log(productInfo);
    addToCartList(productInfo);
    saveProductInstorage(productInfo);

}

// agrego el producto y lo muestro en el carrito

function addToCartList(product) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.setAttribute('data-id', `${product.id}`);
    cartItem.innerHTML = `
        <img src="${product.imgSrc}" alt="foto-producto">
            <div class="cart-item-info">
                 <h3 class="cart-item-name">${product.name}</h3>
                 <span class="cart-item-category">${product.category}</span>
                 <span class="cart-item-price">${product.price}</span>
            </div>

                    <button type="button" class="cart-item-del-btn">
                    <i class="fas fa-times"></i>
                    </button>
                                `;

    cartList.appendChild(cartItem);
}

//local storage

function saveProductInstorage(item) {
    let products = getProductFromStorage();
    products.push(item);
    localStorage.setItem('products', JSON.stringify(products));
    updateCartInfo();

}

// me retorna un array vacio si no hay info en el carrito
function getProductFromStorage() {
    return localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
}

// cargar los productos del carrito

function loadCart() {
    let products = getProductFromStorage();
    if (products.length < 1) {
        cartItemID = 1; // si no hay ningun producto en  local storage
    } else {
        cartItemID = products[products.length - 1].id;
        cartItemID++;
        // si hay, toma el id del ultimo producto y lo incrementa de a 1
    }
    products.forEach(product => addToCartList(product));
}

// Calculo del precio total del carrito

function findCartInfo() {
    let products = getProductFromStorage();
    let total = products.reduce((acc, product) => {
        let price = parseFloat(product.price.substr(1)); //quito el signo pesos
        return acc += price;
    }, 0) // se agregan todos los precios
    
    //console.log(total);

    return{
        total: total.toFixed(2),
        productCount: products.length
    }
}

