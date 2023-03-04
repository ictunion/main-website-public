### Dependecies

This project defines reproducible environment using [nix](https://nixos.org/).
Skip to [Nix](#nix) section if you want to use it.

- [git](https://git-scm.com/) distributed version control system
- [hugo](https://gohugo.io/) static site generator
- [dart-sass-embedded](https://github.com/sass/dart-sass-embedded) embeddable sass compiler
- [nodejs with npm](https://nodejs.org/) JavaScript runtime and package manager

### Setup

Preferred method of working with this repository is to have local git clone:

```
# GIT+SSH clone
git clone git@github.com:ictunion/main-website.git

# GIT+HTTPS clone
git clonehttps://github.com/ictunion/main-website.git
```

### Run locally

Install npm dependecies:

```
npm install
```

Hugo provides build in HTTP server:

```
hugo server --buildDrafts --watch --verbose
```

open [http://localhost:1313](http://localhost:1313)
