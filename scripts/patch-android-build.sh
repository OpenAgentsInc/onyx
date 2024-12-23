#!/bin/bash

echo "Patching android/build.gradle..."

sed -i -E "/subprojects {/a \
    afterEvaluate { project -> \
        if (project.hasProperty(\\\"android\\\")) { \
            project.android { \
                configurations.all { \
                    resolutionStrategy { \
                        // Force old support libraries to AndroidX \
                        force \\\"androidx.appcompat:appcompat:1.6.1\\\" \
                    } \
                } \
            } \
        } \
    }" android/build.gradle

echo "Patch complete."