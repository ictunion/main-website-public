import { Encoder, ErrorCorrectionLevel } from '@nuintun/qrcode';

export class Xqr extends HTMLElement {
    public connectedCallback() {
        const qrcode = new Encoder();
        qrcode.setEncodingHint(true);
        qrcode.setErrorCorrectionLevel(ErrorCorrectionLevel.M);
        qrcode.write(this.getAttribute('data'));
        qrcode.make();
        const img = document.createElement('img');
        img.src = qrcode.toDataURL();
        this.appendChild(img);
    }
}
