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

function postalCodeFormat(input: HTMLInputElement) {
    input.addEventListener('blur', () => {
        const value: string = input.value.replace(' ', '');
        const firstPart = value.substring(0, 3);
        const secondPart = value.substring(3);

        input.value = `${firstPart} ${secondPart}`;
    });

    input.addEventListener('focus', () => {
        input.value = input.value.replace(' ', '');
    });
}

function phoneNumberFormat(input: HTMLInputElement) {
    input.addEventListener('blur', () => {
        let value = input.value.replaceAll(' ', '');
        if (value.length === 9) {
            value = `+420${value}`;
        }

        const firstPart = value.substring(0, 4);
        const secondPart = value.substring(4, 7);
        const thirdPart = value.substring(7, 10);
        const forthPart = value.substring(10);

        input.value = `${firstPart} ${secondPart} ${thirdPart} ${forthPart}`;
    });

    input.addEventListener('focus', () => {
        input.value = input.value.replaceAll(' ', '');
    });
}

if (form) {
    const registrationForm: RegistrationForm = new RegistrationForm(form, { qrContainer });
    registrationForm.fromLocation(window.location);

    form.querySelectorAll('input').forEach((input: HTMLInputElement) => {
        const formatter = input.getAttribute('data-formatter');
        if (formatter) {
            switch (formatter) {
                case 'postal_code':
                    postalCodeFormat(input);
                    break;
                case 'phone_number':
                    phoneNumberFormat(input);
                    break;
            }
        }
    });
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
