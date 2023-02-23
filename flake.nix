{
  description = "ITC Union official website";
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs;
    flake-utils.url = github:numtide/flake-utils;
    nix-dart.url = github:tadfisher/nix-dart;
  };

  outputs = { self, nixpkgs, flake-utils, nix-dart }: flake-utils.lib.eachDefaultSystem (system:
    let
      overlay = import ./nix/overlay;
      pkgs = import nixpkgs {
        inherit system;
        overlays = [ nix-dart.overlay overlay ];
      };
      tex = pkgs.texlive.combine {
        inherit (pkgs.texlive) scheme-full;
      };
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
          name = "itc-union-website";
          inherit buildInputs;
          shellHook = ''
            OSFONTDIR=${pkgs.ibm-plex}/share/fonts/opentype bash latex/print-all

            ln -sf ${nodeDependencies}/lib/node_modules .
          '';
        };
      defaultPackage = with pkgs;
        stdenv.mkDerivation {
          name = "itc-union-website";
          src = self;
          inherit buildInputs;
          buildPhase = ''
            OSFONTDIR=${pkgs.ibm-plex}/share/fonts/opentype bash latex/print-all

            ln -s ${nodeDependencies}/lib/node_modules .
            ${hugo}/bin/hugo
          '';
          installPhase = ''
            mkdir $out
            mv public $out
          '';
        };
  });
}
