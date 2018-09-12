
module game {

    export class GameScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GameScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(GameScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextTestClick, this);
            this.initData();
        }

        private _questions: Map<string, any>;
		public get questions(): Map<string, any> {
			if (!this._questions) {
				this._questions = new Map(Object.entries(RES.getRes("question_json")));
			}
			return this._questions;
		}

        public id: number = 1;

        public initData() {
            this.gameScreen.showInput = this.gameScreen.showSelect 
            = this.gameScreen.showResult = this.gameScreen.showMiniGame = false;
            this.gameScreen.question = { ...this.questions.get(this.id.toString()) };
            this.gameScreen.description = this.gameScreen.question.description;
            if (this.gameScreen.question.type == "填空") {
                this.gameScreen.showInput = true;
            }
            else if (this.gameScreen.question.type == "选择") {
                
                this.gameScreen.selectList.dataProvider = new eui.ArrayCollection(this.gameScreen.question.select);
                this.gameScreen.selectList.itemRenderer = QuestionSelectItemRenderer;
                this.gameScreen.showSelect = true;
            }
            else if (this.gameScreen.question.type == "小游戏") {
                this.sendNotification(GameProxy.SHOW_MINIGAME, this.gameScreen.question.keyword);
                this.gameScreen.showMiniGame = true;
                // let game = new MiniGameFloorSwitch();
                // this.gameScreen.miniGame.addChild(game);
            }
            console.log(this.id);
        }

        public showRightResult() {
            this.gameScreen.description = this.gameScreen.question.right;
            this.gameScreen.showResult = true;
        }

        public nextQuestion() {
            if (this.gameScreen.question.next != "over") {
                this.id = this.gameScreen.question.next;
                this.initData();
            }
        }
        
        public nextTestClick() {
            if (!this.gameScreen.showResult) {
                this.showRightResult();
            } 
            else {
                this.nextQuestion();
            }
        }

        public onClick() {
            if (this.gameScreen.question.type == "填空") {
                if (this.gameScreen.answerInput.text != this.gameScreen.question.answer) {
                    return;
                }
            }
            else if (this.gameScreen.question.type == "选择") {
                console.log(this.gameScreen.selectList.selectedItem)
                if (this.gameScreen.selectList.selectedItem != this.gameScreen.question.answer) {
                    return;
                }
            }
            else if (this.gameScreen.question.type == "小游戏") {
                
                return;
            }
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.PASS_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.PASS_MINIGAME: 
                    this.showRightResult();
                    break;
            }
        }

        public get gameScreen(): GameScreen {
            return <GameScreen><any>(this.viewComponent);
        }
    }
}