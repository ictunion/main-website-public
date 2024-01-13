# see https://hub.docker.com/_/microsoft-devcontainers?tab=description
ARG VARIANT="16-bullseye"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

ENV HUGO_VERSION="0.121.2"
ENV DART_SASS_VERSION="1.69.0"

# Install Hugo
RUN curl -L https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_${HUGO_VERSION}_Linux-64bit.tar.gz -o /tmp/hugo.tar.gz && \
    tar xf /tmp/hugo.tar.gz -C /usr/local/bin/ && \
    rm -f /tmp/hugo.tar.gz

# Install Dart-Sass-Embedded
RUN curl -L https://github.com/sass/dart-sass/releases/download/${DART_SASS_VERSION}/dart-sass-${DART_SASS_VERSION}-linux-x64.tar.gz -o /tmp/dart-sass.tar.gz && \
    tar -xf /tmp/dart-sass.tar.gz && \
    mv dart-sass/* /usr/local/bin/ && \
    rm -rf /tmp/dart-sass.tar.gz /tmp/sass-sass
