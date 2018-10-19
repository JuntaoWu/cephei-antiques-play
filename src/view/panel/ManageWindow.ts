module game {

    export class ManageWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "ManageWindow";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }
    }
}