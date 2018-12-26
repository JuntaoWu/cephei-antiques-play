
namespace ap {

    export class NewPlayerGuideMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "NewPlayerGuideMediator";

        private proxy: GameProxy;
        public change: Change;

        public constructor(viewComponent: any) {
            super(NewPlayerGuideMediator.NAME, viewComponent);
            super.initializeNotifier("ApApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.initData();
            this.guideWindow.btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
            this.guideWindow.btnSkip.addEventListener(egret.TouchEvent.TOUCH_TAP, this.closeWindow, this);
            this.guideWindow.yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yes, this);
            this.guideWindow.no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.no, this);
        }

        private _guides: Array<any>;
        private _index: number;
        
        public initData() {
            this.trueAndFalseUIList = [];
            for (let i = 1; i < 10; i++) {
                let group = this.guideWindow.group5.getChildByName(`card${i}`) as eui.Group;
                this.trueAndFalseUIList.push(group);
            }
            [2, 4, 9].forEach(i => {
                let group = this.guideWindow.group5.getChildByName(`card${i}`) as eui.Group;
                group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.trueFalseSelect, this);
            })
            this._guides = RES.getRes("guide_json");
            this._index = 0;
            this.setPage();
        }

        public setPage() {
            console.log(this._index, this._guides);
            let guide = this._guides[this._index];
            if (!guide) return;
            console.log("set page");
            this.guideWindow.dialogGroup.bottom = 0;        
            this.guideWindow.dialogGroup.visible = this.guideWindow.btnNext.visible = this.guideWindow.eventGroup.visible = true;
            this.guideWindow.group1.visible = this.guideWindow.group2.visible 
            = this.cannotNext = this.guideWindow.group3.visible 
            = this.guideWindow.group4.visible = this.guideWindow.showAntiEllipse
            = this.guideWindow.group5.visible = this.guideWindow.moneyGroup.visible
            = this.guideWindow.antiGroup.visible = this.guideWindow.clockGroup.visible
            = this.guideWindow.optionGroup.visible = this.guideWindow.btnPlotGroup.visible = false;

            const textElements = new egret.HtmlTextParser().parser(guide.content);
            this.guideWindow.dialog.textFlow = textElements;
            this.guideWindow.dialogImg = "";
            switch (guide.type) {
                case "图片":
                    if (guide.content == "guide-img1") {
                        this.guideWindow.moneyGroup.visible = true;
                    }
                    this.guideWindow.dialogImg = guide.content;
                    this.guideWindow.dialog.textFlow = null;
                    break;
                case "古董图标":
                    this.guideWindow.bao1.visible = this.guideWindow.bao2.visible 
                    = this.guideWindow.bao3.visible = this.guideWindow.bao4.visible = false;
                    this.guideWindow.antiGroup.visible = this.guideWindow.showAntiEllipse = true;
                    break;
                case "回合图标":
                    this.guideWindow.clockGroup.visible = true;
                    break;
                case "找不同":
                    this.guideWindow.eventGroup.visible = false;
                    this.guideWindow.group1.visible = true;
                    break;
                case "找相同":
                    this.guideWindow.eventGroup.visible = false;
                    this.guideWindow.group2.visible = true;
                    break;
                case "找异类":
                    this.guideWindow.eventGroup.visible = false;
                    this.guideWindow.group3.visible = true;
                    break;
                case "找同类":
                    this.guideWindow.eventGroup.visible = false;
                    this.guideWindow.group4.visible = true;
                    break;
                case "真假判别":
                    this.guideWindow.eventGroup.visible = false;
                    this.trueFalseGame();
                    break;
                case "剧情图标":
                    this.guideWindow.btnPlotGroup.visible = true;
                    break;
                case "好友对话事件":
                    this.showFriend = this.cannotNext = true;
                    break;
            }
        }

        public closeWindow() {
            this._index = 0;
            this.setPage();
            this.proxy.playerInfo.isShowGuide = false;
            this.proxy.savePlayerInfoToStorage();
            this.guideWindow.close();
            this.sendNotification(SceneCommand.SHOW_MANAGE);
        }

        public next() {
            if (this.cannotNext) {
                if (this.isTrueFalseGame) {
                    this.guideWindow.dialogGroup.visible = this.isTrueFalseGame = false;
                    this.guideWindow.btnNext.visible = false;
                    this.moveCards();
                }
                else if (this.showFriend) {
                    this.guideWindow.dialogGroup.visible = this.isTrueFalseGame = this.guideWindow.btnNext.visible = false;
                    this.showFriendEvent();
                }
                return;
            }
            this._index += 1;
            if (this._index > this._guides.length) {
                this.closeWindow();
            }
            else {
                this.setPage();
            }
        }

        public showFriend: boolean;
        public showFriendEvent() {
            this.guideWindow.antiGroup.visible = this.guideWindow.optionGroup.visible = true;

        }

        public cannotNext: boolean;
        public xuanze: number;
        public yes() {
            if (this.xuanze != 1) {
                this.guideWindow.bao1.visible = this.guideWindow.bao2.visible = this.guideWindow.bao3.visible = this.guideWindow.bao4.visible = true;
                this.guideWindow.yes.scaleX = 0.8;
                this.guideWindow.yes.scaleY = 0.8;
                this.guideWindow.no.scaleX = 1;
                this.guideWindow.no.scaleY = 1;
                this.xuanze = 1;
            } else {
                this.guideWindow.yes.scaleX = 1;
                this.guideWindow.yes.scaleY = 1;
                this.xuanze = 0;
                this.guideWindow.gu1.text = "7";
                this.guideWindow.gu2.text = "6";
                this.guideWindow.gu3.text = "9";
                this.guideWindow.gu4.text = "7";
                this.guideWindow.coll1.text = "2";
                this.guideWindow.coll2.text = "4";
                this.guideWindow.coll3.text = "6";
                this.guideWindow.coll4.text = "5";
                this.cannotNext = false;
                this.next();
            }
        }

        public no() {
            if (this.xuanze != 2) {
                this.guideWindow.bao1.visible = this.guideWindow.bao2.visible = this.guideWindow.bao3.visible = this.guideWindow.bao4.visible = true;
                this.guideWindow.no.scaleX = 0.8;
                this.guideWindow.no.scaleY = 0.8;
                this.guideWindow.yes.scaleX = 1;
                this.guideWindow.yes.scaleY = 1;
                this.xuanze = 2;
            } else {
                this.guideWindow.no.scaleX = 1;
                this.guideWindow.no.scaleY = 1;
                this.xuanze = 0;
                this.guideWindow.gu1.text = "3";
                this.guideWindow.gu2.text = "6";
                this.guideWindow.gu3.text = "4";
                this.guideWindow.gu4.text = "7";
                this.guideWindow.coll1.text = "2";
                this.guideWindow.coll2.text = "3";
                this.guideWindow.coll3.text = "2";
                this.guideWindow.coll4.text = "5";
                this.cannotNext = false;
                this.next();
            }
        }

        public isTrueFalseGame: boolean;
        public trueFalseGame() {
            this.guideWindow.group5.visible = this.cannotNext =  this.isTrueFalseGame = true; 
            this.canSelectedCard = false;       
            this.trueAndFalseUIList.forEach(i => {
                let img = i.getChildByName("img") as eui.Image;
                img.source = "manage-card2";
                i.addChildAt(img, 0);
            });
        }
        
        public trueAndFalseUIList: Array<eui.Group>;
        public moveCards() {
            this.clickTime = 0;
            this.trueAndFalseUIList.forEach(i => {
                let img = i.getChildByName("img") as eui.Image;
                i.addChild(img);
                egret.Tween.get(img).to({ scaleX: 0.5 }, 500).call(() => {
                    img.source = "manage-card1";
                    egret.Tween.get(img).to({ scaleX: 1 }, 500);
                });
            });
            [2, 4, 9].forEach(i => {
                let group = this.guideWindow.group5.getChildByName(`card${i}`) as eui.Group;
                group.scaleX = group.scaleY = 1;
            });
            egret.setTimeout(() => {
                this.transferCards(5);
            }, this, 1000)
        }

        public transferCards(num: number) {
            if (num < 1) {
                this.canSelectedCard = true;
                [2, 4, 9].forEach(i => {
                    let group = this.guideWindow.group5.getChildByName(`card${i}`) as eui.Group;
                    egret.Tween.get(group, {loop: true}).to({ scaleX: 0.9, scaleY: 0.9 }, 500).to({ scaleX: 1, scaleY: 1 }, 500);
                })
                return;
            }
            let leftTime = num - 1;
            let randomIndex = _.random(0, 8);
            let swapIndex = _.random(0, 8);
            while (randomIndex == swapIndex) {
                swapIndex = _.random(0, 8);
            }
            let randomX = this.trueAndFalseUIList[randomIndex].x;
            let randomY = this.trueAndFalseUIList[randomIndex].y;
            let swapX = this.trueAndFalseUIList[swapIndex].x;
            let swapY = this.trueAndFalseUIList[swapIndex].y;
            this.guideWindow.group5.addChild(this.trueAndFalseUIList[randomIndex]);
            this.guideWindow.group5.addChild(this.trueAndFalseUIList[swapIndex]);
            egret.Tween.get(this.trueAndFalseUIList[randomIndex]).to({ x: swapX, y: swapY }, 800);
            egret.Tween.get(this.trueAndFalseUIList[swapIndex]).to({ x: randomX, y: randomY }, 800).call(() => {
                this.transferCards(leftTime);
            });
        }

        public canSelectedCard: boolean;
        public clickTime: number;
        public trueFalseSelect(e: egret.TouchEvent) {
            if (!this.canSelectedCard) return;
            egret.Tween.removeTweens(e.currentTarget);
            e.currentTarget.scaleX = e.currentTarget.scaleY = 1;
            let currentImg = e.currentTarget.getChildByName("img") as eui.Image;
            currentImg.source = "manage-card2";
            e.currentTarget.addChildAt(currentImg, 0);
            this.clickTime = !this.clickTime ? 1 : this.clickTime + 1;
            if (this.clickTime == 2) {
                egret.Tween.removeAllTweens();
                egret.setTimeout(() => {
                    this.clickTime == 0;
                    this.cannotNext = false;
                    this.guideWindow.btnNext.visible = true;
                    this.next();
                }, this, 300);
            }
        }

        public get guideWindow(): NewPlayerGuide {
            return <NewPlayerGuide><any>(this.viewComponent);
        }
    }
}