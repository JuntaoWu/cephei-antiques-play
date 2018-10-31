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
            ApplicationFacade.getInstance().registerMediator(new ManageWindowMediator(this));
        }

        public gu1: eui.Label;
        public gu2: eui.Label;
        public gu3: eui.Label;
        public gu4: eui.Label;
        public time: eui.Label;
        public help: eui.Image;
        public text1: eui.Label;
        public gold: eui.Label;
    }
}