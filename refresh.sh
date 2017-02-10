#!/usr/bin/env bash

ACTION=$1

function refreshModule {
    chmod +x docker.sh

    WORKSPACE=$(pwd)

    if ! ./build.sh $ACTION
    then
        echo "Fail in build"
        exit 1
    fi

    if ! ./docker.sh $ACTION
    then
        echo "Fail in dockerize"
        exit 1
    fi

    cd $WORKSPACE

    echo "Refreshing actual running docker-compose"
    if ! docker-compose up -d
    then
        exit 1;
    fi

    exit 0
}

refreshModule