module game {

    export class NewPlayerGuide extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "NewPlayerGuide";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new NewPlayerGuideMediator(this));
        }

        public dialog: eui.Label;
        public group1: eui.Group;
        public group2: eui.Group;
        public group3: eui.Group;
        public group4: eui.Group;
        public group5: eui.Group;
        public dialogGroup: eui.Group;
    }
}