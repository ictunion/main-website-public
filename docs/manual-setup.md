# Manual Setup

This document describes how to setup `main-website` for local development.

## Install dependencies

Before starting development, please make sure you have installed all the dependencies.
There are 4 mains dependencies needed for `main-website` project:

- [git](https://git-scm.com/) distributed version control system - to clone/download the code
- [hugo](https://gohugo.io/) static site generator - to convert source files (markdown) into the final output (HTML+CSS+JS etc.)
- [dart-sass](https://github.com/sass/dart-sass) embeddable sass compiler - needed by Hugo to convert .scss files into CSS
- [nodejs with npm](https://nodejs.org/) JavaScript runtime and package manager - handles the creation of .js files

### MacOS
If you use brew, you can run:
```
brew install git
brew install hugo
brew install sass/sass/sass
brew install node
```

### Windows
If you use Chocolatey, you can run:
```
choco install git
choco install hugo
choco install sass
choco install nodejs
```

### Linux
Git: probably already installed
Hugo: https://gohugo.io/installation/linux/#repository-packages
Sass: https://sass-lang.com/install/
NodeJS: https://nodejs.org/en/download/package-manager/all

## Serve Website Locally

1. Get the repository by git cloning it:

```
# GIT+SSH clone
git clone git@github.com:ictunion/main-website.git

# GIT+HTTPS clone
git clone https://github.com/ictunion/main-website.git
```

Once the repository is cloned, open the directory:

```
cd main-website
```

2. Install npm dependencies:

```
npm install
```

3. Run the local development server

Hugo provides built-in HTTP server:

```
hugo server --buildDrafts --watch --logLevel info
```

4. Open [http://localhost:1313](http://localhost:1313)
