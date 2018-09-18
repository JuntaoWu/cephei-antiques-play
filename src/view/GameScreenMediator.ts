
module game {

    export class GameScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GameScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(GameScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextTestClick, this);
            this.gameScreen.btnTips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnTipsClick, this);
            this.gameScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
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
        public showResult: boolean;

        public initData() {
            this.gameScreen.showBottomGroup = this.gameScreen.showMiniGame = this.showResult = false;
            this.gameScreen.points = this.gameScreen.description = "";
            this.gameScreen.question = {
                ...this.questions.get(this.id.toString()),
                showPointsNum: 2,
            };
            this.gameScreen.description = this.gameScreen.question.description;
            this.gameScreen.scrollGroup.viewport.scrollH = 0;
            if (this.gameScreen.question.type == "填空") {
                this.gameScreen.showBottomGroup = true;
                this.gameScreen.showInput();
            }
            else if (this.gameScreen.question.type == "选择") {
                this.gameScreen.showBottomGroup = true;
                this.gameScreen.showSelect();
            }
            else if (this.gameScreen.question.type == "小游戏") {
                this.sendNotification(GameProxy.SHOW_MINIGAME, this.gameScreen.question.keyword);
                this.gameScreen.showMiniGame = true;
            }
            console.log(this.id);
        }

        public showRightResult() {
            this.gameScreen.description = this.gameScreen.question.right;
            this.showResult = true;
        }

        public nextQuestion() {
            if (this.gameScreen.question.next != "over") {
                this.id = this.gameScreen.question.next;
                this.initData();
            }
        }
        
        public nextTestClick() {
            if (!this.showResult) {
                this.showRightResult();
            } 
            else {
                this.nextQuestion();
            }
        }

        public btnTipsClick() {
            if (this.gameScreen.question.showPointsNum == 2) {
                this.gameScreen.points = this.gameScreen.question.points1;
                this.gameScreen.question.showPointsNum--;
            }
            else if (this.gameScreen.question.showPointsNum == 1) {
                this.gameScreen.points = this.gameScreen.question.points2;
                this.gameScreen.question.showPointsNum--;
            }
            else {
                this.gameScreen.points = "";
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