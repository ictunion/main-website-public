{ stdenv
, hugo
, dart-sass
, pandoc
, ibm-plex
, tex
, nodeDependencies
, nix-gitignore
, writeScriptBin
, lib
, makeWrapper
}:
let
  build-script = writeScriptBin "ict-union-website" ''
    echo "Linking node_modules"
    ln -sf ${nodeDependencies}/lib/node_modules .

    echo "Building PDFs"
    OSFONTDIR=${ibm-plex}/share/fonts/opentype bash latex/print-all

    echo "Starting HUGO"
    hugo $@
  '';

in stdenv.mkDerivation rec {
  name = "ict-union-website";
  version = "0.1.0";
  src = nix-gitignore.gitignoreSource [ ".github/CODEOWNERS" ] ./.;
  nativeBuildInputs = [ makeWrapper ];
  buildInputs = [ hugo dart-sass pandoc ibm-plex tex ];
  doCheck = true;

  buildPhase = ''
    ${build-script}/bin/ict-union-website
  '';

  checkPhase = ''
    node_modules/.bin/tsc -p assets/tsconfig.json
    node_modules/.bin/jest --config assets/jest.config.js
  '';

  installPhase = ''
    mkdir -p $out/var/www
    mv public/* $out/var/www

    # Create build-web script
    mkdir -p $out/bin
    cp ${build-script}/bin/ict-union-website $out/bin
    wrapProgram $out/bin/ict-union-website \
        --prefix PATH : ${lib.makeBinPath buildInputs}
  '';
}
