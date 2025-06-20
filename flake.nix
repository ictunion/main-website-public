{
  description = "ICT Union official website";
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
      tex = pkgs.callPackage ./latex {};

      buildInputs = with pkgs; [
        hugo
        dart-sass
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
            rm -rf node_modules
            ln -sf ${nodeDependencies}/lib/node_modules .
          '';
          OSFONTDIR = "${pkgs.ibm-plex}/share/fonts/opentype";
        };
      defaultPackage = pkgs.callPackage ./. { inherit tex; };
  });
}
