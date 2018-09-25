module game {

    export class MiniGameM14 extends eui.Component {

        public constructor() {
            super();
            this.skinName = "M14Skin";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameM14Mediator(this));
        }

        public no1: eui.Image;
        public no2: eui.Image;
        public no3: eui.Image;
        public no4: eui.Image;
        public no5: eui.Image;
        public no6: eui.Image;
        public no7: eui.Image;
        public no8: eui.Image;
        public win: eui.Label;

        public paperList: Array<eui.Image> = [];
        public recordList: Array<any> = [];
        public answerList: Array<any> = [];
    }
}