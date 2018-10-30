
module game {

    export class MiniGameJigsawM16Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameJigsawM16Mediator";

        public constructor(viewComponent: any) {
            super(MiniGameJigsawM16Mediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.jigsawImgGroupList = [
                this.gameJigsaw.jigsawImgGroup1, this.gameJigsaw.jigsawImgGroup2
                , this.gameJigsaw.jigsawImgGroup3, this.gameJigsaw.jigsawImgGroup4
            ]
            this.jigsawImgGroupList.forEach(i => {

                i.addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
                    e.stopImmediatePropagation();
                    let isShow = !i.getChildByName("jigsawMove").visible
                    i.getChildByName("border").visible = i.getChildByName("jigsawMove").visible 
                    = i.getChildByName("jigsawTrans").visible = isShow;
                    this.jigsawImgGroupList.forEach((item, index) => {
                        if (item != e.currentTarget) {
                            item.getChildByName("border").visible = item.getChildByName("jigsawMove").visible 
                            = item.getChildByName("jigsawTrans").visible = false;
                        }
                    })
                }, this);

                i.getChildByName("jigsawTrans").addEventListener(egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
                    e.stopImmediatePropagation();
                    i.getChildByName("border").visible = i.getChildByName("jigsawMove").visible 
                    = i.getChildByName("jigsawTrans").visible = false;
                    let jigsawImg = i.getChildByName("jigsawImg") as eui.Image;
                    jigsawImg.rotation = !jigsawImg.rotation ? 180 : 0;
                    this.setResult();
                }, this);

                i.getChildByName("jigsawMove").addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
                i.getChildByName("jigsawMove").addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                i.getChildByName("jigsawMove").addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchReleaseOutside, this);
                i.getChildByName("jigsawMove").addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchReleaseOutside, this);
            
            })
            this.gameJigsaw.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            let imgList = ["m16_1", "m16_2", "m16_3", "m16_4"];
            for (var i = 0; i < 4; i++) {
                    let index1 = Math.floor(Math.random() * 4);
                    let index2 = Math.floor(Math.random() * 4);
                    if (index1 != index2) {
                        let temp = imgList[index1];
                        imgList[index1] = imgList[index2];
                        imgList[index2] = temp;
                    }
            }

            this.jigsawImgGroupList.forEach((i, index) => {
                let jigsawImg = i.getChildByName("jigsawImg") as eui.Image;
                jigsawImg.source = imgList[index];
                jigsawImg.rotation = Math.random() > 0.5 ? 180 : 0;
            })
        }

        public jigsawImgGroupList: Array<eui.Group>;
        public draggedObject: eui.Group;
        public offsetX: number;
        public offsetY: number;
        public beforeX: number;
        public beforeY: number;

        private onMove(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            //通过计算手指在屏幕上的位置，计算当前对象的坐标，达到跟随手指移动的效果
            this.draggedObject.x = e.stageX - this.offsetX;
            this.draggedObject.y = e.stageY - this.offsetY;
            
        }
        private touchBegin(e: egret.TouchEvent): void {
            console.log("TOUCH_BEGIN", e.currentTarget.name)
            e.stopImmediatePropagation();
            this.draggedObject = e.currentTarget.parent;
            //把触摸的对象放在显示列表的顶层
            this.draggedObject.parent.addChild(this.draggedObject);
            this.beforeX = this.draggedObject.x;
            this.beforeY = this.draggedObject.y;

            //计算手指和要拖动的对象的距离
            this.offsetX = e.stageX - this.draggedObject.x;
            this.offsetY = e.stageY - this.draggedObject.y;
            
            //添加 TOUCH_End 方法
            e.currentTarget.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        }
        private touchEnd(e: egret.TouchEvent): void {
            console.log("TOUCH_END", e.currentTarget.name)
            e.stopImmediatePropagation();
            if (!this.draggedObject || e.currentTarget.parent != this.draggedObject) {
                return;
            }
            this.jigsawImgGroupList.forEach((item, index) => {
                if (this.draggedObject != item) {
                    let x = Math.abs(this.draggedObject.x - item.x),
                        y = Math.abs(this.draggedObject.y - item.y);
                    if (y < 70 && x < 70) {
                        let temp1 = this.draggedObject.getChildByName("jigsawImg");
                        let temp2 = item.getChildByName("jigsawImg");
                        this.draggedObject.addChildAt(temp2, 0);
                        item.addChildAt(temp1, 0);
                        this.setResult();
                    }
                }
            })
            
            this.draggedObject.x = this.beforeX;
            this.draggedObject.y = this.beforeY;
            e.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        }
        private touchReleaseOutside(e: egret.TouchEvent): void {
            if (this.draggedObject) {
                this.draggedObject.x = this.beforeX;
                this.draggedObject.y = this.beforeY;
                this.draggedObject = null;
            }
        }

        public setResult() {
            let isSuccess = true;
            let imgList = ["m16_1", "m16_2", "m16_3", "m16_4"];
            this.jigsawImgGroupList.forEach((i, index) => {
                let jigsawImg = i.getChildByName("jigsawImg") as eui.Image;
                if (jigsawImg.source != imgList[index] || jigsawImg.rotation != 0) {
                    isSuccess = false;
                }
            })
            if (isSuccess) {
                this.gameJigsaw.touchEnabled = false;
                this.gameJigsaw.touchChildren = false;
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
            switch (notification.getName()) {
                case GameProxy.RESET_MINIGAME:
                    this.initData();
                    break;
                case GameProxy.CONFIRM_MINIGAME:
                    this.setResult();
                    break;
            }
        }

        public get gameJigsaw(): MiniGameJigsawM16 {
            return <MiniGameJigsawM16><any>(this.viewComponent);
        }
    }
}