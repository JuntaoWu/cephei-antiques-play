module game {

    export class StartScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "StartScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new StartScreenMediator(this));
        }

        public btnGame: eui.Button;
        public btnStart: eui.Button;
    }
}