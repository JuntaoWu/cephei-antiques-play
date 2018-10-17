module game {
    export class M24 extends eui.Component implements eui.UIComponent {

        public hei: eui.Image;
        public bai: eui.Image;
        public zhu: eui.Image;
        public he: eui.Image;
        public jiao: eui.Image;
        public yi: eui.Image;
        public ti: eui.Image;
        public jia: eui.Image;

        public arr1: Array<eui.Image> = [];
        public arr2: Array<eui.Image> = [];
        public win: eui.Label;

        public constructor() {
            super();
            this.skinName = "M24";
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this.arr1 = [this.hei, this.bai, this.zhu, this.he];
            this.arr2 = [this.jiao, this.yi, this.ti, this.jia];
            this.arr1.forEach(ele => {
                ele.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => this.haha(ele, this.arr1)), this);
            });
            this.arr2.forEach(ele => {
                ele.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => this.haha(ele, this.arr2)), this);
            });
        }

        public haha(ele: eui.Image, arr: Array<eui.Image>) {
            arr.forEach(e => {
                e.scaleX = 1;
                e.scaleY = 1;
            })
            ele.scaleX = 0.8;
            ele.scaleY = 0.8;
            this.iswin();
        }

        public iswin() {
            if (this.bai.scaleX == 0.8 && this.jiao.scaleX == 0.8) {
                this.win.visible = true;
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            }
        }
    }
}