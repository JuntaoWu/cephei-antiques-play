
module game {

    export class StoreWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "StoreWindowMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(StoreWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.storeWindow.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backClick, this);
            this.storeWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public initData() {
            let dataArr: any[] = RES.getRes("shop_json");
            let euiArr: eui.ArrayCollection = new eui.ArrayCollection(dataArr);
            this.storeWindow.shoplist.dataProvider = euiArr;
            this.storeWindow.shoplist.itemRenderer = shop_list;

            this.storeWindow.gold.text = this.proxy.playerInfo.gold;
        }

        public backClick() {
            this.storeWindow.close();
        }

        public listNotificationInterests(): Array<any> {
            return [shop_listMediator.HAHAHAH];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case shop_listMediator.HAHAHAH: {
                    this.haha(data);
                    break;
                }
            }
        }

        public haha(data: any) {
            let gold_number: number = Number(this.storeWindow.gold.text);
            let spend_gold: number = Number(data.money);
            if (gold_number >= spend_gold) {
                gold_number -= spend_gold;
                this.proxy.playerInfo.gold = gold_number.toString();
                this.storeWindow.gold.text = this.proxy.playerInfo.gold;
                if (data.tili) {
                    this.proxy.playerInfo.fatigueValue += data.tili;
                } else if (data.id == 4) {
                    this.proxy.playerInfo.hints += 1;
                } else if (data.point) {
                    this.proxy.pointHunag += data.point;
                    this.proxy.pointMu -= data.point;
                }
                // platform.showModal(data.effect,false);
                this.sendNotification(SceneCommand.SHOW_POPUP, data.effect);
            } else {
                this.storeWindow.note.visible = true;
                egret.setTimeout(this.close_note, this, 1500);
            }
        }

        public close_note() {
            this.storeWindow.note.visible = false;
        }

        public get storeWindow(): StoreWindow {
            return <StoreWindow><any>(this.viewComponent);
        }


    }
}