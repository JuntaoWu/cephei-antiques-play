module game {

    export class shop_listMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "shop_listMediator";

        private proxy: GameProxy;
        public static HAHAHAH: string = "hahahah";

        public constructor(viewComponent: any) {
            super(shop_listMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.shop_list.pay.addEventListener(egret.TouchEvent.TOUCH_TAP, this.haha, this);

        }

        public haha() {
            this.sendNotification(shop_listMediator.HAHAHAH, this.shop_list.data);
        }

        public get shop_list(): shop_list {
            return <shop_list><any>(this.viewComponent);
        }
    }
}