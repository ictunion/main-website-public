function loadJs(surveyId: string): Promise<Event> {
    const script = document.createElement('script');
    return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;

        script.src = `https://actionnetwork.org/widgets/v6/survey/${surveyId}?format=js&source=widget`;
        document.head.appendChild(script);
    });
}

export class XSurvey extends HTMLElement {
    public connectedCallback() {
        const button: HTMLButtonElement = this.querySelector('[role=allow]');
        button.addEventListener('click', this.insertSurvey.bind(this));
    }

    private async insertSurvey() {
        const surveyId: string = this.getAttribute('surveyId');
        const container = document.createElement('div');
        container.id = `can-survey-area-${surveyId}`;
        container.classList.add('event-detail-petition-embed');
        this.replaceChildren(container);
        await loadJs(surveyId);
    }
}
