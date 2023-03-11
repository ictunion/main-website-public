import { ValidationError, Locale } from './validations';

function translate(error: ValidationError): string {
    switch (error.code) {
        case 'required':
            return 'This value is required';
        case 'email':
            return 'This does not look like email address';
        case 'length':
            console.log(error);
            return 'This value seems too short'
    }
}

const translations: Locale = {
    lang: 'en',
    translate,
}

export default translations;
