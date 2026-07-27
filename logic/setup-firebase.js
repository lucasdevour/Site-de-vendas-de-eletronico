#!/usr/bin/env node

// Script para configurar Firebase em todos os arquivos
const fs = require('fs');
const path = require('path');

console.log('🔧 Configurador Firebase - Hagon Store\n');

// Verificar se foram passados argumentos
if (process.argv.length < 8) {
    console.log('Uso: node setup-firebase.js <apiKey> <authDomain> <projectId> <storageBucket> <messagingSenderId> <appId> [measurementId]');
    process.exit(1);
}

const [,, apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId] = process.argv;

const config = {
    apiKey: apiKey.trim(),
    authDomain: authDomain.trim(),
    projectId: projectId.trim(),
    storageBucket: storageBucket.trim(),
    messagingSenderId: messagingSenderId.trim(),
    appId: appId.trim()
};

if (measurementId) {
    config.measurementId = measurementId.trim();
}

    // Arquivos a atualizar
    const arquivos = [
        'cadastro.html',
        'login.html',
        'index.html',
        'teste-firebase.html'
    ];

    console.log('\n📝 Atualizando arquivos...\n');

    arquivos.forEach(arquivo => {
        const caminhoArquivo = path.join(__dirname, arquivo);

        if (fs.existsSync(caminhoArquivo)) {
            let conteudo = fs.readFileSync(caminhoArquivo, 'utf8');

            // Substituir as configurações
            conteudo = conteudo.replace(
                /const firebaseConfig = \{[\s\S]*?\};/g,
                `const firebaseConfig = {
            apiKey: "${config.apiKey}",
            authDomain: "${config.authDomain}",
            projectId: "${config.projectId}",
            storageBucket: "${config.storageBucket}",
            messagingSenderId: "${config.messagingSenderId}",
            appId: "${config.appId}"${config.measurementId ? `,\n            measurementId: "${config.measurementId}"` : ''}
        };`
            );

            fs.writeFileSync(caminhoArquivo, conteudo, 'utf8');
            console.log(`✅ ${arquivo} atualizado`);
        } else {
            console.log(`⚠️  ${arquivo} não encontrado`);
        }
    });

    console.log('\n🎉 Configuração concluída!');
    console.log('\n🧪 Teste abrindo: teste-firebase.html');
    console.log('📱 Para testar login/cadastro: cadastro.html e login.html');