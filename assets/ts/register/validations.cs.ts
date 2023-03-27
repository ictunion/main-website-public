import { ValidationError, Locale } from './validations';

function translate(error: ValidationError): string {
    switch (error.code) {
        case 'required':
            return 'Toto pole je povinné';
        case 'email':
            return 'Toto pole neobsahuje e-mailovou adresu';
        case 'length':
            return 'Toto pole je přílis krátké';
        case 'empty':
            return 'Toto pole nesmí být prázdné';
    }
}

const translations: Locale = {
    lang: 'cs',
    translate,
}

export default translations;
