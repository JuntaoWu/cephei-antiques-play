module game {

    export class MiniGameM42 extends eui.Component {

        public constructor() {
            super();
            this.skinName = "MiniGameM42";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new MiniGameM42Mediator(this));
        }

        public jigsawGroup: eui.Group;
        public jigsawResult: eui.Group;
        public btnLeft: eui.Button;
        public btnRight: eui.Button;
        public btnED: eui.Button;
        public btnConfirm: eui.Button;
        public btnReset: eui.Button;
    }
}