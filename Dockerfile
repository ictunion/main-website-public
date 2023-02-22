from nixos/nix

RUN nix-env -iA nixpkgs.gnused

RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf && \
  sed -i 's/false/true/g' /etc/nix/nix.conf

ADD . /app
WORKDIR /app
RUN nix build
