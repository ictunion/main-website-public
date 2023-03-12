{ stdenv
, hugo
, dart-sass-embedded-bin
, pandoc
, ibm-plex
, tex
, nodeDependencies
, nix-gitignore
, gnutar
}:
stdenv.mkDerivation {
  name = "ict-union-website";
  version = "0.1.0";
  src = nix-gitignore.gitignoreSource [] ./.;
  buildInputs = [ hugo dart-sass-embedded-bin pandoc ibm-plex tex gnutar ];
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

    # Note that .git is not included in build source
    tar -czvf source.tar.gz -C $src .
    mv source.tar.gz $out/var/www/downloads/
  '';
}
