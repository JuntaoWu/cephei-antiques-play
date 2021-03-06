namespace ap {

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

        public nextBtn: eui.Button;
        public btnBack: eui.Button;
        // public btnSave: eui.Button;
        public btnManage: eui.Button;
        public btnPicture: eui.Button;
        public fatigueValue: eui.Label;
        public no_btnmanage: eui.Image;

        public questionRes: string; //谜题图
        public question: string;
        public points: string;
        public description: string = "";
        public showScene: boolean;
        public showTransition: boolean;
        public transitionText: string;
        public showPoints: boolean;

        public miniGame: MiniGame;
        public sceneGroup: eui.Group;
        public pkBarGroup: eui.Group;
        public questionGroup: eui.Group;
        public textGroup: eui.Group;
        public huangAndMubar: eui.Group;
        public scrollGroup: eui.Scroller;
        public footGroup: eui.Group;
        public bottomGroup: eui.Group;
        public plotSelectList: eui.List;
        public nextTest: eui.Button;
        public btnTips: eui.Button;
        public btnHelp: eui.Button;
        public sceneBg: eui.Image;
        public sceneAddGroup: eui.Group;
        public btnReset: eui.Button;
        public btnConfirm: eui.Button;
        public showReset: boolean;

        public inputGroup: MiniGameInput = new MiniGameInput();
        public selectGroup: MiniGameSelect = new MiniGameSelect();


        public showInput(questionId: number, answer) {
            this.bottomGroup.removeChildren();
            this.inputGroup.setQuestion(questionId, answer);
            this.bottomGroup.addChild(this.inputGroup);
        }

        public showSelect(optionsId: number) {
            this.bottomGroup.removeChildren();
            this.selectGroup.setOptionsId(optionsId);
            this.bottomGroup.addChild(this.selectGroup);
        }
    }
}