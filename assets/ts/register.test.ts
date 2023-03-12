import { postalCodeFormat, phoneNumberFormat } from './register';

function inputWithValue(value: string): HTMLInputElement {
    const input = (document.createElement('input') as HTMLInputElement);
    input.value = value;

    return input;
}

describe('Phone number formatting', () => {
    test('Empty string resolves to empty string', () => {
        const input = inputWithValue('');
        phoneNumberFormat(input);
        expect(input.value).toBe('');
    });

    test('Should auto format full number', () => {
        const input = inputWithValue('+420777666555');
        phoneNumberFormat(input);
        expect(input.value).toBe('+420 777 666 555');
    });

    test('Should auto prefix number', () => {
        const input = inputWithValue('777666555');
        phoneNumberFormat(input);
        expect(input.value).toBe('+420 777 666 555');
    });

    test('Should format string shortter than full number correctly', () => {
        const input = inputWithValue('+420777666');
        phoneNumberFormat(input);
        expect(input.value).toBe('+420 777 666');
    });

    test('Should format string longer than full number correctly', () => {
        const input = inputWithValue('+4207367316981');
        phoneNumberFormat(input);
        expect(input.value).toBe('+420 736 731 6981');
    });
});

describe('Postal code formatting', () => {
    test('Empty string resolves to empty string', () => {
        const input = inputWithValue('');
        postalCodeFormat(input);
        expect(input.value).toBe('');
    });

    test('Should auto format full number', () => {
        const input = inputWithValue('60200');
        postalCodeFormat(input);
        expect(input.value).toBe('602 00');
    });

    test('Should format string shortter than full number correctly', () => {
        const input = inputWithValue('1232');
        postalCodeFormat(input);
        expect(input.value).toBe('123 2');
    });

    test('Should format string longer than full number correctly', () => {
        const input = inputWithValue('232787');
        postalCodeFormat(input);
        expect(input.value).toBe('232 787');
    });
});
