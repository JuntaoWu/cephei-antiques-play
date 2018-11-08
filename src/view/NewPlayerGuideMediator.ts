
module game {

    export class NewPlayerGuideMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "NewPlayerGuideMediator";

        private proxy: GameProxy;
        public change: Change;

        public constructor(viewComponent: any) {
            super(NewPlayerGuideMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.initData();
            this.guideWindow.addEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
        }

        private _guides: Array<any>;
        private _index: number;
        
        public initData() {
            this._guides = RES.getRes("guide_json");
            this._index = 0;
            this.setPage();
        }

        public setPage() {
            this.guideWindow.dialogGroup.visible = true;
            this.guideWindow.group1.visible = this.guideWindow.group2.visible 
            = this.guideWindow.group3.visible = this.guideWindow.group4.visible
            = this.guideWindow.group5.visible = this.guideWindow.moneyGroup.visible
            = this.guideWindow.antiGroup.visible = this.guideWindow.clockGroup.visible = false;
            let guide = this._guides[this._index];
            const textElements = new egret.HtmlTextParser().parser(guide.content);
            this.guideWindow.dialog.textFlow = textElements;
            switch (guide.type) {
                case "青豆图标":
                    this.guideWindow.moneyGroup.visible = true;
                    break;
                case "古董图标":
                    this.guideWindow.antiGroup.visible = true;
                    break;
                case "回合图标":
                    this.guideWindow.clockGroup.visible = true;
                    break;
                case "找不同":
                    this.guideWindow.group1.visible = true;
                    break;
                case "找相同":
                    this.guideWindow.group2.visible = true;
                    break;
                case "找异类":
                    this.guideWindow.group3.visible = true;
                    break;
                case "找同类":
                    this.guideWindow.group4.visible = true;
                    break;
                case "真假判别":
                    this.guideWindow.group5.visible = this.isTrueFalseGame = true;
                    this.trueFalseGame();
                    break;
                case "随机事件":

                    break;
                case "好友对话事件":

                    break;
            }
        }

        public next() {
            if (this.guideWindow.group5.visible) {
                if (this.isTrueFalseGame) {
                    this.guideWindow.dialogGroup.visible = this.isTrueFalseGame = false;
                    this.moveCards();
                }
                return;
            }
            this._index += 1;
            if (this._index >= this._guides.length) {
                this.guideWindow.close();
                this.sendNotification(SceneCommand.SHOW_MANAGE);
            }
            else {
                this.setPage();
            }
        }

        public isTrueFalseGame: boolean;
        public trueFalseGame() {
            this.trueAndFalseUIList = [];
            let trueFalseList = [
                true, true, false
                , true, false, true
                , false, true, true
            ]
            trueFalseList.forEach((v, i) => {
                let img = new eui.Image();
                img.source = "manage-card2";
                img.name = "img";
                let textLabel = new eui.Label();
                textLabel.text = v ? "真" : "假";
                textLabel.size = 60;
                textLabel.horizontalCenter = 0;
                textLabel.verticalCenter = 0;
                let group = new eui.Group();
                group.addChild(img);
                group.addChild(textLabel);
                group.name = i.toString();
                group.x = i % 3 ? 215 * (i % 3) : 0;
                group.y = (i - i % 3) / 3 ? 280 * ((i - i % 3) / 3) : 0;
                this.guideWindow.group5.addChild(group);
                !v && group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.trueFalseSelect, this);
                this.trueAndFalseUIList.push(group);
            })
        }
        
        public trueAndFalseUIList: Array<eui.Group>;
        public moveCards() {
            this.trueAndFalseUIList.forEach(i => {
                let img = i.getChildByName("img") as eui.Image;
                i.addChild(img);
                egret.Tween.get(img).to({ scaleX: 0.5 }, 500).call(() => {
                    img.source = "manage-card1";
                    egret.Tween.get(img).to({ scaleX: 1 }, 500);
                });
            })
            egret.setTimeout(() => {
                this.transferCards(5);
            }, this, 1000)
        }

        public transferCards(num: number) {
            if (num < 1) {
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

        public clickTime: number;
        public trueFalseSelect(e: egret.TouchEvent) {
            let currentImg = e.currentTarget.getChildByName("img") as eui.Image;
            e.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.trueFalseSelect, this);
            console.log(currentImg.name);
            currentImg.source = "manage-card2";
            e.currentTarget.addChildAt(currentImg, 0);
            this.clickTime = !this.clickTime ? 1 : this.clickTime + 1;
            if (this.clickTime == 2) {
                this.next();
                this.guideWindow.group5.visible = false;
            }
        }

        public get guideWindow(): NewPlayerGuide {
            return <NewPlayerGuide><any>(this.viewComponent);
        }
    }
}