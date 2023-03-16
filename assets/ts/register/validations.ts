export interface ValidationError {
    code: 'required' | 'email' | 'length' | 'empty',
    params: Object,
}

export interface ApiErrorData {
    [key: string]: ValidationError[],
}

export interface ApiError {
    code: number,
    message: string,
    errors: ApiErrorData,
}

export interface Locale {
    lang: string,
    translate: (error: ValidationError) => string;
}

export interface Localizations {
    add(locale: Locale): Localizations;
    setLang(lang: string): Localizations;
    localize(error: ValidationError): string;
}

export function localize(def: Locale): Localizations {
    let locales: { [key: string]: Locale } = {};
    const defKey: string = def.lang;
    let lang: string = def.lang;

    function addLocale(locale: Locale) {
        locales[locale.lang] = locale;
    }

    addLocale(def);

    const publicApi: Localizations = {
        add(locale: Locale): Localizations {
            addLocale(locale);
            return publicApi;
        },
        setLang(l: string): Localizations {
            lang = locales[l] ? l : defKey;
            return publicApi;
        },
        localize(error: ValidationError): string {
            return locales[lang].translate(error);
        }
    }

    return publicApi;
}
