# Main Website

Source of the public union website. More info TBA.

## Developing

Website is composed from template and content written as a markdown files.
We use static site generator to which takes imput content and templates
and produces html files that can be served by static HTTP server which forms
the publically available website.

### Dependecies

This project defines  reproducible evironment using [nix](https://nixos.org/).
Skip to [Nix](#nix) section if you want to use it.

- [hugo](https://gohugo.io/) side generator
- [git](https://git-scm.com/)

### Setup

This project is (probably temporarily) using submodules so requires recursive clone:

```
# GIT+SSH clone
git clone --recursive git@github.com:ictunion/main-website.git

# GIT+HTTPS clone
git clone --recursive https://github.com/ictunion/main-website.git
```

To update (pull) whole repository including submodules run:

```
git submodule update --init
```


### Run locally

Hugo provides build in http server:

```
hugo server
```

open [http://localhost:]

### Nix

We define [flake.nix](https://nixos.wiki/wiki/Flakes) so don't forget to make sure that you have support for flakes enabled in your config.

To enter the development shell use:

```
nix develop
```

This will jump into shell environment where with all the necessary dependecies like hugo available
on a pined version that were previously tested.
