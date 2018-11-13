
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

            this.gameScreen.nextTest.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextTestClick, this);

            this.gameScreen.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnBackClick, this);
            // this.gameScreen.btnSave.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnSaveClick, this);
            this.gameScreen.btnManage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnManageClick, this);
            this.gameScreen.btnPicture.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pictClick, this);

            this.gameScreen.btnTips.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnTipsClick, this);
            this.gameScreen.btnHelp.addEventListener(egret.TouchEvent.TOUCH_TAP, this.share, this);

            this.gameScreen.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnResetClick, this);
            this.gameScreen.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnConfirmClick, this);

            this.gameScreen.sceneGroup.addEventListener(egret.TouchEvent.TOUCH_TAP, () => { }, this);

            this.gameScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        private loadResGroup() {
            let chapter = this.proxy.chapterPlot.get(this.proxy.playerInfo.plotId.toString()).chapter;
            console.log(`loadResGroup：chapter${chapter}`)
            try {
                RES.loadGroup(`chapter${chapter}`, 0);
            }
            catch (err) {
                console.log(err);
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
        public questionId: number;
        private timeoutId: number;
        public static manage_show: string = "manage_show";

        public initData() {
            this.gameScreen.miniGame.removeChildren();
            this.aa && this.aa.parent && this.aa.parent.removeChild(this.aa);
            this.gameScreen.bottomGroup.visible = this.gameScreen.plotSelectList.visible
                = this.gameScreen.questionGroup.visible = this.gameScreen.miniGame.visible = false;
            this.gameScreen.showReset = this.gameScreen.showTransition = this.canGoNext = false;
            this.gameScreen.question = this.gameScreen.points = "";
            this.gameScreen.scrollGroup.bottom = 20;
            this.gameScreen.scrollGroup.viewport.scrollV = 0;
            this.gameScreen.fatigueValue.text = this.proxy.playerInfo.fatigueValue.toString();
            this.gameScreen.no_btnmanage.visible = !this.proxy.playerInfo.isManage;
            this.gameScreen.btnManage.visible = this.proxy.playerInfo.isManage;

            let barH = this.gameScreen.huangAndMubar.getChildByName("huangyanyan") as eui.Image;
            let barM = this.gameScreen.huangAndMubar.getChildByName("munai") as eui.Image;
            barH.width = this.gameScreen.huangAndMubar.width * this.proxy.playerInfo.pointHunag / 86;
            barM.width = this.gameScreen.huangAndMubar.width * this.proxy.playerInfo.pointMu / 86;

            let plot: Plot = this.proxy.getCurrentPlot();
            if (!plot) {
                return;
            }
            // 选择不同对话下一条和不同结局
            this.next = plot.next || 1;
            if (this.timeoutId) {
                egret.clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }
            if (plot.type == plotType.PlotQuestion) {
                this.gameScreen.showScene = false;
                this.gameScreen.questionGroup.visible = true;
                this.questionId = plot.questionId;

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

                if (question.type == "填空") {
                    this.gameScreen.bottomGroup.top = 110;
                    this.gameScreen.bottomGroup.visible = this.gameScreen.showReset = true;
                    this.gameScreen.showInput(question.id, question.answer);
                }
                else if (question.type == "选择") {
                    this.gameScreen.bottomGroup.visible = true;
                    this.gameScreen.showSelect(question.optionsId);
                }
                else if (question.type == "小游戏") {
                    this.gameScreen.bottomGroup.top = 0;
                    this.sendNotification(GameProxy.SHOW_MINIGAME, question);
                    this.gameScreen.miniGame.visible = this.gameScreen.showReset = true;
                }
                this.gameScreen.scrollGroup.bottom = this.gameScreen.footGroup.height;
                this.gameScreen.scrollGroup.viewport.scrollH = 0;
            }
            else if (plot.type == plotType.Transition) {
                this.loadResGroup();
                if (plot.effect != "序章") {
                    if (this.proxy.canReduecePower(30)) {
                        this.proxy.reducePower(30);
                        this.gameScreen.fatigueValue.text = this.proxy.playerInfo.fatigueValue.toString();
                    }
                    else {
                        // platform.showModal("体力不足，不能进入下一章", false);
                        this.sendNotification(SceneCommand.SHOW_POPUP, "需要消耗30点体力才可进入下一章(体力可在商城购买)");
                        this.canGoNext = false;
                        return;
                    }
                }
                this.gameScreen.showTransition = true;
                this.gameScreen.transitionText = plot.effect;
                this.timeoutId = egret.setTimeout(() => {
                    this.showNext();
                }, this, 1500);
            }
            else if (plot.type == "界面切换经营") {
                if (this.proxy.playerInfo.time) {
                    if (!this.proxy.playerInfo.isManage) {
                        this.proxy.playerInfo.isManage = true;
                        this.gameScreen.no_btnmanage.visible = false;
                        this.gameScreen.btnManage.visible = true;
                        // this.proxy.playerInfo.gold = (Number(this.proxy.playerInfo.gold) + 40).toString();
                        this.proxy.goldchange(40);
                    }
                    this.gameScreen.showTransition = true;
                    this.gameScreen.transitionText = "进入经营模式";
                    this.timeoutId = egret.setTimeout(() => {
                        this.gameScreen.showTransition = false;
                        this.btnManageClick();
                    }, this, 1000);
                    this.canGoNext = true;
                }
                else {
                    this.showNext();
                }
            }
            else {
                this.gameScreen.scrollGroup.bottom = 20;
                this.gameScreen.scrollGroup.viewport.scrollV = 0;
                this.gameScreen.showScene = true;
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
                if (this.proxy.playerInfo.sound) {
                    if (plot.sound) {
                        let soundList = plot.sound.split("、");
                        let timeList = plot.playTime.toString().split("、");
                        soundList.forEach((v, i) => {
                            let timeout = +timeList[i].replace("s", "") * 1000;
                            egret.setTimeout(() => {
                                SoundPool.playSoundEffect(v);
                            }, this, timeout);
                        })
                    }
                }
                //自动跳到下一条
                if (plot.autoNextTime) {
                    let timeout = +plot.autoNextTime * 1000;
                    this.timeoutId = egret.setTimeout(() => {
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
            if (!!this.gameScreen.sceneGroup.mask) {
                this.gameScreen.sceneGroup.mask = null;
            }
            egret.Tween.removeAllTweens();  //移除所有动画效果
            this.gameScreen.sceneBg.horizontalCenter = 0;
            this.gameScreen.sceneBg.y = 0;
            this.gameScreen.sceneBg.alpha = this.gameScreen.sceneGroup.alpha = 1;
            this.gameScreen.sceneAddGroup.removeChildren();
            let sceneResList = res.split("、");
            sceneResList.forEach((v, i) => {
                this.proxy.addCollectedScenes(v);
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
                this.gameScreen.plotSelectList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            }
            egret.setTimeout(() => {
                this.gameScreen.scrollGroup.bottom = this.gameScreen.footGroup.height;
                let bottomHeight = this.gameScreen.scrollGroup.viewport.contentHeight - this.gameScreen.scrollGroup.height;
                this.gameScreen.scrollGroup.viewport.scrollV = Math.max(0, bottomHeight);
            }, this, 50)
        }

        public bb: eui.Image;
        public selectItem() {
            let point = +this.gameScreen.plotSelectList.selectedItem.result;
            this.bb = new eui.Image();
            this.bb.source = "heart";
            this.bb.alpha = 1;
            this.bb.x = 320;
            this.bb.y = 1000;
            this.gameScreen.addChild(this.bb);
            if (point > 0) {
                egret.Tween.get(this.bb).to({ x: 20, y: 150 }, 700);
            } else {
                egret.Tween.get(this.bb).to({ x: 590, y: 150 }, 700);
            }
            egret.setTimeout(() => {
                egret.Tween.get(this.bb).to({ alpha: 0 }, 400).call(() => {
                    this.gameScreen.removeChild(this.bb);
                    this.showNext();
                });
            }, this, 700);
            this.proxy.playerInfo.pointHunag += point;
            this.proxy.playerInfo.pointMu -= point;
            if (this.proxy.playerInfo.pointHunag > 86 || this.proxy.playerInfo.pointMu < 0) {
                this.proxy.playerInfo.pointHunag = 86;
                this.proxy.playerInfo.pointMu = 0;
            } else if (this.proxy.playerInfo.pointHunag < 0 || this.proxy.playerInfo.pointMu > 86) {
                this.proxy.playerInfo.pointHunag = 0;
                this.proxy.playerInfo.pointMu = 86;
            }
            this.next = this.gameScreen.plotSelectList.selectedItem.next;
            this.gameScreen.plotSelectList.removeEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
        }

        public aa: eui.Image;

        public showRightResult() {
            this.gameScreen.description = this.rightText;
            this.canGoNext = true;
            this.gameScreen.showReset = false;

            if (!this.aa) {
                this.aa = new eui.Image();
                this.aa.source = "answer_right";
                this.aa.verticalCenter = -100;
                this.aa.horizontalCenter = 0;
            }
            this.aa.scaleX = 0.01;
            this.aa.scaleY = 0.01;
            this.gameScreen.addChild(this.aa);
            egret.Tween.get(this.aa).to({ scaleX: 1, scaleY: 1 }, 1500);
        }

        public showNext() {
            // if (this.proxy.playerInfo.fatigueValue <= 0) {
            //     return;
            // }
            if (this.next == "end") {
                return;
            }
            else if (this.next == "over") { //最后有两个不同结局
                if (this.proxy.playerInfo.pointMu < this.proxy.playerInfo.pointHunag) {
                    this.proxy.nextPlot();
                    this.proxy.addEnding("m1");
                }
                else {
                    this.proxy.nextPlot(2);
                    this.proxy.addEnding("m2");
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
                this.sendNotification(SceneCommand.SHOW_POPUP, "没有提示卡了");
                return;
            }
            if (!this.showPointsAll) {
                this.proxy.reduceHints();
                let hintCardsLabel = (this.gameScreen.btnTips.getChildByName("hintGroup") as eui.Group).getChildByName("hintCards") as eui.BitmapLabel;
                hintCardsLabel.text = this.proxy.playerInfo.hints.toString();
            }
            if (this.gameScreen.points || (!this.questionPoints[0] && !this.questionPoints[1])) {
                this.showPointsAll = true;
            }
            this.gameScreen.points = !this.gameScreen.points ? this.questionPoints[0] : `${this.questionPoints[0]}\n———————————————\n${this.questionPoints[1]}`;
        }

        public btnBackClick() {
            this.sendNotification(SceneCommand.CHANGE, Scene.Start);
        }

        public btnManageClick() {
            if (!this.proxy.playerInfo.time) {
                // platform.showModal("经营模式每日只能完成一次，今日经营模式已完成！", false);
                this.sendNotification(SceneCommand.SHOW_POPUP, "经营模式每日只能完成一次，今日经营模式已完成！");
            }
            else {
                this.sendNotification(SceneCommand.SHOW_MANAGE);
            }
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
            if (!this.textIsOver) {
                this.textIsOver = true;
            }
            else {
                egret.setTimeout(() => {
                    this.showNext();
                }, this, 150);
            }
        }

        public btnResetClick() {
            this.sendNotification(GameProxy.RESET_MINIGAME, this.questionId);
        }

        public btnConfirmClick() {
            if (this.proxy.playerInfo.fatigueValue <= 0) {
                this.sendNotification(SceneCommand.SHOW_POPUP, "没有体力破解谜题了！");
                return;
            }
            this.sendNotification(GameProxy.CONFIRM_MINIGAME, this.questionId);
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.PASS_MINIGAME, GameProxy.REDUCE_POWER];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.PASS_MINIGAME:
                    this.showRightResult();
                    break;
                case GameProxy.REDUCE_POWER:
                    if (this.proxy.canReduecePower(10)) {
                        this.proxy.reducePower(10);
                        this.gameScreen.fatigueValue.text = this.proxy.playerInfo.fatigueValue.toString();
                        try {
                            // platform.showModal("答案错误，扣除10点体力！", false).then(() => {
                            //     this.btnResetClick();
                            // });
                            this.sendNotification(SceneCommand.SHOW_POPUP, "答案错误，扣除10点体力！");
                            this.btnResetClick();
                        }
                        catch (err) {
                            console.log(err);
                        }
                    }
                    else {
                        this.sendNotification(SceneCommand.SHOW_POPUP, "没有体力了！");
                    }
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
                this.armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE, () => {
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