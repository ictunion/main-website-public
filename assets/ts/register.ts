import { XSign } from './web-component/XSign';
import RegistrationForm, { Formatter } from './register/RegistrationForm';
import { ValidationError, ApiError, localize, Localizations } from './register/validations';
import datepickerCs from './register/vaniall-datepicker.cs';
import enVlidations from './register/validations.en';
import csVlidations from './register/validations.cs';

// Register signature component
// under the HTML tag `<x-sign>`
customElements.define("x-sign", XSign);

// Initialize validation logic
// these are used to validation error codes to human readable string
const locales: Localizations = localize(enVlidations)
    .add(csVlidations)
    .setLang(document.documentElement.lang);

/*  -----------------------------------------------------------------------------------
    Implement business logic functions
*/

/**
 * Given an __input__ element remove validation errors of the input if some exist.
 * Does nothing in case there are no errors for given input
 */
function removeError(input: HTMLElement) {
    input.classList.remove('error');
    const container = (input.parentNode.parentNode as HTMLElement);
    container.classList.remove('error');
    container.querySelectorAll('.error-message').forEach((node: HTMLElement) => {
        node.remove();
    });
}

/**
 * Register event listeners for automatically cleaning validation errors
 * after user changes value in input with error
 */
function registerErrorCleaners(registrationForm: RegistrationForm) {
    registrationForm.form.querySelectorAll('input,x-sign').forEach((input: HTMLElement) => {
        input.addEventListener('input', () => {
            removeError(input);
        }, false);
    });

    for (const name in registrationForm.datepickerElements) {
        const input: HTMLInputElement = registrationForm.datepickerElements[name];
        input.addEventListener('changeDate', () => {
            removeError(input);
        }, false);
    }
}

/**
 * Append validation errors for given `name`.
 * `name` refers to HTML elements name attribute.
 */
function addError(form: HTMLFormElement, name: string, errs: ValidationError[]) {
    const input = form.querySelector(`[name="${name}"]`);
    input.classList.add('error');
    const container = (input.parentNode.parentNode as HTMLElement);
    container.classList.add('error');

    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerText = errs.reduce((str: string, err: ValidationError) => {
        return `${str}${locales.localize(err)}\n`;
    }, '');

    container.appendChild(errorMessage);
}

/**
 * Append general error to the form
 * This is used for errors which are not associated with any `name` (input)
 */
function addGeneralError(error: { status: number, statusText: string }) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-error';
    errorContainer.innerText = error.status && error.statusText ? `Error ${error.status}: ${error.statusText}` : 'Something went wrong';
    form.appendChild(errorContainer);
}

/**
 * Ensure general error is removed
 * This does nothing in case there is no general error
 */
function removeGeneralError() {
    const err = form.querySelector('.form-error');
    err && err.remove();
}

/**
 * Initialize logic for approve checkbox
 * This ensures that submit button is disabled and notice is shown unless approve checkbox is checked
 * It uses events to automatically toggle these states as checkbox gets checked or unchecked
 */
function initApproveCheckbox(submitBtn: HTMLButtonElement) {
    const checkbox = (document.getElementById('register-accept-statutes') as HTMLInputElement);
    const checkboxNotify = document.getElementById('approve-form-notify');
    checkboxNotify.style.display = checkbox.checked ? 'none' : 'block';

    checkbox.addEventListener('input', (event) => {
        const checked: boolean = (event.target as HTMLInputElement).checked;
        submitBtn.disabled = !checked;
        checkboxNotify.style.display = checked ? 'none' : 'block';
    });
}

/**
 * Handler for submits of form.
 * This is responsible
 *     - collecting all values
 *     - clearing all old errors
 *     - issueing the request to api
 */
function onSubmit(registrationForm: RegistrationForm, signature: XSign, submitBtn: HTMLButtonElement): (event: SubmitEvent) => void {
    return (event: SubmitEvent) => {
        event.preventDefault();

        // get values
        const values = registrationForm.values;
        values.signature = signature.value || null;
        values.local = document.documentElement.lang;

        // clear all exiting validation errors
        form.querySelectorAll('input,x-sign').forEach(removeError);
        removeGeneralError();

        requestJoin(values, submitBtn);
    }
}

/**
 * Issue a request to registration API
 * and handle all errors.
 */
async function requestJoin(values: { [key: string]: string }, submitBtn: HTMLButtonElement): Promise<string> {
    try {
        // Issue the request to registration API
        const result = await fetch("/api/registration/join", {
            method: "post",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        // If status is not OK (one of the 2xx series)
        // we throw the requet result into the exception handler
        if (!result.ok) throw result;
        const response: string = await result.json();

        // In case of success we remove submit button
        // and display success message
        (submitBtn.parentNode as HTMLElement).remove();
        const message = document.getElementById('registration-send-notice');
        message.style.display = 'block';

        return response;
    } catch (err) {
        // If status is 400 there was a problem with validating input
        // so we just parse out validation errors and display them
        if (err.status === 400) {
            err.json().then((val: ApiError) => {
                for (const key in val.errors) {
                    addError(form, key, val.errors[key]);
                }
            });
        } else {
            // If other cases we display general error
            // just to let user know that action did not succeeded
            console.error(err);
            addGeneralError(err);
        }
    }
}

/*  -----------------------------------------------------------------------------------
    Declare formatting functions
    These should turn input values into more readable format unless user is editing them
*/

export const postalCodeFormat: Formatter = (input: HTMLInputElement) => {
    const value: string = input.value.replace(' ', '');
    const firstPart = value.substring(0, 3);
    const secondPart = value.substring(3);

    input.value = `${firstPart} ${secondPart}`.trim();
}

export const phoneNumberFormat: Formatter = (input: HTMLInputElement) => {
    let value = input.value.replaceAll(' ', '');
    if (value.length === 9) {
        value = `+420${value}`;
    }

    const firstPart = value.substring(0, 4);
    const secondPart = value.substring(4, 7);
    const thirdPart = value.substring(7, 10);
    const forthPart = value.substring(10);

    input.value = `${firstPart} ${secondPart} ${thirdPart} ${forthPart}`.trim();
}


/*  -----------------------------------------------------------------------------------
    Initialize registration form
*/

const form = (document.getElementById('register-member-form') as HTMLFormElement);
const qrContainer = document.getElementById('registration-qr-container');

if (form) {
    // Configure datepicker locales
    RegistrationForm.addDatepickerLocale(datepickerCs);

    const registrationForm: RegistrationForm = new RegistrationForm(form, {
        qrContainer,
        language: document.documentElement.lang,
        datepickerSelector: '[data-widget="datepicker"]',
        formatters: {
            postal_code: postalCodeFormat,
            phone_number: phoneNumberFormat
        }
    })
        .fromLocation(window.location);

    // Initialize additional functions
    const submitBtn: HTMLButtonElement = form.querySelector('button[type="submit"]');
    const signatureElement: XSign = form.querySelector('x-sign[name="signature"]');

    initApproveCheckbox(submitBtn);
    form.addEventListener('submit', onSubmit(registrationForm, signatureElement, submitBtn));
    registerErrorCleaners(registrationForm);
}
