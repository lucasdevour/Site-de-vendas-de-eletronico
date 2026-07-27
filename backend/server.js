const express = require('express');
const app = express(); // O erro acontece se houver outro 'const app' abaixo
const port = 3000;

const authRoutes = require('./src/routes/authRoutes');
app.use(express.json());

app.use('/api', authRoutes);

// Servir arquivos estáticos da raiz do projeto
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
    console.log(`✅ Sucesso! Servidor rodando em: http://localhost:${port}`);
});