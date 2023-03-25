import SignaturePad from 'signature_pad';

export class XSign extends HTMLElement {
    public value: string | undefined;
    private signaturePad: SignaturePad | undefined;
    private signButton: NodeListOf<HTMLButtonElement> | undefined;
    private uploadButton: NodeListOf<HTMLButtonElement> | undefined;
    private confirmButton: NodeListOf<HTMLButtonElement> | undefined;
    private cancelButton: NodeListOf<HTMLButtonElement> | undefined;
    private undoButton: NodeListOf<HTMLButtonElement> | undefined;
    private clearButton: NodeListOf<HTMLButtonElement> | undefined;
    private canvas: HTMLCanvasElement | undefined;
    private fileInput: HTMLInputElement | undefined;
    private result: HTMLImageElement | undefined;
    private overlay: HTMLElement | undefined;
    private resizeObserver: ResizeObserver | undefined;

    public connectedCallback() {
        // setup callback for sign button
        this.signButton = this.querySelectorAll('[data-role="sign"]');
        this.signButton.forEach((btn) => {
            btn.addEventListener('click', this.initSignaturePad.bind(this));
        });

        this.uploadButton = this.querySelectorAll('[data-role="upload"]');
        this.uploadButton.forEach((btn) => {
            btn.addEventListener('click', this.uploadFile.bind(this));
        });

        this.confirmButton = this.querySelectorAll('[data-role="confirm"]');
        this.confirmButton.forEach((btn) => {
            btn.addEventListener('click', this.confirmSignature.bind(this));
        });

        this.cancelButton = this.querySelectorAll('[data-role="cancel"]');
        this.cancelButton.forEach((btn) => {
            btn.addEventListener('click', this.cancelSignature.bind(this));
        });

        this.undoButton = this.querySelectorAll('[data-role="undo"]');
        this.undoButton.forEach((btn) => {
            btn.addEventListener('click', this.undoSignature.bind(this));
        })

        this.clearButton = this.querySelectorAll('[data-role="clear"]');
        this.clearButton.forEach((btn) => {
            btn.addEventListener('click', this.clearSignature.bind(this));
        });

        // setup drag and drop upload
        this.addEventListener('dragover', this.dragOver.bind(this), false);
        this.addEventListener('dragenter', this.dragEnter.bind(this), false);
        this.addEventListener('dragleave', this.dragLeave.bind(this), false);
        this.addEventListener('drop', this.dropped.bind(this), false);

        // add file input
        // we need to insert this into DOM
        // otherwise iPhones "take pickure" functionality is broken
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.accept = 'image/*';
        this.fileInput.style.display = 'none';
        // configure callback
        this.fileInput.addEventListener('change', (e) => {
            if (!e.target) return;
            const file = (e.target as HTMLInputElement).files[0];
            this.fileToRes(file);
        });
        this.appendChild(this.fileInput);

        // configure resize observer
        if (ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.canvas) {
                    const data = this.signaturePad && this.signaturePad.toData();
                    this.canvas.width = this.clientWidth;
                    this.canvas.height = this.clientHeight;
                    this.signaturePad && data && this.signaturePad.fromData(data);
                }
            });

            this.resizeObserver.observe(this);
        }
    }

    private initSignaturePad() {
        if (this.signaturePad) {
            // already initialized
            return;
        }

        this.canvas = (document.createElement('canvas') as HTMLCanvasElement);
        this.canvas.width = this.clientWidth;
        this.canvas.height = this.clientHeight;
        this.canvas.style.position = 'absolute';

        // replace current content with signature pad
        this.signaturePad = new SignaturePad(this.canvas);
        this.prepend(this.canvas);

        // hide result if visible
        if (this.result) {
            this.result.style.display = 'none';
        }

        // change class
        this.classList.add('active');
        this.overlay = document.createElement('div');
        this.overlay.className = 'x-sign-overlay';
        this.parentElement && this.parentElement.appendChild(this.overlay);
    }

    private cancelSignature() {
        if (!this.signaturePad) {
            // nothing to cancel
            return;
        }
        this.signaturePad.off();
        this.signaturePad = undefined;

        this.canvas && this.removeChild(this.canvas);
        this.canvas = undefined;


        // show result if exists
        if (this.result) {
            this.result.style.display = '';
        }

        this.classList.remove('active');
        this.removeOverlay();
    }

    private undoSignature() {
        if (!this.signaturePad) {
            // nothing to undo
            return;
        }

        const data = this.signaturePad.toData();

        data.pop(); // remove the last dot or line
        this.signaturePad.fromData(data);
    }

    private clearSignature() {
        if (this.signaturePad) {
            // nothing to clear
            return this.signaturePad.clear();
        }

        if (this.result) {
            // already has previous result which needs to be cleared
            this.removeChild(this.result);
            this.value = undefined;
            this.result = undefined;
            this.classList.remove('done');
        }
    }

    private confirmSignature() {
        if (!this.signaturePad) {
            // nothing to confirm
            return;
        }

        const stateData = this.signaturePad.toData();
        if (stateData && stateData.length > 0) {
            const data = this.signaturePad.toDataURL('image/png');
            this.cancelSignature();
            this.setResult(data);
        } else {
            this.cancelSignature();
        }
    }

    private uploadFile() {
        this.fileInput && this.fileInput.click();
    }

    private setResult(data: string) {
        if (this.result) {
            // already has previous result which needs to be cleared
            this.removeChild(this.result);
        }
        const img = document.createElement('img');
        img.src = data;
        this.result = img;
        this.value = data;
        this.prepend(img);
        this.classList.add('done');
        this.removeOverlay();

        const event = new Event('input');
        this.dispatchEvent(event);
    }

    private dragOver(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        this.classList.add('drag');
    }

    private dragEnter(event: DragEvent) {
        event.stopPropagation();
        event.preventDefault();

        this.classList.add('drag');
    }

    private dragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();

        this.classList.remove('drag');
    }

    private dropped(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) {
            const dt: DataTransfer = event.dataTransfer;
            const file: File = dt.files[0];
            this.fileToRes(file);

            this.classList.remove('drag');
        }
    }

    private fileToRes(file: File) {
        if (['image/jpeg', 'image/png'].includes(file.type)) {
            let width: number = this.clientWidth * window.devicePixelRatio;
            let height: number = this.clientHeight * window.devicePixelRatio;

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.addEventListener('load', (e: any) => {
                const img: HTMLImageElement = document.createElement('img');
                img.addEventListener('load', () => {
                    // resize to fit
                    const origWidth = img.naturalWidth;
                    const origHeight = img.naturalHeight;
                    if (origWidth / width > origHeight / height) {
                        height = origHeight * (width / origWidth);
                    } else {
                        width = origWidth * (height / origHeight);
                    }

                    const canvas: HTMLCanvasElement = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    var ctx = (canvas.getContext('2d') as CanvasRenderingContext2D);
                    ctx.drawImage(img, 0, 0, width, height);
                    const result: string = (canvas.toDataURL(file.type) as string);
                    this.setResult(result);
                });
                if (e.target && e.target.result) {
                    img.src = e.target.result;
                }
            });
        }
    }

    private removeOverlay() {
        if (this.overlay && this.parentElement && this.overlay) {
            this.parentElement.removeChild(this.overlay);
            this.overlay = undefined;
        }
    }
}
