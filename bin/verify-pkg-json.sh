#!/bin/sh
set -e

PACKAGES_DIR="./packages/";


for D in $PACKAGES_DIR*; do
    if [ -d "${D}" ]; then
        if ! [ -e ${D}/package.json ]; then
            ECHO "⚠️ "${D##*/}" component is missing a package.json file. Let's create it!"
            if [ "$IF_DEPENDENCIES" == "y" ]; then
                echo "OK then, let's enter dependencies."
                npm init [-f|--force|-y|--yes]
            fi
        fi
    fi
done