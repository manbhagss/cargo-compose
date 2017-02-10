#!/usr/bin/env bash

ACTION=$1

function buildDocker {

    case $ACTION in
    ui)
        buildDockerImageFor cdc-campaign-ui
        ;;
    importer)
        buildDockerImageFor cdc-import-file
        ;;
    mcfmmirror)
        buildDockerImageFor cdc-mcfm-mirror
        ;;
    admin)
        buildDockerImageFor cdc-campaign-admin
        ;;
    exporter)
        buildDockerImageFor cdc-exporter
        ;;
    optivo)
        buildDockerImageFor cdc-optivo-mock
        ;;
    custcache)
        buildDockerImageFor cdc-customercache-mock
        ;;
    all)
        buildAllDockerImages
        ;;
    *)
        echo "No valid action given (ui, importer, admin, mcfmmirror, exporter, optivo, custcache or all)"
        exit 1
    esac
}

function buildAllDockerImages {
    ALL_MODULE_NAMES=$(ls ../.. | grep "cdc" | grep -v 'cdc-composition-release' | grep -v 'cdc-commons' | grep -v 'cdc-documentation')

    WORKSPACE=$(pwd)

    for MODULE_NAME in $ALL_MODULE_NAMES
    do
        if ! buildDockerImageFor $MODULE_NAME
        then
            echo ""
            echo "Some error in building the images - stopping loop."
            echo ""
            echo "========================"
            exit 1;
        else
            cd $WORKSPACE
        fi
    done
}

function buildDockerImageFor {
    MODULE_NAME=$1

    echo "========================"
    echo ""
    echo "Building Docker image for ${MODULE_NAME}"
    echo ""
    echo "========================"

    if ! cd ../../$MODULE_NAME/containers/commons
    then
        echo "Failed to go to /containers/commons directory in ${MODULE_NAME}, please make sure the path and files are valid."
        exit 1;
    fi

    chmod +x dockerize-local.sh

    if ! ./dockerize-local.sh
    then
        echo ""
        echo "Building of Docker image ${MODULE_NAME} failed"
        echo ""
        echo "========================"
     exit 1;
    fi

    echo ""
    echo "Building of Docker image ${MODULE_NAME} successful"
    echo ""
    echo "========================"
}

buildDocker
