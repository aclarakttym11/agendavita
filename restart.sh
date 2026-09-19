#!/bin/bash

echo "Reiniciando servidor AgendaVita..."

# Matar processo na porta 3000 se existir
if lsof -ti:3000 > /dev/null 2>&1; then
    echo "Matando processo na porta 3000..."
    kill -9 $(lsof -ti:3000)
    sleep 1
fi

# Iniciar servidor
echo "Iniciando servidor..."
npm start
