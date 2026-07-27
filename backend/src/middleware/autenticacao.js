const jwt = require('jsonwebtoken');

module.exports = function verificarTokenAdmin(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido." });
    }

    try {
        const decoded = jwt.verify(token, 'CHAVE_SECRETA_ADMIN');
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ erro: "Token inválido ou expirado." });
    }
};

// Middleware para verificar qualquer token válido (admin ou usuário)
function verificarTokenGeral(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ erro: "Token não fornecido." });
    }

    // Verificar se é um token Firebase (simples)
    if (token.startsWith('firebase_')) {
        req.user = { firebase: true, uid: token.replace('firebase_', '') };
        req.userType = 'user';
        return next();
    }

    // Tenta verificar como token de admin primeiro
    try {
        const decoded = jwt.verify(token, 'CHAVE_SECRETA_ADMIN');
        req.user = decoded;
        req.userType = 'admin';
        return next();
    } catch (adminError) {
        // Se não for admin, tenta verificar como token de usuário comum
        try {
            const decoded = jwt.verify(token, 'CHAVE_SECRETA_HAGON');
            req.user = decoded;
            req.userType = 'user';
            return next();
        } catch (userError) {
            return res.status(401).json({ erro: "Token inválido ou expirado." });
        }
    }
}

module.exports.verificarTokenGeral = verificarTokenGeral;
