import { ValidationError, Locale } from './validations';

function translate(error: ValidationError): string {
    switch (error.code) {
        case 'required':
            return 'Toto pole je povinné';
        case 'email':
            return 'Toto pole neobsahuje e-mailovou adresu';
        case 'length':
            console.log(error);
            return 'Toto polo je přílis krátké';
    }
}

const translations: Locale = {
    lang: 'cs',
    translate,
}

export default translations;
