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

        public question: any;
        public description: string;
        public showBottomGroup: boolean;
        public showMiniGame: boolean;
        public bottomGroup: eui.Group;
        public nextTest: eui.Button;

        public inputGroup: MiniGameInput = new MiniGameInput();
        public selectGroup: MiniGameSelect = new MiniGameSelect();

        public showInput(answer: string) {
            this.bottomGroup.removeChildren();
            this.inputGroup.setAnswer(answer);
            this.bottomGroup.addChild(this.inputGroup);
        }

        public showSelect() {
            this.bottomGroup.removeChildren();
            this.bottomGroup.addChild(this.selectGroup);
        }
    }
}