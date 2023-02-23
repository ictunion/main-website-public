import * as L from 'leaflet';

interface MapConfig {
    elementId: string,
    lat: number,
    lng: number,
    title: string,
    text: string,
}

function initMap(config: MapConfig): void {
    // initialize map
    const map: L.Map = new L.Map(config.elementId)
        .setView([config.lat, config.lng], 13);

    // configure tiles from openstreetmap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // add marker
    const icon: L.Icon = L.icon({
        iconUrl: '/images/marker-icon.png',
        shadowUrl: '/images/marker-shadow.png',
    });
    const marker: L.Marker = L.marker(
        [config.lat, config.lng],
        { icon }
    ).addTo(map);

    marker
        .bindPopup(`<h6 class='map-marker-title'>${config.title}</h6>${config.text}`)
        .openPopup();
}

window['initMap'] = initMap;
