module game {
    export class M9 extends eui.Component implements eui.UIComponent {

        public bg: eui.Image;
        public ren: eui.Image;
        public heng: Array<any> = [];
        public shu: Array<any> = [];
        public zhangai: Array<any> = [];
        public bushu: eui.Label;
        public resh: eui.Button;

        public constructor() {
            super();
            this.skinName = "M9";
        }

        protected partAdded(partName: string, instance: any): void {
            super.partAdded(partName, instance);
        }

        protected childrenCreated(): void {
            super.childrenCreated();
            this.bushu.text = "8";
            this.resh.addEventListener(egret.TouchEvent.TOUCH_TAP, this.f5, this);

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

        public you() {
            let can_move: boolean = true;
            if (this.ren.x != 603) {
                this.ren.x += 44;
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.x -= 44;
                        can_move = false;
                    }
                });
                if (can_move) {
                    this.you();
                }
            } else {
                can_move = false;
            }
            this.iswin(can_move);
        }

        public zuo() {
            let can_move: boolean = true;
            if (this.ren.x != 119) {
                this.ren.x -= 44;
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.x += 44;
                        can_move = false;
                    }
                });
                if (can_move) {
                    this.zuo();
                }
            } else {
                can_move = false;
            }
            this.iswin(can_move);
        }

        public xia() {
            let can_move: boolean = true;
            if (this.ren.y != 477) {
                this.ren.y += 44;
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.y -= 44;
                        can_move = false;
                    }
                });
                if (can_move) {
                    this.xia();
                }
            } else {
                can_move = false;
            }
            this.iswin(can_move);
        }

        public shang() {
            let can_move: boolean = true;
            if (this.ren.y != 81) {
                this.ren.y -= 44;
                this.zhangai.forEach(ele => {
                    if (ele.x == this.ren.x && ele.y == this.ren.y) {
                        this.ren.y += 44;
                        can_move = false;
                    }
                });
                if (can_move) {
                    this.shang();
                }
            } else {
                can_move = false;
            }
            this.iswin(can_move);
        }

        public iswin(aa: boolean) {
            if (this.ren.x == 515 && this.ren.y == 257) {
                this.ren.visible = false;
                ApplicationFacade.getInstance().sendNotification(GameProxy.PASS_MINIGAME);
            } else if (this.bushu.text == "0" && !aa) {
                this.f5();
            }
        }

        public f5() {
            this.bushu.text = "8";
            this.ren.x = 427;
            this.ren.y = 169;
        }
    }
}