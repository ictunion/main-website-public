import { ValidationError, Locale } from './validations';

function translate(error: ValidationError): string {
    switch (error.code) {
        case 'required':
            return 'This value is required';
        case 'email':
            return 'This does not look like email address';
        case 'length':
            return 'This value seems too short'
        case 'empty':
            return 'This value cannot be empty'
    }
}

const translations: Locale = {
    lang: 'en',
    translate,
}

export default translations;
