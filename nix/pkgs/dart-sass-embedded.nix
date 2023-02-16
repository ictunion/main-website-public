{ lib, stdenv, fetchFromGitHub, buildDartPackage }:

buildDartPackage rec {
  pname = "dart-sass-embedded";
  version = "1.58.1";

  src = fetchFromGitHub {
    owner = "sass";
    repo = pname;
    rev = version;
    sha256 = "sha256-h41IsApzhy5r61DTXUxHrhs/MqY03w/5V5JdukCWYvc=";
  };

  specFile = "${src}/pubspec.yaml";
  lockFile = ./pub2nix.lock;
}
