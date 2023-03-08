import { XSign } from './XSign';
import RegistrationForm from './RegistrationForm';
import { Datepicker } from 'vanillajs-datepicker';
import datepickerCs from './vaniall-datepicker.cs';

// Register signatire component
customElements.define("x-sign", XSign);

// Configure date-picker widget
Object.assign(Datepicker.locales, datepickerCs);
const datapickerElements = document.querySelectorAll('[data-widget="datepicker"]');
const datePickers: { [key: string]: Datepicker } = {};
datapickerElements.forEach((element: HTMLInputElement) => {
    const language = document.documentElement.lang;
    const instance = new Datepicker(element, {
        language
    });
    datePickers[element.name] = instance;
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

    // ad-hoc for code (for now)
    // TODO: something from this could potentially be factored out into the class?

    const submitBtn: HTMLButtonElement = form.querySelector('button[type="submit"]');
    const checkbox = (document.getElementById('register-accept-statutes') as HTMLInputElement);

    checkbox.addEventListener('input', (event) => {
        const checked: boolean = (event.target as HTMLInputElement).checked;
        submitBtn.disabled = !checked;
    });

    const signatureElement: XSign = form.querySelector('x-sign[name="signature"]');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const values: { [key: string]: string } = Object.values(form).reduce((obj: { [key: string]: any }, field: { name: string, value: string }) => {
            if (field.name === "") {
                return obj;
            } else if (datePickers[field.name]) {
                obj[field.name] = datePickers[field.name].getDate('yyyy-mm-dd');
                return obj;
            } else {
                obj[field.name] = field.value;
                return obj;
            }
        }, {});

        values.signature = signatureElement.value || null;
        values.local = document.documentElement.lang;

        fetch("/api/registration/join", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
            .then(result => {
                if (!result.ok) throw result;
                return result.text();
            })
            .then((_) => {
                // TODO: success
                alert('Sucess!');
            }).catch((err) => {
                // TODO: error
                console.error(err);
                alert('There was an error - see console');
            });
    });
}
