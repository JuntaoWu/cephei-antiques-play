
module game {

    export class MiniGameM42Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameM42Mediator";

        public constructor(viewComponent: any) {
            super(MiniGameM42Mediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.miniGame.btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this.leftClick, this);
            this.miniGame.btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this.rightClick, this);
            this.miniGame.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, this.confirmClick, this);
            this.miniGame.btnReset.addEventListener(egret.TouchEvent.TOUCH_TAP, this.initData, this);
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
            })
        }

        public jigsawNameList: Array<string>;
        public nowIndex: number;

        public leftClick() {
            this.jigsawNameList.forEach(i => {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                jigsaw.rotation = jigsaw.rotation + 45 > 180 ? jigsaw.rotation - 315 : jigsaw.rotation + 45;
            })
            if (this.jigsawNameList[this.nowIndex]) {
                let jigsaw = this.miniGame.jigsawGroup.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                let jigsawResult = this.miniGame.jigsawResult.getChildByName(this.jigsawNameList[this.nowIndex]) as eui.Image;
                if (!jigsawResult.visible) {
                    jigsawResult.visible = true;
                }
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
                if (!jigsawResult.visible) {
                    jigsawResult.visible = true;
                }
                jigsawResult.rotation = jigsaw.rotation;
            }
        }

        public confirmClick() {
            this.nowIndex++;
            if (this.nowIndex == 5) {
                this.setResult();
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
        }

        public get miniGame(): MiniGameM42 {
            return <MiniGameM42><any>(this.viewComponent);
        }
    }
}