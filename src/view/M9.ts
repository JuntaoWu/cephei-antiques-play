module game {
    export class M9 extends eui.Component implements eui.UIComponent {

        public bg: eui.Image;
        public ren: eui.Image;
        public heng: Array<any> = [];
        public shu: Array<any> = [];
        public zhangai: Array<any> = [];
        public bushu: eui.Label;

        public constructor() {
            super();
            this.skinName = "M9";
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
            ApplicationFacade.getInstance().registerMediator(new M9Mediator(this));
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.bushu.text = "8";

            this.heng = [119, 163, 207, 251, 295, 339, 383, 427, 471, 515, 559, 603];
            this.shu = [81, 125, 169, 213, 257, 301, 345, 389, 433, 477];
            this.zhangai = [
                { x: 163, y: 169 },
                { x: 603, y: 169 },
                { x: 339, y: 213 },
                { x: 515, y: 213 },
                { x: 119, y: 257 },
                { x: 163, y: 301 },
                { x: 559, y: 345 },
                { x: 119, y: 389 },
                { x: 471, y: 389 },
                { x: 207, y: 477 }
            ]
            this.bg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.start, this);
            this.bg.addEventListener(egret.TouchEvent.TOUCH_END, this.end, this);
        }

        public start_x: number;
        public start_y: number;
        public start(e: egret.TouchEvent) {
            this.start_x = e.stageX;
            this.start_y = e.stageY;
        }

        public end(e: egret.TouchEvent) {
            let aa = Number(this.bushu.text);
            aa -= 1;
            this.bushu.text = aa.toString();
            let xx: number = Math.abs(e.stageX - this.start_x);
            let yy: number = Math.abs(e.stageY - this.start_y);
            if (xx > yy) {
                if ((e.stageX - this.start_x) > 0) {
                    //右
                    this.you();
                } else {
                    //左
                    this.zuo();
                }
            } else {
                if ((e.stageY - this.start_y) > 0) {
                    //下
                    this.xia();
                } else {
                    //上
                    this.shang();
                }
            }
        }

        public can_move: boolean;
        public you() {
            this.can_move = true;
            if (this.ren.x != 603) {
                this.ren.x += 44;
                this.haha();
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.x -= 44;
                        this.can_move = false;
                    }
                });
                if (this.can_move) {
                    this.you();
                }
            } else {
                this.can_move = false;
            }
        }

        public zuo() {
            this.can_move = true;
            if (this.ren.x != 119) {
                this.ren.x -= 44;
                this.haha();
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.x += 44;
                        this.can_move = false;
                    }
                });
                if (this.can_move) {
                    this.zuo();
                }
            } else {
                this.can_move = false;
            }
        }

        public xia() {
            this.can_move = true;
            if (this.ren.y != 477) {
                this.ren.y += 44;
                this.haha();
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.y -= 44;
                        this.can_move = false;
                    }
                });
                if (this.can_move) {
                    this.xia();
                }
            } else {
                this.can_move = false;
            }
        }

        public shang() {
            this.can_move = true;
            if (this.ren.y != 81) {
                this.ren.y -= 44;
                this.haha();
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.y += 44;
                        this.can_move = false;
                    }
                });
                if (this.can_move) {
                    this.shang();
                }
            } else {
                this.can_move = false;
            }
        }

        public haha() {
            if (this.ren.x == 515 && this.ren.y == 257) {
                this.ren.x == 515;
                this.ren.y == 257;
                this.can_move = false;
            }
        }

        public f5() {
            this.bushu.text = "8";
            this.ren.x = 427;
            this.ren.y = 169;
        }
    }

    export class M9Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "M9Mediator";

        public constructor(viewComponent: any) {
            super(M9Mediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

        }

        public setResult() {
            if (this.gameM9.ren.x == 515 && this.gameM9.ren.y == 257) {
                this.gameM9.ren.visible = false;
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            } else if (this.gameM9.bushu.text == "0" && !this.gameM9.can_move) {
                this.gameM9.f5();
                ApplicationFacade.getInstance().sendNotification(GameProxy.REDUCE_POWER);
            }
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.RESET_MINIGAME, GameProxy.CONFIRM_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.RESET_MINIGAME:
                    this.gameM9.f5();
                    break;
                case GameProxy.CONFIRM_MINIGAME:
                    this.setResult();
                    break;
            }
        }

        public get gameM9(): M9 {
            return <M9><any>(this.viewComponent);
        }
    }
}