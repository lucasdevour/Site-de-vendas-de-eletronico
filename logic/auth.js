import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';

// Configurações do seu Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAhPVplbeCbaQFy-4Oi9KEmsZaAYHO7i9Y",
    authDomain: "hagon-store.firebaseapp.com",
    projectId: "hagon-store",
    storageBucket: "hagon-store.firebasestorage.app",
    messagingSenderId: "681640518412",
    appId: "1:681640518412:web:e55ba45b33d999e1f81f29",
    measurementId: "G-XH6TJX5XNS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função que atualiza o menu dependendo se o usuário está logado ou não
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('hagon_logado') === 'true';
    const areaAuth = document.getElementById('area-auth');
    
    if (!areaAuth) return;

    // Detect if we are inside the /pages/ directory or at the root
    const isPagesSubdir = window.location.pathname.includes('/pages/');
    const prefix = isPagesSubdir ? '' : 'pages/';

    if (isLoggedIn) {
        const userData = localStorage.getItem('hagon_user');
        const nome = userData ? JSON.parse(userData).nome : 'Usuário';
        areaAuth.innerHTML = `
            <span style="color: var(--primary); font-weight: bold;">Olá, ${nome}!</span>
            <span>|</span>
            <a href="#" id="btn-sair" style="color: var(--text-muted); font-size: 0.85rem;">Sair</a>
        `;
        
        // Adiciona o evento de clique ao botão "Sair" dinâmico
        document.getElementById('btn-sair').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        areaAuth.innerHTML = `
            <a href="${prefix}cadastro.html" class="link-nav">Cadastre-se</a>
            <span>|</span>
            <a href="${prefix}login.html" class="link-login">Fazer login</a>
        `;
    }
}

// Função de Logout tratada internamente
function logout() {
    localStorage.removeItem('hagon_logado');
    localStorage.removeItem('hagon_user');
    localStorage.removeItem('hagon_token');
    signOut(auth)
        .catch(err => console.log('Erro ao fazer logout:', err))
        .finally(() => {
            location.reload();
        });
}

// Observador de estado de autenticação do Firebase
onAuthStateChanged(auth, (user) => {
    if (user) {
        localStorage.setItem('hagon_logado', 'true');
        const userData = {
            uid: user.uid,
            email: user.email,
            nome: localStorage.getItem('hagon_user') ? JSON.parse(localStorage.getItem('hagon_user')).nome : 'Usuário'
        };
        localStorage.setItem('hagon_user', JSON.stringify(userData));
    } else {
        localStorage.removeItem('hagon_logado');
        localStorage.removeItem('hagon_user');
    }
    checkLoginStatus();
});

// Garante o carregamento inicial do status
document.addEventListener('DOMContentLoaded', checkLoginStatus);