#!/usr/bin/env bash


ACTION=$1

function buildDocker {

    case $ACTION in
    ui)
        buildWebpackProject cdc-campaign-ui
        ;;
    importer)
        buildProject cdc-import-file
        ;;
    mcfmmirror)
        buildProject cdc-mcfm-mirror
        ;;
    admin)
        buildProject cdc-campaign-admin
        ;;
    exporter)
        buildProject cdc-exporter
        ;;
    optivo)
        buildProject cdc-optivo-mock
        ;;
    custcache)
        buildProject cdc-customercache-mock
        ;;
    all)
        buildWebpackProject cdc-campaign-ui
        buildAllDockerImages
        ;;
    *)
        echo "No valid action given (ui, importer, mcfmmirror, admin, exporter, optivo, custcache or all)"
        exit 1
    esac
}

function buildAllDockerImages {
    ALL_MODULE_NAMES=$(ls ../.. | grep "cdc" | grep -v 'cdc-composition-release' | grep -v 'cdc-documentation' | grep -v 'cdc-campaign-ui' | grep -v 'cdc-commons' | grep -v 'log4j2-graylog-layout' | grep -v 'collector-data-pipeline-vi8n')

    WORKSPACE=$(pwd)

    for MODULE_NAME in $ALL_MODULE_NAMES
    do
        if ! buildProject $MODULE_NAME
        then
            echo ""
            echo "Some error in building the modules - stopping loop."
            echo ""
            echo "========================"
            exit 1;
        else
            cd $WORKSPACE
        fi
    done
}

function buildWebpackProject {
    MODULE_NAME=$1
    WORKSPACE=$(pwd)

    if ! cd ../../$MODULE_NAME/frontend
    then
        echo "Seems like there is no frontend for ${MODULE_NAME}, skipping frontend build"
    else
        npm install
        npm run build
        echo "Built Webpack Project from ${MODULE_NAME}"
        cd $WORKSPACE
    fi
}

function buildMavenProject {
    MODULE_NAME=$1
    WORKSPACE=$(pwd)

    echo "========================"
    echo ""
    echo "Building Maven project ${MODULE_NAME}"
    echo ""
    echo "========================"

    if ! cd ../../$MODULE_NAME
    then
        echo "Failed to go to module directory in ${MODULE_NAME}, please make sure the path and files are valid."
        exit 1;
    fi

    if ! mvn clean install
    then
        echo ""
        echo "Building of module ${MODULE_NAME} failed"
        echo ""
        echo "========================"
     exit 1;
    fi

    echo ""
    echo "Building of module ${MODULE_NAME} successful"
    echo ""
    echo "========================"

    cd $WORKSPACE
}

function buildProject {
    buildWebpackProject $1
    buildMavenProject $1
}

buildDocker
