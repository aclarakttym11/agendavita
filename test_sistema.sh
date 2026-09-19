#!/bin/bash

echo "=== Teste do Sistema AgendaVita ==="
echo ""

# Teste 1: Registrar usuário cliente
echo "1. Registrando usuário cliente..."
curl -s -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Maria Silva","email":"maria@test.com","telefone":"11977777777","senha":"123456","role":"cliente"}'
echo ""
echo ""

# Teste 2: Login como cliente
echo "2. Fazendo login como cliente..."
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"maria@test.com","senha":"123456"}' | grep -o '"token":"[^"]*' | cut -d'"' -f4)
echo "Token obtido: ${TOKEN:0:50}..."
echo ""

# Teste 3: Listar dentistas
echo "3. Listando dentistas disponíveis..."
curl -s http://localhost:3000/dentistas \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# Teste 4: Criar consulta
echo "4. Agendando consulta..."
curl -s -X POST http://localhost:3000/consultas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"paciente_id":21,"dentista_id":1,"data_consulta":"2026-08-02","horario":"14:00","tipo_consulta":"limpeza","observacoes":"Teste do sistema"}'
echo ""
echo ""

# Teste 5: Listar consultas
echo "5. Listando consultas agendadas..."
curl -s http://localhost:3000/consultas \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

echo "=== Testes concluídos ==="
