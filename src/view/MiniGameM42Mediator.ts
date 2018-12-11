
namespace ap {

    export class MiniGameM42Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameM42Mediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(MiniGameM42Mediator.NAME, viewComponent);
            super.initializeNotifier("ApApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            let colorMatrix = [
                1,0,0,0,100,
                0,1,0,0,100,
                0,0,1,0,100,
                0,0,0,1,0
            ];
            this._colorFlilter = new egret.ColorMatrixFilter(colorMatrix);

            this.miniGame.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leftClick, this);
            this.miniGame.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rightClick, this);
            this.miniGame.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmClick, this);
            this.miniGame.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initData, this);
            this.miniGame.btnED.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnEDClick, this);
            this.miniGame.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.btnBackClick, this);
            this.miniGame.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            this.jigsawNameList = ["jigsaw01", "jigsaw02", "jigsaw03", "jigsaw04", "jigsaw05"];
            this.nowIndex = 0;
            let initRotation = [0, -45, -90, 45, 90];
            this.jigsawNameList.forEach((i, index) => {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                jigsaw.rotation = initRotation[index];
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(i) as eui.Image;
                jigsawResult.visible = false;
                jigsaw.filters = [];
                jigsawResult.filters = [];
            })
            let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
            let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
            if (!jigsawResult.visible) {
                jigsawResult.visible = true;
            }
            jigsawResult.rotation = jigsaw.rotation;
            jigsaw.filters = [this._colorFlilter];
            jigsawResult.filters = [this._colorFlilter];
            if (this.miniGame.questionId) {
                let proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
                this.miniGame.question = proxy.questions.get(this.miniGame.questionId.toString()).question;
            }
        }

        public jigsawNameList: Array<string>;
        public nowIndex: number;
        private _colorFlilter: egret.ColorMatrixFilter;

        public leftClick() {
            this.jigsawNameList.forEach(i => {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                jigsaw.rotation = jigsaw.rotation + 45 > 180 ? jigsaw.rotation - 315 : jigsaw.rotation + 45;
            })
            if (this.jigsawNameList[this.nowIndex]) {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                jigsawResult.rotation = jigsaw.rotation;
            }
        }

        public rightClick() {
            this.jigsawNameList.forEach(i => {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                jigsaw.rotation = jigsaw.rotation - 45 <= -180 ? jigsaw.rotation + 315 : jigsaw.rotation - 45;
            })
            if (this.jigsawNameList[this.nowIndex]) {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                jigsawResult.rotation = jigsaw.rotation;
            }
        }

        public confirmClick() {
            if (this.proxy.playerInfo.fatigueValue <= 0) {
                this.sendNotification(SceneCommand.SHOW_POPUP, "没有体力破解谜题了！（体力可在商城购买）");
                return;
            }
            if (this.nowIndex == this.jigsawNameList.length) {
                this.setResult();
                return;
            }
            if (this.jigsawNameList[this.nowIndex]) {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                jigsaw.filters = [];
                jigsawResult.filters = [];
            }
            this.nowIndex++;
            if (this.jigsawNameList[this.nowIndex]) {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                if (!jigsawResult.visible) {
                    jigsawResult.visible = true;
                }
                jigsawResult.rotation = jigsaw.rotation;
                jigsaw.filters = [this._colorFlilter];
                jigsawResult.filters = [this._colorFlilter];
            }
        }

        public setResult() {
            let isSuccess = true;
            let resultRotation = [-90, 45, -135, 180, -45];
            this.jigsawNameList.forEach((i, index) => {
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(i) as eui.Image;
                if (jigsawResult.rotation != resultRotation[index]) {
                    isSuccess = false;
                }
            })
            console.log(isSuccess);
            if (isSuccess) {
                this.miniGame.touchEnabled = false;
                this.miniGame.touchChildren = false;
                this.sendNotification(GameProxy.PASS_MINIGAME);
            }
            else {
                this.sendNotification(GameProxy.REDUCE_POWER);
                this.initData();
            }
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            if (this.miniGame.questionId != data) {
                return;
            }
            switch (notification.getName()) {
                case GameProxy.RESET_MINIGAME:
                    this.initData();
                    break;
                case GameProxy.CONFIRM_MINIGAME:
                    this.setResult();
                    break;
            }
        }


        public btnEDClick() {
            this.miniGame.showTipsImg = this.miniGame.btnBack.visible = true;
            this.miniGame.btnGroup.visible = this.miniGame.jigsawGroup.visible = false;
        }

        public btnBackClick() {
            this.miniGame.showTipsImg = this.miniGame.btnBack.visible = false;
            this.miniGame.btnGroup.visible = this.miniGame.jigsawGroup.visible = true;
        }

        public get miniGame(): MiniGameM42 {
            return <MiniGameM42><any>(this.viewComponent);
        }
    }
}