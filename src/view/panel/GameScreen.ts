module game {

    export class GameScreen extends eui.Component {

        public constructor() {
            super();
            this.skinName = "GameScreen";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new GameScreenMediator(this));
        }

        public btnBack: eui.Button;

        public questionRes: string; //谜题图
        public question: string; 
        public points: string;
        public description: string = "";
        public showMiniGame: boolean;
        public showScene: boolean;
        public showTransition: boolean;
        public transitionText: string;

        public sceneGroup: eui.Group;
        public questionGroup: eui.Group;
        public textGroup: eui.Group;
        public huangAndMubar: eui.Group;
        public scrollGroup: eui.Scroller;
        public bottomGroup: eui.Group;
        public plotSelectList: eui.List;
        public nextTest: eui.Button;
        public btnTips: eui.Button;
        public btnHelp: eui.Button;
        public sceneBg: eui.Image;
        public sceneAddGroup: eui.Group;

        public inputGroup: MiniGameInput = new MiniGameInput();
        public selectGroup: MiniGameSelect = new MiniGameSelect();

        public showInput(answer: string) {
            this.bottomGroup.removeChildren();
            this.inputGroup.setAnswer(answer);
            this.bottomGroup.addChild(this.inputGroup);
        }

        public showSelect(optionsId: number) {
            this.bottomGroup.removeChildren();
            this.selectGroup.setOptionsId(optionsId);
            this.bottomGroup.addChild(this.selectGroup);
        }
    }
}