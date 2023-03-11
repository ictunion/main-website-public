import * as L from 'leaflet';

export class XMap extends HTMLElement {
    map: L.Map;
    marker: L.Marker;

    connectedCallback() {
        const lat = Number(this.getAttribute('lat'));
        const lng = Number(this.getAttribute('lng'));
        const title = this.getAttribute('title');
        const text = this.getAttribute('text');

        this.map = new L.Map(this)
            .setView([lat, lng], 13);

        // Configure tiles from OpenStreetMap
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(this.map);

        // Add marker
        const icon: L.Icon = L.icon({
            iconUrl: '/images/marker-icon.png',
            shadowUrl: '/images/marker-shadow.png',
            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor:	[12, 40],
            shadowAnchor: [12, 40],
            popupAnchor:  [1, -40]
        });

        this.marker = L.marker(
            [lat, lng],
            { icon }
        ).addTo(this.map);

        this.marker
            .bindPopup(`<h6 class='map-marker-title'>${title}</h6>${text}`)
            .openPopup();
    }
}
