{
  description = "ITC Union official website";
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      overlay = import ./nix/overlay;
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ overlay ];
      };
      tex = pkgs.callPackage ./tex.nix {};
      buildInputs = with pkgs; [
        hugo
        dart-sass-embedded-bin
        pandoc
        ibm-plex
        tex
      ];
    in
    {
      devShell = with pkgs;
        mkShell {
          name = "ict-union-website-dev";
          inherit buildInputs;
          shellHook = ''
            OSFONTDIR=${pkgs.ibm-plex}/share/fonts/opentype bash latex/print-all

            rm -rf node_modules
            ln -sf ${nodeDependencies}/lib/node_modules .
          '';
        };
      defaultPackage = pkgs.callPackage ./. { inherit tex; };
  });
}
