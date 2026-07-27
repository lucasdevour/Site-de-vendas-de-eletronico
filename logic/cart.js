document.addEventListener('DOMContentLoaded', () => {
    inicializarCarrinho();
});

function inicializarCarrinho() {
    atualizarContadorCarrinho();
    const cartIcon = document.querySelector('.carrinho-box-bw');
    if (cartIcon) {
        cartIcon.addEventListener('click', abrirCarrinho);
    }
}

function getCartItems() {
    const cart = localStorage.getItem('hagon_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCartItems(items) {
    localStorage.setItem('hagon_cart', JSON.stringify(items));
    atualizarContadorCarrinho();
    renderizarItensCarrinho();
}

function adicionarAoCarrinho(id, nome, preco, imagem, qtd = 1) {
    let items = getCartItems();
    
    const index = items.findIndex(item => item.id === id);
    if (index > -1) {
        items[index].quantidade += qtd;
    } else {
        items.push({ id, nome, preco, imagem, quantidade: qtd });
    }
    
    saveCartItems(items);
    abrirCarrinho();
}

function removerDoCarrinho(id) {
    let items = getCartItems();
    items = items.filter(item => item.id !== id);
    saveCartItems(items);
}

function alterarQtdCarrinho(id, qtdNova) {
    let items = getCartItems();
    const index = items.findIndex(item => item.id === id);
    if (index > -1) {
        items[index].quantidade = Math.max(1, items[index].quantidade + qtdNova);
        saveCartItems(items);
    }
}

window.abrirCarrinho = function() {
    let sidebar = document.getElementById('cart-sidebar');
    if (!sidebar) {
        injetarHTMLCarrinho();
        sidebar = document.getElementById('cart-sidebar');
    }
    sidebar.classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
    renderizarItensCarrinho();
}

window.fecharCarrinho = function() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
}

function injetarHTMLCarrinho() {
    const html = `
        <div class="cart-overlay" id="cart-overlay" onclick="fecharCarrinho()"></div>
        <div class="cart-sidebar" id="cart-sidebar">
            <div class="cart-header">
                <h2>Seu Carrinho</h2>
                <button class="cart-close-btn" onclick="fecharCarrinho()">&times;</button>
            </div>
            <div class="cart-items" id="cart-items-container"></div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Total:</span>
                    <span id="cart-total-price">R$ 0,00</span>
                </div>
                <button class="btn-checkout" onclick="irParaCheckout()">Finalizar Compra</button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function renderizarItensCarrinho() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;
    
    const items = getCartItems();
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = '<div class="cart-empty"><i class="fa-solid fa-cart-shopping"></i><p>Seu carrinho está vazio.</p></div>';
        document.getElementById('cart-total-price').innerText = 'R$ 0,00';
        return;
    }
    
    let total = 0;
    items.forEach(item => {
        total += item.preco * item.quantidade;
        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.imagem}" alt="${item.nome}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.nome}</h4>
                    <p class="cart-item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                    <div class="cart-item-qtd">
                        <button onclick="alterarQtdCarrinho('${item.id}', -1)">-</button>
                        <input type="text" readonly value="${item.quantidade}">
                        <button onclick="alterarQtdCarrinho('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="removerDoCarrinho('${item.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
    
    document.getElementById('cart-total-price').innerText = 'R$ ' + total.toFixed(2).replace('.', ',');
}

function atualizarContadorCarrinho() {
    const items = getCartItems();
    const count = items.reduce((sum, item) => sum + item.quantidade, 0);
    const contadores = document.querySelectorAll('.contador-carrinho-bw');
    contadores.forEach(c => {
        c.innerText = count;
    });
}

window.irParaCheckout = function() {
    const items = getCartItems();
    if (items.length === 0) return alert('Seu carrinho está vazio!');
    
    const isInsidePages = window.location.pathname.includes('/pages/');
    if (isInsidePages) {
        window.location.href = 'checkout.html';
    } else {
        window.location.href = 'pages/checkout.html';
    }
}
