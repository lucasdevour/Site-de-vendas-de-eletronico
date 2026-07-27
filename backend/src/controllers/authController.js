const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../../users.json');

const getUsers = () => {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const saveUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

exports.register = async (req, res) => {
    const { nome, sobrenome, tipoPessoa, documento, email, senha } = req.body;

    try {
        const users = getUsers();

        // Verificar se o email já existe
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({ erro: "E-mail já cadastrado." });
        }

        // Hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Criar novo usuário
        const newUser = {
            id: users.length + 1,
            nome,
            sobrenome,
            tipoPessoa,
            documento,
            email,
            senhaHash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        saveUsers(users);

        // Gerar token
        const token = jwt.sign({ id: newUser.id }, 'CHAVE_SECRETA_HAGON', { expiresIn: '1d' });

        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso!",
            token,
            user: { id: newUser.id, nome: newUser.nome, email: newUser.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, user.senhaHash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "E-mail ou senha incorretos." });
        }

        // Gerar token
        const token = jwt.sign({ id: user.id }, 'CHAVE_SECRETA_HAGON', { expiresIn: '1d' });

        res.json({
            mensagem: "Login realizado com sucesso!",
            token,
            user: { id: user.id, nome: user.nome, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro interno no servidor." });
    }
};

// Salvar dados do usuário (chamado após criação no Firebase)
exports.saveUsuario = async (req, res) => {
    const { uid, nome, sobrenome, email, tipoPessoa, documento, dataCadastro } = req.body;

    try {
        const users = getUsers();

        // Verificar se já existe
        const existingIndex = users.findIndex(u => u.uid === uid);
        
        const userData = {
            uid,
            nome,
            sobrenome,
            email,
            tipoPessoa,
            documento,
            dataCadastro: dataCadastro || new Date().toISOString()
        };

        if (existingIndex >= 0) {
            // Atualizar
            users[existingIndex] = { ...users[existingIndex], ...userData };
        } else {
            // Criar novo
            users.push(userData);
        }

        saveUsers(users);
        
        res.status(201).json({
            mensagem: "Dados do usuário salvos com sucesso!",
            user: userData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao salvar dados do usuário." });
    }
};

// Recuperar dados do usuário
exports.getUsuario = async (req, res) => {
    const { uid } = req.params;

    try {
        const users = getUsers();
        const user = users.find(u => u.uid === uid);

        if (!user) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao recuperar dados do usuário." });
    }
};

// Listar todos os usuários (sem mostrar senhaHash)
exports.listarUsuarios = async (req, res) => {
    try {
        const users = getUsers();
        
        // Remove senhaHash para não expor dados sensíveis
        const usuariosPublicos = users.map(({ senhaHash, ...rest }) => rest);
        
        res.json({
            total: usuariosPublicos.length,
            usuarios: usuariosPublicos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao listar usuários." });
    }
};

// Login de admin
exports.loginAdmin = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const adminConfig = require('../config/admin');

        // Verificar email
        if (email !== adminConfig.email) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, adminConfig.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Email ou senha incorretos." });
        }

        // Gerar token
        const token = jwt.sign(
            { admin: true, email: email },
            'CHAVE_SECRETA_ADMIN',
            { expiresIn: '24h' }
        );

        res.json({
            mensagem: "Login de admin realizado com sucesso!",
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao fazer login de admin." });
    }
};

// Login geral - aceita tanto admin quanto usuário comum, com fallback para Firebase
exports.loginGeral = async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Primeiro tenta login como admin
        const adminConfig = require('../config/admin');
        if (email === adminConfig.email) {
            const senhaValida = await bcrypt.compare(senha, adminConfig.senha_hash);
            if (senhaValida) {
                const token = jwt.sign(
                    { admin: true, email: email, userType: 'admin' },
                    'CHAVE_SECRETA_ADMIN',
                    { expiresIn: '24h' }
                );
                return res.json({
                    mensagem: "Login realizado com sucesso!",
                    token,
                    userType: 'admin',
                    user: { email: email, tipo: 'admin' }
                });
            }
        }

        // Se não for admin, tenta login como usuário comum no Node.js
        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (user && user.senhaHash) {
            // Se tem senha hash no Node.js, verifica normalmente
            const senhaValida = await bcrypt.compare(senha, user.senhaHash);
            if (senhaValida) {
                const token = jwt.sign(
                    { id: user.id, email: user.email, userType: 'user' },
                    'CHAVE_SECRETA_HAGON',
                    { expiresIn: '24h' }
                );
                return res.json({
                    mensagem: "Login realizado com sucesso!",
                    token,
                    userType: 'user',
                    user: { id: user.id, nome: user.nome, email: user.email }
                });
            }
        }

        // Se não conseguiu login no Node.js, retorna erro para que o frontend tente Firebase
        return res.status(401).json({
            erro: "E-mail ou senha incorretos. Tente novamente.",
            tryFirebase: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao fazer login." });
    }
};

// Deletar usuário
exports.deleteUsuario = async (req, res) => {
    const { uid } = req.params;

    try {
        const users = getUsers();
        const userIndex = users.findIndex(u => u.uid === uid || u.id == uid);

        if (userIndex === -1) {
            return res.status(404).json({ erro: "Usuário não encontrado." });
        }

        // Remover o usuário
        const deletedUser = users.splice(userIndex, 1)[0];
        saveUsers(users);

        res.json({
            mensagem: "Usuário deletado com sucesso!",
            user: { uid: deletedUser.uid, email: deletedUser.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao deletar usuário." });
    }
};

// Mudar senha do admin
exports.changeAdminPassword = async (req, res) => {
    const { senhaAtual, novaSenha } = req.body;

    try {
        const adminConfig = require('../config/admin');

        // Verificar senha atual
        const senhaValida = await bcrypt.compare(senhaAtual, adminConfig.senha_hash);
        if (!senhaValida) {
            return res.status(401).json({ erro: "Senha atual incorreta." });
        }

        // Gerar novo hash para a nova senha
        const novoHash = await bcrypt.hash(novaSenha, 10);

        // Atualizar arquivo de configuração
        const fs = require('fs');
        const path = require('path');
        const configPath = path.join(__dirname, '../config/admin.js');

        const novoConteudo = `// Credencial de admin - MUDE ISSO APÓS O PRIMEIRO LOGIN!
module.exports = {
    email: "${adminConfig.email}",
    senha_hash: "${novoHash}", // senha: ${novaSenha}
    // Para gerar novo hash: node -e "require('bcryptjs').hash('sua_senha', 10, (e,h) => console.log(h))"
};`;

        fs.writeFileSync(configPath, novoConteudo);

        res.json({ mensagem: "Senha alterada com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ erro: "Erro ao alterar senha." });
    }
};