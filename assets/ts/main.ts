function switchLanguage(url: string): void {
    location.href = url;
}

// export to global namespace.
window['switchLanguage'] = switchLanguage;
