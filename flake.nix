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
    in
    {
      devShell = with pkgs;
        mkShell {
          name = "itc-union-website";
          buildInputs = [ hugo dart-sass-embedded-bin ];
        };
      defaultPackage = with pkgs;
        stdenv.mkDerivation {
          name = "itc-union-website";
          src = self;
          buildInputs = [ dart-sass-embedded-bin ];
          buildPhase = ''
            ${hugo}/bin/hugo
          '';
          installPhase = ''
            mkdir $out
            mv public $out
          '';
        };
  });
}
