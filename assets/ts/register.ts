import { XSign } from './XSign';
import RegistrationForm from './RegistrationForm';
import { Datepicker } from 'vanillajs-datepicker';
import datepickerCs from './vaniall-datepicker.cs';

// Register signatire component
customElements.define("x-sign", XSign);

// Configure date-picker widget
Object.assign(Datepicker.locales, datepickerCs);
const datapickerElements = document.querySelectorAll('[data-widget="datepicker"]');
datapickerElements.forEach((element: HTMLElement) => {
    const language = document.documentElement.lang;
    new Datepicker(element, {
        language
    });
});

// Initilize form logic
function postalCodeFormat(input: HTMLInputElement) {
    const value: string = input.value.replace(' ', '');
    const firstPart = value.substring(0, 3);
    const secondPart = value.substring(3);

    input.value = `${firstPart} ${secondPart}`;
}

function phoneNumberFormat(input: HTMLInputElement) {
    let value = input.value.replaceAll(' ', '');
    if (value.length === 9) {
        value = `+420${value}`;
    }

    const firstPart = value.substring(0, 4);
    const secondPart = value.substring(4, 7);
    const thirdPart = value.substring(7, 10);
    const forthPart = value.substring(10);

    input.value = `${firstPart} ${secondPart} ${thirdPart} ${forthPart}`;
}

const form = (document.getElementById('register-member-form') as HTMLFormElement);
const qrContainer = document.getElementById('registration-qr-container');

if (form) {
    const registrationForm: RegistrationForm = new RegistrationForm(form, {
        qrContainer,
        formatters: {
            postal_code: postalCodeFormat,
            phone_number: phoneNumberFormat
        }
    });
    registrationForm.fromLocation(window.location);
}
