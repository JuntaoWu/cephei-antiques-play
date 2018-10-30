
module game {

    export class GameScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "GameScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(GameScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.loadResGroup();

            this.gameScreen.textGroup.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
            this.gameScreen.textGroup.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
            this.gameScreen.plotSelectList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);

            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextTestClick, this);
            this.gameScreen.btnTips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnTipsClick, this);

            this.gameScreen.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnBackClick, this);
            this.gameScreen.btnSave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnSaveClick, this);
            this.gameScreen.btnManage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnManageClick, this);
            this.gameScreen.btnPicture.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pictClick, this);
            this.gameScreen.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);

            this.gameScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        private loadResGroup() {
            const chapterResGroup = [0, 34, 69, 133, 184, 223];
            for (let i = 5; i >= 0; i--) {
                if (this.proxy.playerInfo.plotId > chapterResGroup[i]) {
                    try {
                        RES.loadGroup(`chapter${i}`, 0);
                    }
                    catch (err) {
                        console.log(err);
                    }
                    return;
                }
            }
        }

        private _plotOptions: Map<string, any>;
        public get plotOptions(): Map<string, any> {
            if (!this._plotOptions) {
                this._plotOptions = new Map(Object.entries(RES.getRes("plot-options_json")));
            }
            return this._plotOptions;
        }

        public canGoNext: boolean;
        public questionPoints: Array<string>;
        public rightText: string;
        public showPointsAll: boolean;
        public addScene: eui.Image;
        public textIsOver: boolean;
        public wordList: Array<string>;
        public next: number | string;

        public initData() {
            this.gameScreen.bottomGroup.visible = this.gameScreen.plotSelectList.visible = this.gameScreen.textGroup.visible = false;
            this.gameScreen.showMiniGame = this.gameScreen.showTransition = this.canGoNext = false;
            this.gameScreen.question = this.gameScreen.points = "";
            this.gameScreen.scrollGroup.height = 450;
            this.gameScreen.scrollGroup.viewport.scrollV = 0;

            let barH = this.gameScreen.huangAndMubar.getChildByName("huangyanyan") as eui.Image;
            let barM = this.gameScreen.huangAndMubar.getChildByName("munai") as eui.Image;
            barH.width = this.gameScreen.huangAndMubar.width * this.proxy.pointHunag / 86;
            barM.width = this.gameScreen.huangAndMubar.width * this.proxy.pointMu / 86;

            let plot: Plot = this.proxy.getCurrentPlot();
            if (!plot) {
                return;
            }
            // 选择不同对话下一条和不同结局
            this.next = plot.next || 1;
            if (plot.type == plotType.PlotQuestion) {
                this.gameScreen.showScene = false;
                this.gameScreen.questionGroup.visible = this.gameScreen.textGroup.visible = true;

                this.playAnim();

                let question: QuestionGame = { ...this.proxy.questions.get(plot.questionId.toString()) };
                this.gameScreen.questionRes = question.img;
                this.gameScreen.description = question.description;
                this.gameScreen.question = question.question;

                this.rightText = question.right;
                this.questionPoints = [question.points1, question.points2];
                this.showPointsAll = this.gameScreen.showPoints = false;
                let hintCardsLabel = (this.gameScreen.btnTips.getChildByName("hintGroup") as eui.Group).getChildByName("hintCards") as eui.BitmapLabel;
                hintCardsLabel.text = this.proxy.playerInfo.hints.toString();

                this.gameScreen.scrollGroup.height = 150;
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
            else if (plot.type == plotType.Transition) {
                this.gameScreen.showTransition = true;
                this.gameScreen.transitionText = plot.effect;
                this.loadResGroup();
                egret.setTimeout(() => {
                    this.showNext();
                }, this, 2000);
            }
            else if (plot.type == "界面切换经营") {
                this.showNext();
            }
            else {
                this.gameScreen.showScene = this.gameScreen.textGroup.visible = true;
                this.gameScreen.questionGroup.visible = false;
                //搭建剧情场景
                this.settingScene(plot.res, plot.portrait, plot.effect, plot.effectTrigger);
                //剧情文字变化
                if (plot.type != plotType.PlotAdded) {
                    this.gameScreen.description = "";
                }
                if (plot.description) {
                    this.textIsOver = false;
                    this.wordList = plot.description.split("");
                    this.addWordToDescription();
                }
                //选项
                if (plot.talkId) {
                    this.showPlotOption(plot.talkId);
                }
                //音效
                if (plot.sound) {
                    let timeout = +plot.playTime * 1000;
                    egret.setTimeout(() => {
                        SoundPool.playSoundEffect(plot.sound);
                    }, this, timeout);
                }
                //自动跳到下一条
                if (plot.autoNextTime) {
                    let timeout = +plot.autoNextTime * 1000;
                    egret.setTimeout(() => {
                        this.showNext();
                    }, this, timeout);
                }
            }
        }

        public settingScene(res: string, addType?: string, effect?: string, effectTigger?: string) {
            let added = this.gameScreen.sceneGroup.getChildByName("added") || this.gameScreen.sceneGroup.parent.getChildByName("added");
            if (!!added) { //移除某些效果添加的元素
                added.parent.removeChild(added);
            }
            egret.Tween.removeAllTweens();  //移除所有动画效果
            this.gameScreen.sceneBg.horizontalCenter = 0;
            this.gameScreen.sceneBg.y = 0;
            this.gameScreen.sceneBg.alpha = 1;
            this.gameScreen.sceneAddGroup.removeChildren();
            let sceneResList = res.split("、");
            sceneResList.forEach((v, i) => {
                if (!this.proxy.playerInfo.collectedScenes.includes(v)) {
                    this.proxy.playerInfo.collectedScenes.push(v);
                }
                if (!i) {
                    this.gameScreen.sceneBg.source = v;
                    if (v == effectTigger) {
                        EffectManager.playEffect.call(this.gameScreen.sceneBg, effect);
                    }
                }
                else {
                    let img = new eui.Image();
                    img.source = v;
                    img.alpha = 1;
                    if (!addType) {
                        img.scaleX = img.scaleY = 0.5;
                    }
                    else {
                        img.scaleX = img.scaleY = 1;
                    }
                    img.y = 135;
                    img.x = 180 * (i - 1);
                    this.gameScreen.sceneAddGroup.addChild(img);
                    if (v == effectTigger) {
                        EffectManager.playEffect.call(img, effect);
                    }
                }
            })
            if (effectTigger == "all") {
                EffectManager.playEffect.call(this.gameScreen.sceneGroup, effect);
            }
        }

        public addWordToDescription() {
            if (!this.wordList.length) {
                this.canGoNext = true;
            }
            else if (this.textIsOver) {
                this.gameScreen.description += this.wordList.join("");
                this.wordList = [];
                this.canGoNext = true;
            }
            else {
                let str = this.wordList.shift();
                this.gameScreen.description = this.gameScreen.description + str;
                egret.setTimeout(() => {
                    this.addWordToDescription();
                }, this, 100)
            }
            let bottomHeight = this.gameScreen.scrollGroup.viewport.contentHeight - this.gameScreen.scrollGroup.height;
            this.gameScreen.scrollGroup.viewport.scrollV = Math.max(0, bottomHeight);
        }

        public showPlotOption(talkId) {
            this.gameScreen.plotSelectList.visible = true;
            this.gameScreen.scrollGroup.height = 280;
            let plotOption = this.plotOptions.get(talkId.toString());
            if (plotOption) {
                this.gameScreen.question = plotOption.question || "";
                let options = [
                    {
                        option: plotOption.option1,
                        result: plotOption.result1,
                        next: 1
                    },
                    {
                        option: plotOption.option2,
                        result: plotOption.result2,
                        next: 2
                    }
                ]
                this.gameScreen.plotSelectList.dataProvider = new eui.ArrayCollection(options);
                this.gameScreen.plotSelectList.itemRenderer = QuestionSelectItemRenderer;
            }
            egret.setTimeout(() => {
                let bottomHeight = this.gameScreen.scrollGroup.viewport.contentHeight - this.gameScreen.scrollGroup.height;
                this.gameScreen.scrollGroup.viewport.scrollV = Math.max(0, bottomHeight);
            }, this, 100)
        }

        public bb: eui.Image;
        public selectItem() {
            let point = +this.gameScreen.plotSelectList.selectedItem.result;
            this.bb = new eui.Image();
            this.bb.source = "heart";
            this.bb.x = 320;
            this.bb.y = 1000;
            this.gameScreen.addChild(this.bb);
            if (point > 0) {
                egret.Tween.get(this.bb).to({ x: 20, y: 150 }, 1000);
            } else {
                egret.Tween.get(this.bb).to({ x: 590, y: 150 }, 1000);
            }
            egret.setTimeout(() => {
                this.gameScreen.removeChild(this.bb);
                this.showNext();
            }, this, 1300);
            this.proxy.pointHunag += point;
            this.proxy.pointMu -= point;
            this.next = this.gameScreen.plotSelectList.selectedItem.next;

        }

        public aa: eui.Image;
        public answer_right() {
            this.aa = new eui.Image();
            this.aa.source = "answer_right";
            this.aa.verticalCenter = -100;
            this.aa.horizontalCenter = 0;
            this.aa.scaleX = 0.01;
            this.aa.scaleY = 0.01;
            this.gameScreen.addChild(this.aa);
            egret.Tween.get(this.aa).to({ scaleX: 1, scaleY: 1 }, 1500);
        }

        public showRightResult() {
            this.gameScreen.description = this.rightText;
            this.canGoNext = true;
            this.gameScreen.removeChild(this.aa);
            // egret.setTimeout(() => {
            //     this.showNext();
            // }, this, 1500);
        }

        public showNext() {
            if (this.proxy.playerInfo.fatigueValue <= 0) {
                return;
            }
            if (this.next == "over") { //最后有两个不同结局
                if (this.proxy.pointMu > this.proxy.pointHunag) {
                    this.proxy.nextPlot(2);
                }
                else {
                    this.proxy.nextPlot();
                }
            }
            else {
                this.proxy.nextPlot(this.next as number);
            }
            this.initData();
        }

        public btnTipsClick() {
            this.gameScreen.showPoints = !this.gameScreen.showPoints;
            if (!this.gameScreen.showPoints) return;
            if (!this.proxy.playerInfo.hints) {
                this.gameScreen.points = "没有提示卡";
                return;
            }
            if (this.gameScreen.points) {
                this.showPointsAll = true;
            }
            this.gameScreen.points = !this.gameScreen.points ? this.questionPoints[0] : `${this.questionPoints[0]}\n${this.questionPoints[1]}`;
            if (!this.showPointsAll) {
                this.proxy.reduceHints();
                let hintCardsLabel = (this.gameScreen.btnTips.getChildByName("hintGroup") as eui.Group).getChildByName("hintCards") as eui.BitmapLabel;
                hintCardsLabel.text = this.proxy.playerInfo.hints.toString();
            }
        }

        public btnBackClick() {
            this.sendNotification(SceneCommand.CHANGE, Scene.Start);
        }

        public btnSaveClick() {
            this.proxy.savePlayerInfoToStorage();
        }

        public btnManageClick() {
            this.sendNotification(SceneCommand.SHOW_MANAGE);
        }

        public pictClick() {
            this.sendNotification(game.SceneCommand.SHOW_SCENE);
        }

        private beforeX: number;
        private beforeY: number;
        private touchBeginTime: number;
        private touchBegin(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            this.beforeX = e.stageX;
            this.beforeY = e.stageY;
            this.touchBeginTime = new Date().getTime();
        }
        private touchEnd(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            this.textIsOver = true;
            if (!this.canGoNext) {
                return;
            }
            let touchEndTime = new Date().getTime();
            if (e.stageX < this.beforeX - 20 && Math.abs(e.stageY - this.beforeY) < 20 || touchEndTime - this.touchBeginTime < 300) {
                this.showNext();
            }
        }
        private touchReleaseOutside(e: egret.TouchEvent): void {

        }

        public nextTestClick() {
            this.textIsOver && this.showNext();
            this.textIsOver = true;
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.PASS_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.PASS_MINIGAME:
                    this.answer_right();
                    egret.setTimeout(this.showRightResult, this, 1800);
                    break;
            }
        }

        public get gameScreen(): GameScreen {
            return <GameScreen><any>(this.viewComponent);
        }

        public share() {
            platform.shareAppMessage();
        }

        public armatureDisplay: dragonBones.EgretArmatureDisplay;
        public heiban: eui.Image;
        public async playAnim() {
            this.heiban = new eui.Image;
            this.heiban.source = "heiban";
            this.gameScreen.addChild(this.heiban);
            if (!this.armatureDisplay) {
                this.armatureDisplay = DragonBones.createDragonBone("jiemi", "Armature");
                this.armatureDisplay.addEventListener( dragonBones.EventObject.COMPLETE, () => {
                    this.heiban && this.gameScreen.removeChild(this.heiban);
                    this.gameScreen.removeChild(this.armatureDisplay);
                }, this);
            }
            this.armatureDisplay.x = 360;
            this.armatureDisplay.y = 800;
            this.gameScreen.addChild(this.armatureDisplay);
            this.armatureDisplay.animation.play("newAnimation", 1);
        }
    }
}