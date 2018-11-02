
module game {

    export class ManageWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "ManageWindowMediator";

        private proxy: GameProxy;
        public change: Change;

        public constructor(viewComponent: any) {
            super(ManageWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.manageWindow.yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yes, this);
            this.manageWindow.no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.no, this);
            this.manageWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.manageWindow.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
            this.initData();
        }

        private manageEvent: any;
        public initData() {
            this.chushishezhi();
            this.haha();
        }

        public haha() {
            this.manageWindow.gu1.text = this.proxy.playerInfo.guPrice[0].toString();
            this.manageWindow.gu2.text = this.proxy.playerInfo.guPrice[1].toString();
            this.manageWindow.gu3.text = this.proxy.playerInfo.guPrice[2].toString();
            this.manageWindow.gu4.text = this.proxy.playerInfo.guPrice[3].toString();
            this.manageWindow.coll1.text = this.proxy.playerInfo.guColl[0].toString();
            this.manageWindow.coll2.text = this.proxy.playerInfo.guColl[1].toString();
            this.manageWindow.coll3.text = this.proxy.playerInfo.guColl[2].toString();
            this.manageWindow.coll4.text = this.proxy.playerInfo.guColl[3].toString();
            this.manageWindow.clock.text = this.proxy.playerInfo.time.toString();
            this.manageWindow.text1.text = this.manageEvent.description;
            this.manageWindow.gold.text = this.proxy.playerInfo.gold;
            if (this.manageEvent.subType == "有选项") {
                this.manageWindow.option.visible = true;
                this.manageWindow.text1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
            } else if (this.manageEvent.type == "小游戏") {
                this.manageWindow.option.visible = false;
                console.log("小游戏");
            } else {
                this.manageWindow.option.visible = false;
                this.manageWindow.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.next, this);
                this.change = { ...this.proxy.changeArr.get(this.manageEvent.Column9.toString()) };
            }
        }

        public next() {
            this.gogog();
            this.proxy.playerInfo.time--;
            this.manageEvent = this.proxy.getRandomManageEvent();
            console.log(this.change);
            this.haha();
        }

        public yes() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedYes.toString()) };
            this.next();
        }

        public no() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedNo.toString()) };
            this.next();
        }

        public gogog() {
            if (this.change.leixing1 == "古董数量变化") {
                let aa: Array<string> = ["木器", "书画", "青铜", "金玉"];
                if (this.change.mubiao1 == "随机") {
                    this.proxy.playerInfo.guColl[this.suiji(0, 3)] += parseInt(this.change.shuzhi1);
                } else {
                    this.proxy.playerInfo.guColl[aa.indexOf(this.change.mubiao1)] += parseInt(this.change.shuzhi1);
                }
            }
        }

        public shuzu: Array<number> = [0, 0, 0, 0];
        public chushi(data: number) {
            let Range = data;
            let Rand;
            for (let i = 0; i < 3; i++) {
                Rand = Math.random();
                this.shuzu[i] = Math.round(Rand * Range);
                Range -= this.shuzu[i];
            };
            this.shuzu[3] = Range;
        }

        public suiji(min: number, max: number) {
            let data = max - min;
            let aa = Math.random();
            return (min + Math.round(aa * data));
        }

        public zongjiazhi: number = 10;
        public zongbaowushu: number = 20;
        public chushishezhi() {
            let haha: number = 0;
            for (let i = 0; i < 4; i++) {
                haha += this.proxy.playerInfo.guPrice[i];
            }
            if (haha == 0 && this.proxy.playerInfo.time == 24) {
                this.chushi(this.zongjiazhi);
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guPrice[i] = this.shuzu[i];
                }
                this.chushi(this.zongbaowushu);
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guColl[i] = this.shuzu[i];
                }
            }
            // let aa = this.suiji(0, 100);
            // if (0 <= aa && aa <= 20) {
            //     this.proxy.playerInfo.guEvent = this.suiji(1, 16);
            // } else if (20 < aa && aa <= 50) {
            //     this.proxy.playerInfo.guEvent = this.suiji(17, 32);
            // } else if (50 < aa && aa <= 100) {
            //     this.proxy.playerInfo.guEvent = this.suiji(33, 48);
            // }
            if (!this.proxy.playerInfo.guEventList.length) {
                this.manageEvent = this.proxy.getRandomManageEvent();
            }
            else {
                this.manageEvent = this.proxy.manageEventArr.find(i => i.id == this.proxy.playerInfo.guEventList[this.proxy.playerInfo.guEventList.length - 1]);
            }
            console.log(this.manageEvent);
        }

        public get manageWindow(): ManageWindow {
            return <ManageWindow><any>(this.viewComponent);
        }
    }
}