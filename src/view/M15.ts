module game {
    export class M15 extends eui.Component implements eui.UIComponent {

        public button1: eui.Button;
        public button2: eui.Button;
        public button3: eui.Button;
        public button4: eui.Button;
        public win: eui.Label;


        public constructor() {
            super();
            this.skinName = "M15";
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }


        protected childrenCreated(): void {
            super.childrenCreated();

            this.button1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(1) }), this);
            this.button2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(2) }), this);
            this.button3.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(3) }), this);
            this.button4.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(4) }), this);


        }



        public haha(aa: number) {
            this.win.visible = true;
            if (aa != 1) {
                //失败
                this.win.text = "解锁失败";

            } else {
                this.win.text = "解锁成功";
                this.button1.enabled=false;
                this.button2.enabled=false;
                this.button3.enabled=false;
                this.button4.enabled=false;
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            }
            egret.setTimeout(() => {
                this.win.visible = false;
            }, this, 1000);
        }


    }
}