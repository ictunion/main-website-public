{
  description = "ITC Union official website";
  inputs = {
    nixpkgs.url = github:NixOS/nixpkgs;
    flake-utils.url = github:numtide/flake-utils;
  };

  outputs = { self, nixpkgs, flake-utils }: flake-utils.lib.eachDefaultSystem (system:
    let
      pkgs = import nixpkgs { inherit system; };
    in
    {
      devShell = with pkgs;
        mkShell {
          name = "itc-union-website";
          buildInputs = [ hugo ];
        };
      defaultPackage = with pkgs;
        stdenv.mkDerivation {
          name = "itc-union-website";
          src = self;
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
