import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode';

interface RegistrationFormOptions {
    prefix?: string;
    qrContainer?: HTMLElement;
    encodeTypes?: string[];
    formatters?: { [key: string]: (input: HTMLInputElement) => void };
};

export const defaultOptions: RegistrationFormOptions = {
    prefix: '',
    encodeTypes: ['text', 'email'],
    formatters: {},
};

export default class RegistrationForm {
    form: HTMLFormElement;
    inputs: NodeListOf<HTMLInputElement>;
    options: RegistrationFormOptions;
    qrImg: HTMLImageElement;

    constructor(form: HTMLFormElement, options?: RegistrationFormOptions) {
        this.form = form;
        this.inputs = form.querySelectorAll('input');
        this.options = Object.assign({}, defaultOptions, options);

        if (this.options.qrContainer) {
            this.initQr(this.options.qrContainer);
        }

        this.registerEventListeners();
    }

    get urlBase(): string {
        return `${location.protocol}//${location.host}${location.pathname}`
    }

    initQr(qrContainer: HTMLElement) {
        this.qrImg = document.createElement('img');
        qrContainer.append(this.qrImg);
    }

    registerEventListeners() {
        this.inputs.forEach((input: HTMLInputElement) => {
            const formatterType = input.getAttribute('data-formatter');
            const formatter = formatterType ? this.options.formatters[formatterType] : undefined;

            input.addEventListener('blur', () => {
                // run formatter if available
                if (formatter) {
                    console.log("run");
                    formatter(input);
                }

                const params = this.toURLSearchParams();
                const url = params.toString();

                if (history) {
                    const entry = url ? `?${url}` : this.urlBase;
                    history.replaceState({}, '', entry);
                }
                this.updateQr(params);
            });

            // for inputs with formatter we also need to convert
            // values back to editable form
            if (formatterType) {
                input.addEventListener('focus', () => {
                    input.value = input.value.replaceAll(' ', '');
                });
            }
        });

    }

    fromLocation(location: Location) {
        const searchParams = new URLSearchParams(location.search);
        this.updateQr(searchParams);

        if (location.search) {
            const regexp = new RegExp(`^${this.options.prefix}`, '');
            searchParams.forEach((value, name) => {
                if (name) {
                    const inputName = name.replace(regexp, '');
                    const input: HTMLInputElement = this.form.querySelector(`[name=${inputName}]`);
                    if (input) {
                        input.value = value;
                    }
                }
            });
        }
    }

    toURLSearchParams(): URLSearchParams {
        const values: { [key: string]: string; } = {};

        this.inputs.forEach((input: HTMLInputElement) => {
            if (input.name && input.value && this.options.encodeTypes.includes(input.type)) {
                values[`${this.options.prefix}${input.name}`] = input.value;
            }
        });

        return new URLSearchParams(values);
    }

    updateQr(params: URLSearchParams) {
        if (!this.qrImg) {
            // nothing to update
            return;
        }
        const qrcode = new Encoder();
        qrcode.setEncodingHint(true);
        qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.M);

        const anchor = this.form.id ? `#${this.form.id}` : '';
        qrcode.write(`${this.urlBase}?${params.toString()}${anchor}`);
        qrcode.make();
        this.qrImg.src = qrcode.toDataURL();
    }
}
