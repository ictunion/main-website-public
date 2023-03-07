{ stdenv
, hugo
, dart-sass-embedded-bin
, pandoc
, ibm-plex
, tex
, nodeDependencies
, nix-gitignore
}:
stdenv.mkDerivation {
  name = "ict-union-website";
  version = "0.1.0";
  src = nix-gitignore.gitignoreSource [] ./.;
  buildInputs = [ hugo dart-sass-embedded-bin pandoc ibm-plex tex ];
  buildPhase = ''
    OSFONTDIR=${ibm-plex}/share/fonts/opentype bash latex/print-all

    ln -s ${nodeDependencies}/lib/node_modules .
    ${hugo}/bin/hugo
  '';
  installPhase = ''
    mkdir -p $out/var/www
    mv public/* $out/var/www
  '';
}
