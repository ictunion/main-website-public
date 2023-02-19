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
      buildInputs = with pkgs; [ hugo dart-sass-embedded-bin ];
    in
    {
      devShell = with pkgs;
        mkShell {
          name = "itc-union-website";
          inherit buildInputs;
          shellHook = ''
            ln -s ${nodeDependencies}/lib/node_modules node_modules
          '';
        };
      defaultPackage = with pkgs;
        stdenv.mkDerivation {
          name = "itc-union-website";
          src = self;
          inherit buildInputs;
          buildPhase = ''
            ln -s ${nodeDependencies}/lib/node_modules node_modules
            ${hugo}/bin/hugo
          '';
          installPhase = ''
            mkdir $out
            mv public $out
          '';
        };
  });
}
