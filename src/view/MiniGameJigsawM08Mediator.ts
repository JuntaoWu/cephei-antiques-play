
namespace ap {

    export class MiniGameJigsawM08Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameJigsawM08Mediator";

        public constructor(viewComponent: any) {
            super(MiniGameJigsawM08Mediator.NAME, viewComponent);
            super.initializeNotifier("ApApplicationFacade");
            
            this.jigsawImgGroupList = [
                this.gameJigsaw.jigsawImgGroup1, this.gameJigsaw.jigsawImgGroup2, this.gameJigsaw.jigsawImgGroup3
                , this.gameJigsaw.jigsawImgGroup4, this.gameJigsaw.jigsawImgGroup5, this.gameJigsaw.jigsawImgGroup6
                , this.gameJigsaw.jigsawImgGroup7, this.gameJigsaw.jigsawImgGroup8, this.gameJigsaw.jigsawImgGroup9
            ]
            this.jigsawImgGroupList.forEach((i, index) => {
                i.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (e: egret.TouchEvent) => {
                    e.stopImmediatePropagation();
                    this.jigsawImgclick(index);
                }, this);
            })
            this.gameJigsaw.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
        }

        public async initData() {
            let imgList = ["m08_2", "m08_5", "m08_8", "m08_4", "", "m08_7", "m08_1", "m08_3", "m08_6"];
            this.gameJigsaw.step = 15;
            this.jigsawImgGroupList.forEach((i, index) => {
                let jigsawImg = i.getChildByName("jigsawImg") as eui.Image;
                jigsawImg.source = imgList[index];
                if (!imgList[index]) {
                    this.emptyIndex = index;
                }
            })
        }

        public jigsawImgGroupList: Array<eui.Group>;
        public emptyIndex: number; //拼图空的那项index
        private step: number; //可用步数

        public jigsawImgclick(index: number) {
            if (!this.gameJigsaw.step) return;
            if (this.emptyIndex == index + 1 || this.emptyIndex == index - 1
                || this.emptyIndex == index + 3 || this.emptyIndex == index - 3) {
                
                let clickImg = this.jigsawImgGroupList[index].getChildByName("jigsawImg");
                let emptyImg = this.jigsawImgGroupList[this.emptyIndex].getChildByName("jigsawImg");
                this.jigsawImgGroupList[index].addChild(emptyImg);
                this.jigsawImgGroupList[this.emptyIndex].addChild(clickImg);
                this.emptyIndex = index;
                this.gameJigsaw.step -= 1;
            }
        }

        public setResult() {
            let isSuccess = true;
            let imgList = ["m08_1", "", "m08_2", "m08_3", "m08_4", "m08_5", "m08_6", "m08_7", "m08_8"];
            this.jigsawImgGroupList.forEach((i, index) => {
                let jigsawImg = i.getChildByName("jigsawImg") as eui.Image;
                if (jigsawImg.source != imgList[index]) {
                    isSuccess = false;
                }
            })
            if (isSuccess) {
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
            if (this.gameJigsaw.questionId != data) {
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

        public get gameJigsaw(): MiniGameJigsawM08 {
            return <MiniGameJigsawM08><any>(this.viewComponent);
        }
    }
}