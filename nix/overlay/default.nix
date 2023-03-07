final: prev:
{
  dart-sass-embedded-bin = final.callPackage ../pkgs/dart-sass-embedded-bin.nix {};
  nodeDependencies = with final;
    let
      nodejs = nodejs-16_x;
      node-files = lib.sourceByRegex ../.. [ "^(package(-lock)?.json)$" ];
      generated-nixfiles = stdenv.mkDerivation {
        name = "ictunion-generated-nix-file-node";
        src = node-files;
        dontBuild = true;
        installPhase = ''
          mkdir $out
          ln -s $src/package.json $out/package.json
          ln -s $src/package-lock.json $out/package-lock.json
          ${nodePackages.node2nix}/bin/node2nix -d -l package-lock.json -e $out/node-env.nix -c /dev/null -o $out/node-packages-dev.nix
          # in place patch the path generated by node2nix
          # since we link package.json and package-lock.json to $out this is valid src for expressions
          substituteInPlace "$out/node-packages-dev.nix" --replace "../../../build/source" "./."
        '';
      };
      nodeEnv =
        callPackage (import "${generated-nixfiles}/node-env.nix") {
          libtool = if stdenv.isDarwin then darwin.cctools else null;
          inherit nodejs;
        };

      node2nix-result =
        callPackage (import "${generated-nixfiles}/node-packages-dev.nix") { inherit nodeEnv; };
    in
      node2nix-result.nodeDependencies;
}
