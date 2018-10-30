
module game {

    export class MiniGameM8_2Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameM8_2Mediator";

        public constructor(viewComponent: any) {
            super(MiniGameM8_2Mediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.rightRotationList = [-60, 0, 60, 120, 180, -120];
            this.jigsawNameList = ["jigsaw01", "jigsaw02", "jigsaw03", "jigsaw04", "jigsaw05", "jigsaw06"];
            this.jigsawNameList.forEach((i) => {
                let jigsawImg = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                jigsawImg.rotation = 0.1;
                jigsawImg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
                jigsawImg.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                jigsawImg.addEventListener(egret.TouchEvent.TOUCH_CANCEL, this.touchReleaseOutside, this);
                jigsawImg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.touchReleaseOutside, this);
            })
            this.miniGame.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            
        }

        public jigsawNameList: Array<string>;
        public rightRotationList: Array<any>;

        public draggedObject: eui.Group;
        public offsetX: number;
        public offsetY: number;
        private onMove(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            //通过计算手指在屏幕上的位置，计算当前对象的坐标，达到跟随手指移动的效果
            this.draggedObject.x = e.stageX - this.offsetX;
            this.draggedObject.y = e.stageY - this.offsetY;
            
            let offsetToCenterX = this.draggedObject.x - 515, 
                offsetToCenterY = this.draggedObject.y - 185;
            if (offsetToCenterX < -80 && offsetToCenterX > -180 && offsetToCenterY > -30 && offsetToCenterY < 70) {
                this.draggedObject.rotation = 180;
            }
            else if (offsetToCenterX < 0 && offsetToCenterX > -130 && offsetToCenterY > -180 && offsetToCenterY < -30) {
                this.draggedObject.rotation = -120;
            }
            else if (offsetToCenterX < 130 && offsetToCenterX > 0 && offsetToCenterY > -180 && offsetToCenterY < -30) {
                this.draggedObject.rotation = -60;
            }
            else if (offsetToCenterX < 160 && offsetToCenterX > 60 && offsetToCenterY > -30 && offsetToCenterY < 100) {
                this.draggedObject.rotation = 0;
            }
            else if (offsetToCenterX < 100 && offsetToCenterX > -30 && offsetToCenterY > 100 && offsetToCenterY < 150) {
                this.draggedObject.rotation = 60;
            }
            else if (offsetToCenterX < -30 && offsetToCenterX > -180 && offsetToCenterY > 70 && offsetToCenterY < 150) {
                this.draggedObject.rotation = 120;
            }
        }
        private touchBegin(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            this.draggedObject = e.currentTarget;
            //把触摸的对象放在显示列表的顶层
            this.draggedObject.parent.addChild(this.draggedObject);

            //计算手指和要拖动的对象的距离
            this.offsetX = e.stageX - this.draggedObject.x;
            this.offsetY = e.stageY - this.draggedObject.y;
            
            //添加 TOUCH_End 方法
            e.currentTarget.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
        }
        private touchEnd(e: egret.TouchEvent): void {
            e.stopImmediatePropagation();
            if (!this.draggedObject || e.currentTarget != this.draggedObject) {
                return;
            }
            e.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEnd, this);
            let isRight = true;
            this.jigsawNameList.forEach((value, index) => {
                if (this.miniGame.jigsawGroup.getChildByName(value).rotation != this.rightRotationList[index]) {
                    isRight = false;
                }
            });
            if (isRight) {
                this.sendNotification(GameProxy.PASS_MINIGAME);
                this.jigsawNameList.forEach((i) => {
                    let jigsawImg = this.miniGame.jigsawGroup.getChildByName(i) as eui.Image;
                    jigsawImg.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
                    jigsawImg.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
                })
            }
        }
        private touchReleaseOutside(e: egret.TouchEvent): void {
            if (this.draggedObject) {
                this.draggedObject = null;
            }
        }


        public get miniGame(): MiniGameM8_2 {
            return <MiniGameM8_2><any>(this.viewComponent);
        }
    }
}