
module game {

    export class GameScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GameScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(GameScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.gameScreen.textGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.gameScreen.textGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
            this.gameScreen.plotSelectList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            
            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextTestClick, this);
            this.gameScreen.btnTips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnTipsClick, this);
            this.gameScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        private _plotOptions: Map<string, any>;
		public get plotOptions(): Map<string, any> {
			if (!this._plotOptions) {
				this._plotOptions = new Map(Object.entries(RES.getRes("plot-options_json")));
			}
			return this._plotOptions;
		}

        public id: number = 1;
        public showResult: boolean;
        public isQuestion: boolean;
        public questionId: number;
        public questionPoints: Array<string>;
        public rightText: string;
        public showPointsNum: number;

        public initData() {
            this.gameScreen.bottomGroup.visible = this.gameScreen.plotSelectList.visible = false;
            this.gameScreen.showMiniGame = this.showResult = this.isQuestion = false;
            this.gameScreen.question = this.gameScreen.points = this.gameScreen.description = "";
            this.gameScreen.scrollGroup.height = 480;
            
            let barH = this.gameScreen.huangAndMubar.getChildByName("huangyanyan") as eui.Image;
            let barM = this.gameScreen.huangAndMubar.getChildByName("munai") as eui.Image;
            barH.width = this.gameScreen.huangAndMubar.width * this.proxy.pointHunag / (this.proxy.pointHunag + this.proxy.pointMu);
            barM.width = this.gameScreen.huangAndMubar.width * this.proxy.pointMu / (this.proxy.pointHunag + this.proxy.pointMu);

            let plot, question;
            if (!this.proxy.chapterPlot.get(this.id.toString())) {
                // return;
            }
            plot = {
                ...this.proxy.chapterPlot.get(this.id.toString())
            }
            console.log(this.id);
            console.log(plot);
            if (plot.type == plotType.question || !plot.type) {
                this.gameScreen.sceneGroup.visible = false;
                this.gameScreen.questionGroup.visible = this.isQuestion = true;

                this.questionId = plot.question || this.questionId + 1;
                question = { ...this.proxy.questions.get(this.questionId.toString()) };
                this.gameScreen.questionRes = question.img;
                this.gameScreen.description = question.description;
                this.gameScreen.question = question.question;

                this.rightText = question.right;
                this.questionPoints = [question.points1, question.points2];
                this.showPointsNum = 0;
                
                this.gameScreen.scrollGroup.height = 180;
                this.gameScreen.scrollGroup.viewport.scrollH = 0;
                if (question.type == "填空") {
                    this.gameScreen.bottomGroup.visible = true;
                    this.gameScreen.showInput(question.answer);
                }
                else if (question.type == "选择") {
                    this.gameScreen.bottomGroup.visible = true;
                    this.gameScreen.showSelect(question.optionsId);
                }
                else if (question.type == "小游戏") {
                    this.sendNotification(GameProxy.SHOW_MINIGAME, question.keyword);
                    this.gameScreen.showMiniGame = true;
                }
            }
            else {
                this.gameScreen.sceneGroup.visible = true;
                this.gameScreen.questionGroup.visible = false;
                this.gameScreen.plotRes = plot.res;
                this.gameScreen.description = plot.description;
                
                if (plot.type == plotType.sceneChange) {

                }
                else if (plot.type == plotType.sceneAdd) {

                }
                else if (plot.type == plotType.textChange) {

                }

                if (plot.talkId) {
                    this.gameScreen.plotSelectList.visible = true;
                    let plotOption = this.plotOptions.get(plot.talkId.toString());
                    console.log(plotOption)
                    this.gameScreen.question = plotOption.question;
                    let options = [
                        {
                            option: plotOption.option1,
                            result: plotOption.result1
                        },
                        {
                            option: plotOption.option2,
                            result: plotOption.result2
                        }
                    ]
                    this.gameScreen.plotSelectList.dataProvider = new eui.ArrayCollection(options);
                    this.gameScreen.plotSelectList.itemRenderer = QuestionSelectItemRenderer;
                    this.gameScreen.scrollGroup.height = 180;
                }
            }
        }

        public selectItem() {
            if (+this.gameScreen.plotSelectList.selectedItem.result > 0) {
                this.proxy.pointHunag += this.gameScreen.plotSelectList.selectedItem.result;
            }
            else {
                this.proxy.pointMu -= this.gameScreen.plotSelectList.selectedItem.result;
            }
            this.nextTestClick();
        }

        public showRightResult() {
            this.gameScreen.description = this.rightText;
            this.showResult = true;
            egret.setTimeout(() => {
                this.nextTestClick();
            }, this, 1500);
        }

        public nextTestClick() {
            this.id++;
            this.initData();
        }

        public btnTipsClick() {
            if (!this.showPointsNum) {
                this.gameScreen.points = this.questionPoints[0];
                this.showPointsNum++;
            }
            else if (this.showPointsNum == 1) {
                this.gameScreen.points = this.questionPoints[1];
                this.showPointsNum;
            }
            else {
                this.gameScreen.points = "";
                this.showPointsNum = 0;
            }
        }

        private beforeX: number;
        private beforeY: number;
        private touchBeginTime: number;
        private touchBegin(e: egret.TouchEvent): void {
            console.log("TOUCH_BEGIN", e.stageX)
            e.stopImmediatePropagation();
            this.beforeX = e.stageX;
            this.beforeY = e.stageY;
            this.touchBeginTime = new Date().getTime();
        }
        private touchEnd(e: egret.TouchEvent): void {
            console.log("TOUCH_END", e.stageX)
            e.stopImmediatePropagation();
            if (!this.isQuestion && e.stageX < this.beforeX && Math.abs(e.stageY - this.beforeY) < 20) {
                this.nextTestClick();
            }
        }
        private touchReleaseOutside(e: egret.TouchEvent): void {

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