# see https://hub.docker.com/_/microsoft-devcontainers?tab=description
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV HUGO_VERSION="0.117.0"
ENV DART_SASS_VERSION="1.62.1"

# Install Hugo
RUN curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -o /tmp/hugo.tar.gz && \
    tar xf /tmp/hugo.tar.gz -C /usr/local/bin/ && \
    rm -f /tmp/hugo.tar.gz

# Install Dart-Sass-Embedded
RUN curl -L https://github.com/sass/dart-sass-embedded/releases/download/${DART_SASS_VERSION}/sass_embedded-${DART_SASS_VERSION}-linux-x64.tar.gz -o /tmp/dart-sass-embedded.tar.gz && \
    tar -xf /tmp/dart-sass-embedded.tar.gz && \
    mv sass_embedded/* /usr/local/bin/ && \
    rm -rf /tmp/dart-sass-embedded.tar.gz /tmp/sass_embedded
