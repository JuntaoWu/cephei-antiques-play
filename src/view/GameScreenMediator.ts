
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

            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showNext, this);
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

        public id: number = 8;
        public showResult: boolean;
        public isQuestion: boolean;
        public questionId: number;
        public questionPoints: Array<string>;
        public rightText: string;
        public showPointsNum: number;
        public addScene: eui.Image;
        public textIsOver: boolean;
        public wordList: Array<string>;

        public initData() {
            this.gameScreen.bottomGroup.visible = this.gameScreen.plotSelectList.visible = false;
            this.gameScreen.showMiniGame = this.showResult = this.isQuestion = false;
            this.gameScreen.question = this.gameScreen.points = "";
            this.gameScreen.scrollGroup.height = 480;
            this.gameScreen.scrollGroup.viewport.scrollV = 0;
            
            let barH = this.gameScreen.huangAndMubar.getChildByName("huangyanyan") as eui.Image;
            let barM = this.gameScreen.huangAndMubar.getChildByName("munai") as eui.Image;
            barH.width = this.gameScreen.huangAndMubar.width * this.proxy.pointHunag / (this.proxy.pointHunag + this.proxy.pointMu);
            barM.width = this.gameScreen.huangAndMubar.width * this.proxy.pointMu / (this.proxy.pointHunag + this.proxy.pointMu);

            let plot: Plot, question: QuestionGame;
            if (!this.proxy.chapterPlot.get(this.id.toString())) {
                // return;
            }
            plot = {
                ...this.proxy.chapterPlot.get(this.id.toString())
            }
            // console.log(plot);
            if (plot.type == plotType.Question || !plot.type) {
                this.gameScreen.showScene = false;
                this.gameScreen.questionGroup.visible = this.isQuestion = true;

                this.questionId = plot.questionId || this.questionId + 1;
                console.log(plot.questionId, this.questionId)
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
                this.gameScreen.showScene = true;
                this.gameScreen.questionGroup.visible = false;

                //剧情文字变化
                if (plot.type != plotType.SceneAdded) {
                    this.gameScreen.description = "";
                }
                if (!!plot.description) {
                    this.textIsOver = false;
                    this.wordList = plot.description.replace(/^\s+|\s+$/, "").split("");
                    this.addWordToDescription();
                }
                //场景变化
                if (plot.type == plotType.ChangeScene) {
                    this.gameScreen.plotRes = plot.res;
                    if (this.addScene) {
                        this.gameScreen.sceneGroup.removeChild(this.addScene);
                        this.addScene = null;
                    }
                }
                else if (plot.type == plotType.AddScene) {
                    if (!this.addScene) {
                        this.addScene = new eui.Image();
                    }
                    this.addScene.source = plot.res;
                    this.addScene.scaleX = this.addScene.scaleY = 0.5;
                    this.addScene.horizontalCenter = 0;
                    this.addScene.y = 135;
                    this.gameScreen.sceneGroup.addChild(this.addScene);
                }
                else if (plot.type == plotType.DeleteScene) {
                    if (!plot.effect) {
                        this.addScene && this.gameScreen.sceneGroup.removeChild(this.addScene);
                        this.addScene = null;
                    }
                }
                //场景效果
                if (plot.res == this.gameScreen.sceneImg.source) {
                    EffectManager.playEffect.call(this.gameScreen.sceneImg, plot.effect);
                }
                else {
                    this.addScene && EffectManager.playEffect.call(this.addScene, plot.effect);
                }
                //音效
                if (plot.sound) {
                    let timeout = +plot.playTime * 1000;
                    egret.setTimeout(() => {
                        SoundPool.playSoundEffect(plot.sound);
                    }, this, timeout);
                }
                //选项
                if (plot.talkId) {
                    this.gameScreen.plotSelectList.visible = this.isQuestion = true;
                    this.gameScreen.scrollGroup.height = 280;
                    let plotOption = this.plotOptions.get(plot.talkId.toString());
                    if (plotOption) {
                        this.gameScreen.question = plotOption.question || "";
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
                    }
                }
                //场景图
                if (!this.gameScreen.plotRes) {
                    let historyId = this.id - 1;
                    while (!this.gameScreen.plotRes && historyId > 0) {
                        let plotHistory = this.proxy.chapterPlot.get(historyId.toString());
                        if (plotHistory.type == plotType.ChangeScene) {
                            this.gameScreen.plotRes = plotHistory.res;
                        }
                        historyId--;
                    }
                }
                //自动跳到下一条
                if (plot.autoNextTime) {
                    let timeout = +plot.autoNextTime * 1000;
                    console.log(timeout)
                    egret.setTimeout(() => {
                        this.showNext();
                    }, this, timeout);
                }
            }
        }

        public addWordToDescription() {
            if (!this.wordList.length) {
                this.textIsOver = true;
            }
            else if (this.textIsOver) {
                this.gameScreen.description += this.wordList.join("");
                this.wordList = [];
            }
            else {
                let str = this.wordList.shift();
                this.gameScreen.description = this.gameScreen.description + str;
                egret.setTimeout(() => {
                    this.addWordToDescription();
                }, this, 100)
            }
        }

        public selectItem() {
            if (+this.gameScreen.plotSelectList.selectedItem.result > 0) {
                this.proxy.pointHunag += this.gameScreen.plotSelectList.selectedItem.result;
            }
            else {
                this.proxy.pointMu -= this.gameScreen.plotSelectList.selectedItem.result;
            }
            this.showNext();
        }

        public showRightResult() {
            this.gameScreen.description = this.rightText;
            this.showResult = true;
            egret.setTimeout(() => {
                this.showNext();
            }, this, 1500);
        }

        public showNext() {
            if (!this.textIsOver) {
                this.textIsOver = true;
                return;
            }
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
            // console.log("TOUCH_BEGIN", e.stageX)
            e.stopImmediatePropagation();
            this.beforeX = e.stageX;
            this.beforeY = e.stageY;
            this.touchBeginTime = new Date().getTime();
        }
        private touchEnd(e: egret.TouchEvent): void {
            // console.log("TOUCH_END", e.stageX)
            e.stopImmediatePropagation();
            if (!this.textIsOver) {
                this.textIsOver = true;
                return;
            }

            let touchEndTime = new Date().getTime();
            if (!this.isQuestion && (e.stageX < this.beforeX - 20 && Math.abs(e.stageY - this.beforeY) < 20 || touchEndTime - this.touchBeginTime < 300)) {
                this.showNext();
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