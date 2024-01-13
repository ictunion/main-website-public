{ stdenv
, hugo
, dart-sass
, pandoc
, ibm-plex
, tex
, nodeDependencies
, nix-gitignore
}:
stdenv.mkDerivation {
  name = "ict-union-website";
  version = "0.1.0";
  src = nix-gitignore.gitignoreSource [ ".github/CODEOWNERS" ] ./.;
  buildInputs = [ hugo dart-sass pandoc ibm-plex tex ];
  doCheck = true;

  patchPhase = ''
    ln -s ${nodeDependencies}/lib/node_modules .
  '';

  buildPhase = ''
    OSFONTDIR=${ibm-plex}/share/fonts/opentype bash latex/print-all

    ${hugo}/bin/hugo
  '';

  checkPhase = ''
    node_modules/.bin/tsc -p assets/tsconfig.json
    node_modules/.bin/jest --config assets/jest.config.js
  '';

  installPhase = ''
    mkdir -p $out/var/www
    mv public/* $out/var/www
  '';
}
