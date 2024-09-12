#!/bin/bash

# Adicione esse script no mesmo diretorio onde estão os serviços que deseja automatizar
# a inicialização, no meu caso todos os repositorios estao em um diretorion /home/bruno/dev

# caso use zsh pode atribuir um alias para esse script como no exemplo:
# alias start_dev="/home/bruno/dev/start_services.sh"
# apos isso execute o comando: source ~/.zshrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Preencha com a lista de serviços que deseja automatizar a inicializaçao

SERVICES=()

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

for SERVICE in "${SERVICES[@]}"; do
    SERVICE_DIR="$BASE_DIR/$SERVICE"
    if [ -d "$SERVICE_DIR" ]; then
        echo "Executando $SERVICE_DIR ..."

        if [ "$SERVICE" == "issuing-frontend" ]; then
            nvm use 16
            gnome-terminal --tab --title="$SERVICE" --working-directory="$SERVICE_DIR" -- npm run dev
        else
            gnome-terminal --tab --title="$SERVICE" --working-directory="$SERVICE_DIR" -- npm run dev
        fi

    else
        echo "Mamou! Serviço $SERVICE não encontrado :-("
    fi
done
