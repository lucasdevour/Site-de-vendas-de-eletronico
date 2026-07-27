let itensNoCarrinho = 0;

// Função responsável por atualizar visualmente o número do carrinho
function adicionarAoCarrinho() {
    const contador = document.querySelector('.contador-carrinho-bw');
    itensNoCarrinho++; 
    contador.innerText = itensNoCarrinho;
    
    if (itensNoCarrinho > 0) {
        contador.style.display = 'flex';
    }
}

// Inicializa o Carrossel (Swiper) assim que a página estiver pronta
document.addEventListener('DOMContentLoaded', function() {
    if (typeof Swiper !== 'undefined') {
        new Swiper('.meuCarrossel', {
            loop: true,
            autoplay: { delay: 3000 },
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        });
    }
});