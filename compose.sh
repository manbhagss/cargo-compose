#!/usr/bin/env bash

ACTION=$1

function startingDockerCompose {

    case $ACTION in
    init)
        generateDocumentation
        initByRebuildingAllModulesAndDockerImages
        ;;
    *)
    esac

    echo "Cleaning up actual running docker-compose"
    docker-compose down

    echo "Starting docker compose"
    docker-compose up --remove-orphans
}

function generateDocumentation {
    WORKSPACE=$(pwd)

    if cd ../../cdc-documentation
    then
        npm install
        npm run build
    else
        echo "Documentation module not found! Did you clone it?"
    fi

    cd $WORKSPACE
}

function initByRebuildingAllModulesAndDockerImages {
    chmod +x docker.sh

    echo "Started with init command"

    if ! ./build.sh all
    then
     exit 1;
    fi

    if ! ./docker.sh all
    then
     exit 1;
    fi
}

startingDockerCompose
