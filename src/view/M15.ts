namespace ap {
    export class M15 extends eui.Component implements eui.UIComponent {

        public button1: eui.Button;
        public button2: eui.Button;
        public button3: eui.Button;
        public button4: eui.Button;

        public arr: Array<eui.Button> = [];


        public constructor() {
            super();
            this.skinName = "M15";
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            ApplicationFacade.getInstance().registerMediator(new M15Mediator(this));
        }


        protected childrenCreated(): void {
            super.childrenCreated();

            this.arr = [this.button1, this.button2, this.button3, this.button4];
            this.button1.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(1) }), this);
            this.button2.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(2) }), this);
            this.button3.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(3) }), this);
            this.button4.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.haha(4) }), this);
        }


        public xx: number = 0;
        public haha(aa: number) {
            this.xx = aa;
            this.arr.forEach(ele => {
                ele.scaleX = 1;
                ele.scaleY = 1;
            });
            this.arr[aa - 1].scaleX = 0.8;
            this.arr[aa - 1].scaleY = 0.8;

        }

        public iswin() {
            if (this.xx != 1) {
                //失败
                ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);

            } else {
                this.arr.forEach(ele => {
                    ele.scaleX = 1;
                    ele.scaleY = 1;
                    ele.enabled = false;
                });
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            }

        }

        public questionId: number;
        public setQuestionId(id: number): void {
            this.questionId = id;
        }

    }

    export class M15Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "M15Mediator";

        public constructor(viewComponent: any) {
            super(M15Mediator.NAME, viewComponent);
            super.initializeNotifier("ApApplicationFacade");
            this.gameM15.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
        }

        public async initData() {
            this.gameM15.xx = 0;
        }

        public setResult() {
            this.gameM15.iswin();
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            if (this.gameM15.questionId != data) {
                return;
            }
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