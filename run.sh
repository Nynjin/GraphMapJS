#!/bin/bash

# Set project directory
project_directory=$(dirname $(realpath "$0"))
project_name=$(basename "$project_directory")

# Source environment variables if present
if [ -f "$project_directory/.env" ]; then
    source "$project_directory/.env"
fi

# Set default values
MODE="${MODE:-"dev"}"
ENVIRONMENT="${ENVIRONMENT:-"production"}"

# Function to display usage
display_usage() {
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --mode/-m=<mode>            Mode to run the application in [start/s (default), dev/d, build/b, test/t]"
    echo "                              Start mode runs the application, test mode runs the tests"
    echo ""
    echo "  --environment/-e=<env>      Environment to run the application in [production/p (default), staging/s]"
    echo ""
    echo "  --port/-p=<port>            Port to run the application on [default: 8000]"
    echo ""
    echo "  --fresh/-f                  Rebuilds the entire image"
    echo ""
    echo "  --help/-h                   Display this help message"
    echo ""
    echo "Default values:"
    echo "  Mode:       build"
    echo "  Environment: production"
    echo "  Port:       8000"
    echo "  Fresh:      false"
    echo ""
    echo "Example:"
    echo "  $0 --mode=build --environment=production --port=8000 --fresh"
    echo "  $0 -m=build -e=p -p=8000 -f"
    echo ""
    echo "Overrides:"
    echo "  The environment variables will override the default values."
    echo ""
}

# Function to delete docker container
delete_container() {
    service_name="graph-map"
    container_name="$(echo "${project_name}-${service_name}" | tr '[:upper:]' '[:lower:]')"
    
    # Handle deletion of replicas
    containers=$(docker ps -a --filter "name=$container_name" --format "{{.ID}}")
    for container in $containers; do
        if [ -n $container ]; then
            # Stop running containers
            if [ "$(docker ps -q -f name=$container)" ]; then
                docker container stop --force "$container"
            fi
            docker container rm --force "$container"
        fi
    done

    # Delete image
    image=$(docker images --filter=reference="$container_name" --format "{{.ID}}")
    if [ -n $image ]; then
        docker image rm --force "$image"
    fi
}

# Parse options
while [[ $# -gt 0 ]]; do
    option=$1
    case "$option" in
        --mode=* | -m=*)
            MODE="${option#*=}"
            ;;
        --environment=* | -e=*)
            ENVIRONMENT="${option#*=}"
            ;;
        --port=* | -p=*)
            export PORT="${option#*=}"
            ;;
        --fresh | -f)
            FRESH=true
            ;;
        --help | -h)
            display_usage
            exit 0
            ;;
        *)
            echo "Error: Invalid option given : $OPTION"
            display_usage
            exit 1
            ;;
    esac
    shift
done

# Validate and export options
MODE=$(echo "$MODE" | tr '[:upper:]' '[:lower:]')
case "$MODE" in
    start | s)
        export MODE=start
        ;;
    dev | d)
        export MODE=dev
        ;;
    build | b)
        export MODE=build
        ;;
    test | t)
        export MODE=test
        ;;
    *)
        echo "Error: Invalid mode given : $MODE"
        display_usage
        exit 1
        ;;
esac

ENVIRONMENT=$(echo "$ENVIRONMENT" | tr '[:upper:]' '[:lower:]')
case "$ENVIRONMENT" in
    production | p)
        ENVIRONMENT=PRODUCTION
        ;;
    staging | d)
        ENVIRONMENT=STAGING
        ;;
    *)
        echo "Error: Invalid environment given : $ENVIRONMENT"
        display_usage
        exit 1
        ;;
esac

if [ "$FRESH" = true ]; then
    export FRESH=true
    delete_container
fi

# Define and export SSH_AUTH_SOCK
eval "$(ssh-agent -s)"
eval SSH_PATH=$SSH_PATH
ssh-add "$SSH_PATH"

# Build docker image if not already present
existing_image=$(docker images --filter=reference="$container_name")
if [ ! -n "$existing_image" ]; then
    docker compose -f "$project_directory/compose.$ENVIRONMENT.yml" build
fi

# Bring up docker containers
docker compose -f "$project_directory/compose.$ENVIRONMENT.yml" up --remove-orphans
