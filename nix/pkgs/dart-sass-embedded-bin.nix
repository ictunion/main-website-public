{ pkgs ? import <nixpkgs> { }
, sha256 ? "sha256-BFbwtMygqaoeHWe+7a5eFnKpT8ktUjhrrktQckUFaTY="
, version ? "1.58.1" }:

with pkgs;
self.stdenv.mkDerivation rec {
    name = "dart-sass-embedded-${version}";
    inherit version;
    system = "x86_64-linux";

    isExecutable = true;

    src = fetchurl {
        inherit sha256;
        url = builtins.concatStringsSep "/" [
            "https://github.com"
            "sass/dart-sass-embedded/releases/download"
            "${version}/sass_embedded-${version}-linux-x64.tar.gz"
        ];
    };

    dontBuild = true;

    fixupPhase = ''
        patchelf \
            --set-interpreter ${binutils.dynamicLinker} \
            $out/src/dart
    '';

    installPhase = ''
        mkdir -p $out/bin
        cp -r . $out
        ln -s $out/dart-sass-embedded $out/bin/dart-sass-embedded
    '';
}
