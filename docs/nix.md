# Nix

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

## Within the shell

__to run hugo development server__:

```
hugo server --buildDrafts --watch --verbose
```

open [http://localhost:1313](http://localhost:1313)

