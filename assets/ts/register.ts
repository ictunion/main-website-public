import { XSign } from './XSign';
import RegistrationForm from './RegistrationForm';
import { Datepicker } from 'vanillajs-datepicker';
import datepickerCs from './vaniall-datepicker.cs';

Object.assign(Datepicker.locales, datepickerCs);
customElements.define("x-sign", XSign);

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
