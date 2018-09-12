module game {

    export class GameScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "GameScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameScreenMediator(this));
        }

        public answerInput: eui.TextInput;
        public question: any;
        public description: string;
        public showInput: boolean;
        public showSelect: boolean;
        public showResult: boolean;
        public showMiniGame: boolean;
        public selectList: eui.List;
        public nextTest: eui.Button;
    }
}