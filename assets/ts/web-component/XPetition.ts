function loadJs(petitionId: string): Promise<Event> {
    const script = document.createElement('script');
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;

        script.src = `https://actionnetwork.org/widgets/v5/petition/${petitionId}?format=js&source=widgets`;
        document.head.appendChild(script);
    });
}

export class XPetition extends HTMLElement {
    public connectedCallback() {
        const button: HTMLButtonElement = this.querySelector('[role=allow]');
        button.addEventListener('click', this.insertPetition.bind(this));
    }

    private async insertPetition() {
        const petitionId: string = this.getAttribute('petitionId');
        const container = document.createElement('div');
        container.id = `can-petition-area-${petitionId}`;
        container.classList.add('event-detail-petition-embed');
        this.replaceChildren(container);
        await loadJs(petitionId);
    }
}
