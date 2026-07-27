const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarTokenGeral } = require('../middleware/autenticacao');

// Rota para registro de usuário comum
router.post('/register', authController.register);

// Rota para login de usuário comum
router.post('/login', authController.login);

// Rota de login do admin
router.post('/admin/login', authController.loginAdmin);

// Rota de login geral (aceita admin ou usuário comum)
router.post('/login/geral', authController.loginGeral);

// Rota para salvar dados de usuário (Firebase / Node)
router.post('/usuarios', authController.saveUsuario);

// Rota para listar todos os usuários (protegida)
router.get('/usuarios/listar', verificarTokenGeral, authController.listarUsuarios);

// Rota para recuperar dados de usuário (protegida)
router.get('/usuarios/:uid', verificarTokenGeral, authController.getUsuario);

// Rota para deletar usuário (protegida)
router.delete('/usuarios/:uid', verificarTokenGeral, authController.deleteUsuario);

// Rota para mudar senha do admin (protegida)
router.post('/admin/change-password', verificarTokenGeral, authController.changeAdminPassword);

module.exports = router;