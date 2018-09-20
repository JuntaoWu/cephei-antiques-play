module game {

    export class GameScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "GameScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.textTipsGroup.y = this.stage.stageHeight - this.textTipsGroup.height - 150;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameScreenMediator(this));
        }

        public question: any;
        public points: string;
        public description: string;
        public showBottomGroup: boolean;
        public showMiniGame: boolean;
        public scrollGroup: eui.Scroller;
        public bottomGroup: eui.Group;
        public nextTest: eui.Button;
        public btnTips: eui.Button;
        public btnHelp: eui.Button;
        public textTipsGroup: eui.Group;

        public inputGroup: MiniGameInput = new MiniGameInput();
        public selectGroup: MiniGameSelect = new MiniGameSelect();

        public showInput() {
            this.bottomGroup.removeChildren();
            this.inputGroup.setAnswer(this.question.answer);
            this.bottomGroup.addChild(this.inputGroup);
        }

        public showSelect() {
            this.bottomGroup.removeChildren();
            this.selectGroup.setOptionsId(this.question.optionsId);
            this.bottomGroup.addChild(this.selectGroup);
        }
    }
}