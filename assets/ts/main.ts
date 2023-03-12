function switchLanguage(url: string): void {
    location.href = `${url}${window.location.search}${location.hash}`;
}

// export to global namespace.
window['switchLanguage'] = switchLanguage;
