#!/usr/bin/env bash
# Prisma · so del sistema (Linux amb PipeWire)
#
# Chrome no mostra els «monitors» de la sortida de so com a entrades. Aquest guió crea una
# entrada virtual, «Prisma · so del sistema», que copia el que sona per la sortida predeterminada
# (també si canvies d'altaveus a auriculars). Prisma la troba sola amb el botó «So del sistema».
#
# Ús:  ./So-del-sistema.sh            activa-la ara i a cada inici de sessió
#      ./So-del-sistema.sh desactiva  treu-la del tot
#      ./So-del-sistema.sh estat      mostra si està activa
#
# És un servei d'usuari (no cal ser administrador) a ~/.config/systemd/user/.
set -euo pipefail

UNIT=prisma-so-sistema.service
DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
NODE=prisma_so_sistema

estat() {
  if pactl list sources short 2>/dev/null | grep -q "$NODE"; then
    echo "✔ Activa: l'entrada «Prisma · so del sistema» existeix. Obre Prisma i prem «So del sistema»."
  else
    echo "✘ No hi ha l'entrada «Prisma · so del sistema»."
    return 1
  fi
}

case "${1:-activa}" in
  activa)
    command -v pw-loopback >/dev/null || { echo "Cal PipeWire (no trobo pw-loopback)."; exit 1; }
    mkdir -p "$DIR"
    cat > "$DIR/$UNIT" <<EOF
[Unit]
Description=Prisma · so del sistema (còpia de la sortida de so com a entrada)
After=pipewire.service pipewire-pulse.service wireplumber.service
Requires=pipewire.service

[Service]
ExecStart=$(command -v pw-loopback) --name prisma-so-sistema --capture-props="stream.capture.sink=true node.passive=true node.name=${NODE}_captura node.description=\"Prisma (captura)\"" --playback-props="media.class=Audio/Source node.name=${NODE} node.description=\"Prisma · so del sistema\" audio.position=[FL FR] priority.session=1"
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF
    systemctl --user daemon-reload
    systemctl --user enable --now "$UNIT" >/dev/null
    for _ in 1 2 3 4 5 6; do pactl list sources short 2>/dev/null | grep -q "$NODE" && break; sleep 0.5; done
    estat
    ;;
  desactiva)
    systemctl --user disable --now "$UNIT" 2>/dev/null || true
    rm -f "$DIR/$UNIT"
    systemctl --user daemon-reload
    echo "Entrada «Prisma · so del sistema» eliminada."
    ;;
  estat) estat ;;
  *) echo "Ús: $0 [activa|desactiva|estat]"; exit 2 ;;
esac
