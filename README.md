# AgendaVita - Sistema de Agendamento de Consultas Odontológicas

Sistema completo de agendamento de consultas para clínica odontológica, desenvolvido com Node.js, Express, PostgreSQL e frontend moderno.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js
- **bcrypt** - Hashing de senhas
- **jsonwebtoken** - Autenticação JWT
- **dotenv** - Variáveis de ambiente
- **cors** - Cross-Origin Resource Sharing

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização moderna com gradientes e glassmorphism
- **JavaScript (Vanilla)** - Lógica de interação
- **Font Awesome** - Ícones

## 📋 Funcionalidades

### Autenticação e Autorização
- ✅ Registro de usuários (clientes)
- ✅ Login com JWT
- ✅ Diferenciação de roles (admin/cliente)
- ✅ Middleware de autenticação
- ✅ Middleware de autorização por role

### CRUD de Consultas
- ✅ Criar consulta
- ✅ Listar consultas (todas para admin, próprias para cliente)
- ✅ Buscar consulta por ID
- ✅ Atualizar consulta
- ✅ Atualizar status da consulta
- ✅ Deletar consulta
- ✅ Verificação de disponibilidade de horário

### Validação e Tratamento de Erros
- ✅ Validação de dados na entrada
- ✅ Respostas de erro padronizadas (400, 401, 403, 404, 500)
- ✅ Middleware de tratamento de erros global
- ✅ Tratamento de erros específicos (duplicidade, FK, JWT)

### Banco de Dados
- ✅ Tabela de usuários com campo role
- ✅ Tabela de consultas com relacionamentos
- ✅ Índices para performance
- ✅ Triggers para updated_at automático

## 📁 Estrutura do Projeto

```
agendavita/
├── config/
│   └── db.js                 # Configuração do PostgreSQL
├── controllers/
│   ├── authController.js     # Lógica de autenticação
│   └── consultaController.js # Lógica de consultas
├── middlewares/
│   ├── auth.js               # Middleware de autenticação JWT
│   ├── authorize.js          # Middleware de autorização por role
│   ├── validate.js           # Middleware de validação de dados
│   └── errorHandler.js       # Middleware de tratamento de erros
├── models/
│   ├── User.js               # Model de usuários
│   └── Consulta.js           # Model de consultas
├── routes/
│   ├── authRoutes.js         # Rotas de autenticação
│   └── consultaRoutes.js     # Rotas de consultas
├── .env                      # Variáveis de ambiente
├── database.sql              # Script SQL para criar tabelas
├── index.html                # Frontend
├── script.js                 # Lógica do frontend
├── style.css                 # Estilos
├── server.js                 # Entry point
└── package.json              # Dependências
```

## 🛠️ Instalação

### Pré-requisitos
- Node.js (v14 ou superior)
- PostgreSQL (v12 ou superior)
- npm ou yarn

### Passos

1. **Clone o repositório**
```bash
cd /home/clara/Documentos/agendavita
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o banco de dados**
```bash
# Crie o banco de dados no PostgreSQL
createdb consultas_db

# Execute o script SQL
psql -d consultas_db -f database.sql
```

4. **Configure as variáveis de ambiente**
Edite o arquivo `.env` com suas configurações:
```env
PORT=3000
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=consultas_db
DB_PORT=5432
JWT_SECRET=segredo_super_secreto
```

5. **Inicie o servidor**
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
node server.js
```

6. **Acesse a aplicação**
Abra o navegador em: `http://localhost:3000`

## 🔐 API Endpoints

### Autenticação

#### POST /auth/register
Registra um novo usuário.

**Body:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

#### POST /auth/login
Faz login e retorna token JWT.

**Body:**
```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Response:**
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "cliente"
  }
}
```

#### GET /auth/profile
Retorna perfil do usuário autenticado.

**Headers:**
```
Authorization: Bearer {token}
```

### Consultas

#### POST /consultas
Cria uma nova consulta.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "paciente_id": 1,
  "dentista": "Dr. Carlos",
  "data_consulta": "2024-06-15",
  "horario": "14:30",
  "tipo_consulta": "limpeza",
  "observacoes": "Paciente com sensibilidade"
}
```

#### GET /consultas
Lista consultas (todas para admin, próprias para cliente).

**Headers:**
```
Authorization: Bearer {token}
```

#### GET /consultas/:id
Busca consulta por ID.

**Headers:**
```
Authorization: Bearer {token}
```

#### PUT /consultas/:id
Atualiza consulta completa.

**Headers:**
```
Authorization: Bearer {token}
```

#### PATCH /consultas/:id/status
Atualiza apenas o status da consulta.

**Headers:**
```
Authorization: Bearer {token}
```

**Body:**
```json
{
  "status": "concluída"
}
```

#### DELETE /consultas/:id
Deleta uma consulta.

**Headers:**
```
Authorization: Bearer {token}
```

## 👥 Roles de Usuário

### Cliente
- Criar consultas
- Ver suas próprias consultas
- Atualizar suas consultas
- Deletar suas consultas
- Alterar status de suas consultas

### Admin
- Todas as permissões de cliente
- Ver todas as consultas
- Atualizar qualquer consulta
- Deletar qualquer consulta
- Acesso total ao sistema

## 🎨 Design do Frontend

O frontend possui um design moderno com:
- **Glassmorphism** - Efeito de vidro fosco
- **Gradientes** - Cores vibrantes em azul e ciano
- **Responsividade** - Adaptado para mobile
- **Ícones** - Font Awesome para melhor visualização
- **Animações** - Transições suaves
- **UX intuitiva** - Fluxo claro de navegação

## 📝 Estrutura do Banco de Dados

### Tabela usuarios
- id (SERIAL PK)
- nome (VARCHAR)
- email (VARCHAR UNIQUE)
- senha (VARCHAR - hash bcrypt)
- role (VARCHAR - 'admin' ou 'cliente')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Tabela consultas
- id (SERIAL PK)
- paciente_id (INTEGER FK)
- dentista (VARCHAR)
- data_consulta (DATE)
- horario (TIME)
- tipo_consulta (VARCHAR)
- observacoes (TEXT)
- status (VARCHAR - 'agendada', 'concluída', 'cancelada')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 🔒 Segurança

- Senhas hash com bcrypt (salt rounds: 10)
- Autenticação via JWT
- Autorização por role
- Validação de dados na entrada
- Proteção contra SQL Injection (parameterized queries)
- CORS configurado
- Variáveis de ambiente para dados sensíveis

## 🧪 Testando a API

Você pode usar ferramentas como:
- **Postman**
- **Insomnia**
- **curl**

Exemplo com curl:
```bash
# Registro
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"João","email":"joao@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","senha":"123456"}'

# Criar consulta
curl -X POST http://localhost:3000/consultas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"paciente_id":1,"dentista":"Dr. Carlos","data_consulta":"2024-06-15","horario":"14:30","tipo_consulta":"limpeza"}'
```

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.

## 👤 Autor

Desenvolvido com ❤️ para AgendaVita - Clínica Odontológica
