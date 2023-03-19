{ nixpkgs ? <nixpkgs>
, config ? {
  overlays = [ (import ./nix/overlay) ];
}
}:
let
  pkgs = import nixpkgs config;
  tex = pkgs.callPackage ./latex {};
in
pkgs.callPackage ./default.nix { inherit tex; }
