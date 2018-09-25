module game {
    export class MiniGameM14Mediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameM14Mediator";

        public constructor(ViewPrepCommand: any) {
            super(MiniGameM14Mediator.NAME, ViewPrepCommand);
            super.initializeNotifier("ApplicationFacade");


        }

        public async initData() {
            this.GameM14.paperList = [this.GameM14.no1, this.GameM14.no2, this.GameM14.no3, this.GameM14.no4, this.GameM14.no5, this.GameM14.no6, this.GameM14.no7, this.GameM14.no8];
            this.GameM14.answerList = [
                { x: 451.5, y: 259.5, ro: 0 },
                { x: 271.5, y: 119.5, ro: 0 },
                { x: 91.5, y: 119.5, ro: 0 },
                { x: 451.5, y: 119.5, ro: 0 },
                { x: 91.5, y: 259.5, ro: 0 },
                { x: 631.5, y: 259.5, ro: 0 },
                { x: 631.5, y: 119.5, ro: 0 },
                { x: 271.5, y: 259.5, ro: 0 }
            ];

            this.GameM14.paperList.forEach(ele => {
                // ele.addEventListener(egret.TouchEvent.TOUCH_TAP, (() => { this.rotate(ele) }), this);
                ele.addEventListener(egret.TouchEvent.TOUCH_BEGIN, (() => { this.record(ele) }), this);
                ele.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.move, this);
                ele.addEventListener(egret.TouchEvent.TOUCH_END, this.transposition, this);
            });
        }

        private first_img_x: number;
        private first_img_y: number;
        private first_img: eui.Image;
        private record(img: eui.Image) {
            this.first_img = img;
            this.first_img.parent.addChild(this.first_img);
            this.first_img_x = img.x;
            this.first_img_y = img.y;
        }

        private rotate(img: eui.Image) {
            img.rotation = img.rotation == 0 ? 180 : 0;
        }

        private move(s: egret.TouchEvent) {
            this.first_img.x = s.stageX;
            this.first_img.y = s.stageY;
        }

        private second_img_x: number;
        private second_img_y: number;
        private ischang: boolean = false;
        private transposition(s: egret.TouchEvent) {
            this.ischang = false;
            if (this.first_img.x == this.first_img_x && this.first_img.y == this.first_img_y) {
                this.first_img.rotation = this.first_img.rotation == 0 ? 180 : 0;
            }

            this.GameM14.paperList.forEach(ele => {
                if ((ele.x - 86.5) <= s.stageX && s.stageX <= (ele.x + 86.5) && (ele.y - 64.5) <= s.stageY && s.stageY <= (ele.y + 64.5) && ele != this.first_img) {
                    this.first_img.x = ele.x;
                    this.first_img.y = ele.y;
                    ele.x = this.first_img_x;
                    ele.y = this.first_img_y;
                    this.ischang = true;
                    // egret.Tween.get(ele).to({ x: this.first_img_x, y: this.first_img_y }, 1000);				
                }
            });

            if (!this.ischang) {
                this.first_img.x = this.first_img_x;
                this.first_img.y = this.first_img_y;
            }

            this.iswin();
        }

        private ww: boolean = true;
        private iswin() {
            console.log("jiancha");
            this.ww = true;
            this.GameM14.paperList.forEach(ele => {
                let no = this.GameM14.paperList.indexOf(ele);
                if (ele.x != this.GameM14.answerList[no].x || ele.y != this.GameM14.answerList[no].y || ele.rotation != this.GameM14.answerList[no].ro) {
                    this.ww = false;
                }
            });

            if (this.ww) {
                this.GameM14.win.parent.addChild(this.GameM14.win);
                this.GameM14.win.visible = true;
                this.sendNotification(GameProxy.PASS_MINIGAME);
            }
        }

        public get GameM14(): MiniGameM14 {
            return <MiniGameM14><any>(this.viewComponent);
        }
    }
}