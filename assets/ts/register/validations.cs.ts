import { ValidationError, Locale } from './validations';

function translate(error: ValidationError): string {
    switch (error.code) {
        case 'required':
            return 'Toto pole je povinné';
        case 'email':
            return 'Toto pole neobsahuje e-mailovou adresu';
        case 'length':
            return 'Toto polo je přílis krátké';
        case 'empty':
            return 'Toto polo nesmí být prázdné';
    }
}

const translations: Locale = {
    lang: 'cs',
    translate,
}

export default translations;
