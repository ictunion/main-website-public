# Main Website

![https://github.com/ictunion/main-website/actions/workflows/build.yaml/badge.svg?branch=main&event=push](https://github.com/ictunion/main-website/actions/workflows/build.yaml)

Source of the public union website. More info TBA.

## Developing

Website is composed from template and content written as a markdown files.
We use static site generator to which takes imput content and templates
and produces html files that can be served by static HTTP server which forms
the publically available website.

### Dependecies

This project defines  reproducible evironment using [nix](https://nixos.org/).
Skip to [Nix](#nix) section if you want to use it.

- [git](https://git-scm.com/)
- [hugo](https://gohugo.io/) side generator
- [dart-sass-embedded](https://github.com/sass/dart-sass-embedded)

### Setup

Preferred method of working with this repository is to have local git clone:

```
# GIT+SSH clone
git clone git@github.com:ictunion/main-website.git

# GIT+HTTPS clone
git clonehttps://github.com/ictunion/main-website.git
```


### Run locally

Hugo provides build in http server:

```
hugo server --watch
```

open [http://localhost:1313](http://localhost:1313)

### Nix

We define [flake.nix](https://nixos.wiki/wiki/Flakes) so don't forget to make sure that you have support for flakes enabled in your config.

To enter the development shell use:

```
nix develop
```

This will jump into shell environment where with all the necessary dependecies like hugo available
on a pined version that were previously tested.

To build html files using nix:

```
nix build
```
