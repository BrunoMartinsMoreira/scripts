#!/bin/bash

echo "Executando pre-push hook..."

cleanup_and_exit() {
    local exit_code=$1
    local error_msg=$2
    
    if [ ! -z "$START_PID" ]; then
        echo "🛑 Encerrando aplicação..."
        kill $START_PID 2>/dev/null || true
    fi

    if [ $exit_code -ne 0 ]; then
        echo "❌ Erro: $error_msg" >&2
        echo "⛔ Push cancelado devido a erros."
    fi

    exit $exit_code
}

if [ ! -f "package.json" ]; then
    cleanup_and_exit 1 "package.json não encontrado. Certifique-se de estar na raiz do projeto."
fi

clear
echo "🚀 Iniciando processo de build e start..."

echo "📦 Instalando dependências..."
npm ci || cleanup_and_exit 1 "Falha na instalação de dependências"

echo "🛠️ Realizando build..."
npm run build || cleanup_and_exit 1 "Falha no processo de build"

echo "🔥 Iniciando aplicação para testes..."
npm start & 
START_PID=$!

echo "⏳ Aguardando inicialização da aplicação..."
sleep 10

if ! kill -0 $START_PID 2>/dev/null; then
    cleanup_and_exit 1 "A aplicação falhou ao iniciar"
fi

echo "✅ Aplicação iniciada com sucesso!"
echo "🛑 Parando aplicação..."

cleanup_and_exit 0