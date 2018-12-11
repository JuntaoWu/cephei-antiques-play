namespace ap {

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
        public moneyGroup: eui.Group;
        public antiGroup: eui.Group;
        public clockGroup: eui.Group;
        public optionGroup: eui.Group;
        public btnPlotGroup: eui.Group;
        public btnSkip: eui.Image;
        public btnNext: eui.Image;
        public eventGroup: eui.Group;
        public dialogImg: string;
        public showAntiEllipse: boolean;

        public yes: eui.Button;
        public no: eui.Button;
        public bao1: eui.Image;
        public bao2: eui.Image;
        public bao3: eui.Image;
        public bao4: eui.Image;
        public gu1: eui.Label;
        public gu2: eui.Label;
        public gu3: eui.Label;
        public gu4: eui.Label;
        public coll1: eui.Label;
        public coll2: eui.Label;
        public coll3: eui.Label;
        public coll4: eui.Label;
    }
}