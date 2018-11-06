module game {

    export class DeveloperWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "DeveloperWindow";
            this.appVersion = platform.appVersion;
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }
        
        public appVersion: string;
        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }
    }
}