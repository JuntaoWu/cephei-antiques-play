module game {
    export class M15 extends eui.Component implements eui.UIComponent {

        public button1: eui.Button;
        public button2: eui.Button;
        public button3: eui.Button;
        public button4: eui.Button;


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


        public xx: number;
        public haha(aa: number) {
            this.xx = aa;
        }

        public iswin() {
            if (this.xx != 1) {
                //失败
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);

            } else {
                this.button1.enabled = false;
                this.button2.enabled = false;
                this.button3.enabled = false;
                this.button4.enabled = false;
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            }
            
        }


    }

    export class M15Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "M15Mediator";

        public constructor(viewComponent: any) {
            super(M15Mediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

        }

        public setResult() {
            this.gameM15.iswin();
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.RESET_MINIGAME:
                    this.gameM15.xx = 0;
                    break;
                case GameProxy.CONFIRM_MINIGAME:
                    this.setResult();
                    break;
            }
        }

        public get gameM15(): M15 {
            return <M15><any>(this.viewComponent);
        }
    }
}