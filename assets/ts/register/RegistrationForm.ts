import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode';
import { Datepicker } from 'vanillajs-datepicker';

export interface Formatter {
    (input: HTMLInputElement): void
}

interface RegistrationFormOptions {
    prefix?: string;
    qrContainer?: HTMLElement;
    encodeTypes?: string[];
    formatters?: { [key: string]: Formatter };
    datepickerSelector?: string;
    language?: string;
};

export interface Values {
    [key: string]: string | null;
}

interface Field {
    name: string;
    value: string;
}

export const defaultOptions: RegistrationFormOptions = {
    prefix: '',
    encodeTypes: ['text', 'email'],
    formatters: {},
    language: 'en',
};

export default class RegistrationForm {
    public form: HTMLFormElement;
    public datepickerElements: { [key: string]: HTMLInputElement } = {};
    private inputs: NodeListOf<HTMLInputElement>;
    private options: RegistrationFormOptions;
    private qrImg: HTMLImageElement | undefined;
    private datepickers: { [key: string]: Datepicker } = {};

    constructor(form: HTMLFormElement, options?: RegistrationFormOptions) {
        this.form = form;
        this.inputs = form.querySelectorAll('input');
        this.options = Object.assign({}, defaultOptions, options);

        if (this.options.qrContainer) {
            this.initQr(this.options.qrContainer);
        }

        this.registerEventListeners();

        if (this.options.datepickerSelector) {
            this.initDatepickers(this.options.datepickerSelector);
        }
    }

    static addDatepickerLocale(locale: Object) {
        Object.assign(Datepicker.locales, locale);
    }

    get urlBase(): string {
        return `${location.protocol}//${location.host}${location.pathname}`
    }

    get values(): Values {
        return Object.values(this.form).reduce((obj: Values, field: Field) => {
            if (field.name === "") {
                return obj;
            } else if (this.datepickers[field.name]) {
                obj[field.name] = (this.datepickers[field.name].getDate('yyyy-mm-dd') as string);
                return obj;
            } else {
                obj[field.name] = field.value || null;
                return obj;
            }
        }, {});
    }

    private initDatepickers(selector: string) {
        const elements = this.form.querySelectorAll(selector);

        elements.forEach((element: HTMLInputElement) => {
            const instance = new Datepicker(element, {
                language: this.options.language
            });
            this.datepickerElements[element.name] = element;
            this.datepickers[element.name] = instance;
        });
    }

    private initQr(qrContainer: HTMLElement) {
        this.qrImg = document.createElement('img');
        qrContainer.append(this.qrImg);
    }

    private registerEventListeners() {
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

    public fromLocation(location: Location): RegistrationForm {
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

        return this;
    }

    private toURLSearchParams(): URLSearchParams {
        const values: { [key: string]: string; } = {};

        this.inputs.forEach((input: HTMLInputElement) => {
            if (input.name && input.value && this.options.encodeTypes.includes(input.type)) {
                values[`${this.options.prefix}${input.name}`] = input.value;
            }
        });

        return new URLSearchParams(values);
    }

    private updateQr(params: URLSearchParams) {
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
