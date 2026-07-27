# Hagon Store - Autenticação com Firebase

## 🚀 Configuração Rápida (Método Fácil)

### 1. Execute o configurador automático

```bash
npm run setup-firebase
```

Este comando irá:
- Perguntar suas chaves do Firebase
- Atualizar automaticamente todos os arquivos
- Configurar tudo para você

### 2. Teste a configuração

Abra `teste-firebase.html` no navegador para verificar se está funcionando.

### 3. Teste login/cadastro

- `cadastro.html` - Para criar conta
- `login.html` - Para fazer login
- `index.html` - Página principal (verifica login automaticamente)

---

## 🔧 Configuração Manual (Passo a passo)

### 1. Criar projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Criar um projeto" ou "Add project"
3. Dê um nome ao projeto (ex: "hagon-store")
4. Ative o Google Analytics se quiser
5. Clique em "Criar projeto"

### 2. Ativar Authentication

1. No menu lateral, clique em "Authentication"
2. Vá na aba "Sign-in method"
3. Ative o provedor "Email/Password"
4. Clique em "Save"

### 3. Configurar as chaves da API

1. No menu lateral, clique em "Project settings" (ícone de engrenagem)
2. Role para baixo até "Your apps"
3. Clique em "Add app" > Web app (ícone </>)
4. Dê um nome (ex: "Hagon Store Web")
5. **IMPORTANTE**: Marque "Also set up Firebase Hosting" como NÃO
6. Clique em "Register app"

### 4. Copiar as configurações

Após registrar o app, você verá um código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "hagon-store-12345.firebaseapp.com",
  projectId: "hagon-store-12345",
  storageBucket: "hagon-store-12345.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 5. Substituir manualmente nos arquivos

Atualize estes arquivos substituindo `YOUR_API_KEY` etc.:

- `cadastro.html`
- `login.html`
- `index.html`
- `teste-firebase.html`

## 📁 Arquivos modificados

- `cadastro.html` - Cadastro via Firebase Auth
- `login.html` - Login via Firebase Auth
- `index.html` - Verificação automática de estado de login
- `setup-firebase.js` - Script de configuração automática

## 🔒 Segurança

- ✅ Senhas criptografadas pelo Firebase
- ✅ Não há necessidade de servidor backend
- ✅ Dados salvos na nuvem do Google
- ✅ Autenticação persistente

## 🎯 Vantagens

- ✅ Funciona em qualquer hospedagem (GitHub Pages, Netlify, etc.)
- ✅ Não precisa de servidor Node.js em produção
- ✅ Autenticação persistente entre sessões
- ✅ Seguro e escalável
- ✅ Gratuito para até 100 usuários simultâneos

## 🚨 Limitações do plano gratuito

- 100 usuários simultâneos
- 50.000 usuários totais
- Para mais usuários, upgrade para plano pago

---

**Dúvidas?** Consulte a [documentação do Firebase Auth](https://firebase.google.com/docs/auth)