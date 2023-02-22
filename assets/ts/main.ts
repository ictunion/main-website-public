import * as L from 'leaflet';
import { XSign } from './XSign';
import RegistrationForm from './RegistrationForm';
import { Datepicker } from 'vanillajs-datepicker';
import datepickerCs from './vaniall-datepicker.cs';

Object.assign(Datepicker.locales, datepickerCs);

function switchLanguage(url: string): void {
    location.href = url;
}

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

customElements.define("x-sign", XSign);

// registration
const form = (document.getElementById('register-member-form') as HTMLFormElement);
const qrContainer = document.getElementById('registration-qr-container');

if (form) {
    const registrationForm: RegistrationForm = new RegistrationForm(form, { qrContainer });
    registrationForm.fromLocation(window.location);
}

const datapickerElements = document.querySelectorAll('[data-widget="datepicker"]');
datapickerElements.forEach((element: HTMLElement) => {
    const language = document.documentElement.lang;
    new Datepicker(element, {
        language
    });
});

// export to global namespace.
window['switchLanguage'] = switchLanguage;
window['initMap'] = initMap;
