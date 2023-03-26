function shuffle<T>(a: T[]): T[] {
    var j, x, i: number;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

const typingElements = document.querySelectorAll('[data-effect="shuffled-typing"]') as NodeListOf<HTMLElement>;

typingElements.forEach((typing: HTMLElement) => {
    const script = typing.querySelector('script');
    if (!script) return;
    // oh well.. double json parse because for some reason hugo feels stringifies JSON implicitelly
    let occupations: string[] = shuffle(JSON.parse(JSON.parse(script.innerText)));
    let occupation_index = 0;
    let index = 0;
    let occupation: string = occupations[occupation_index];

    function nextOccupation() {
        occupation_index++;
        if (occupation_index < occupations.length) {
            occupation = occupations[occupation_index];
        } else {
            occupation_index = 0;
            occupation = occupations[0];
        }
    }

    function typeLetter() {
        if (index < occupation.length) {
            typing.innerText += occupation.charAt(index);
            window.setTimeout(typeLetter, 100);
            index++;
        } else {
            window.setTimeout(backspace, 100 * occupation.length);
        }
    }

    function backspace() {
        if (index >= 0) {
            typing.innerText = typing.innerText.slice(0, -1);
            window.setTimeout(backspace, 20);
            index--;
        } else {
            nextOccupation();
            window.setTimeout(typeLetter, 200);
        }
    }

    window.setTimeout(typeLetter, 200);

});
