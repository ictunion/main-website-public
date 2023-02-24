function switchLanguage(url: string): void {
    location.href = url + window.location.search;
}

// export to global namespace.
window['switchLanguage'] = switchLanguage;
