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
      buildInputs = with pkgs; [
        hugo
        dart-sass-embedded-bin
        pandoc
        texlive.combined.scheme-small
      ];
      buildPdfs = pkgs.writeScriptBin "generate-pdfs" ''
        mkdir -p static/downloads
        pandoc --pdf-engine=xelatex content/statutes/index.cs.md -V block-headings -o static/downloads/ictunion-statutes-cs.pdf
        pandoc --pdf-engine=xelatex content/statutes/index.en.md -V block-headings -o static/downloads/ictunion-statutes-en.pdf
      '';
    in
    {
      devShell = with pkgs;
        mkShell {
          name = "itc-union-website";
          inherit buildInputs;
          shellHook = ''
            ${buildPdfs}/bin/generate-pdfs
            ln -sf ${nodeDependencies}/lib/node_modules .
          '';
        };
      defaultPackage = with pkgs;
        stdenv.mkDerivation {
          name = "itc-union-website";
          src = self;
          inherit buildInputs;
          buildPhase = ''
            ${buildPdfs}/bin/generate-pdfs

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
