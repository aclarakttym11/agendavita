const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const authRoutes = require('./routes/authRoutes');
const consultaRoutes = require('./routes/consultaRoutes');
const dentistaRoutes = require('./routes/dentistaRoutes');
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes');
const { errorHandler, notFound } = require('./middlewares/errorHandler');

// Rotas
app.use('/auth', authRoutes);
app.use('/consultas', consultaRoutes);
app.use('/dentistas', dentistaRoutes);
app.use('/disponibilidade', disponibilidadeRoutes);

// Rota para servir o frontend
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Middleware para rotas não encontradas (deve ser depois das rotas)
app.use(notFound);

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'desenvolvimento'}`);
});