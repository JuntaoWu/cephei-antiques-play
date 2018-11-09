module game {

    export class PopupWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "PopupWindow";
            this.appVersion = platform.appVersion;
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.close();
                this.cbk && this.cbk();
            },this);
        }
        
        public appVersion: string;
        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public btnConfirm: eui.Button;
        public msg: string;
        public hasCancel: boolean;
        public cbk: () => {};

        public setPopupWindow(msg: string, hasCancel: boolean = false, cbk: () => {} = null) {
            this.msg = msg;
            this.cbk = cbk;
            this.hasCancel = hasCancel;
            this.btnConfirm.right = hasCancel ? 45 : 190;
        }
    }
}