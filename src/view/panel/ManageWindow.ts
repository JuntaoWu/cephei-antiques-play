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
        public clock: eui.Label;
        public text1: eui.Label;
        public gold: eui.Label;
        public yes: eui.Button;
        public no: eui.Button;
        public option: eui.Group;
        public coll1: eui.Label;
        public coll2: eui.Label;
        public coll3: eui.Label;
        public coll4: eui.Label;

        public description: string;
        public miniGameGroup: eui.Group;
        public gameTrueFalse: eui.Group;
        public gameList: eui.List;
    }
}