
module game {

    export class SceneDetailsWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "SceneDetailsWindowMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(SceneDetailsWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.sceneDetailsWindow.sceneList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.previewClick, this);
            this.sceneDetailsWindow.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backClick, this);
            this.sceneDetailsWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public initData() {
            let sceneList = this.proxy.sceneRes.get(this.sceneDetailsWindow.type).map((i) => {
                let scene = { ...i }
                if (this.proxy.playerInfo.collectedScenes.includes(i.res)) {
                    scene.isCollected = true;
                    if (scene.type == SceneType.ScenePerson) {
                        scene.scale = 0.25;
                    }
                    else {
                        scene.scale = 0.42;
                    }
                }
                else {
                    scene.isCollected = false;
                    scene.res = "not-get";
                    scene.name = "未获得";
                    scene.scale = 1;
                }
                return scene;
            }) as Array<any>
            this.sceneDetailsWindow.collectedText = `${sceneList.filter(i => i.isCollected).length}/${sceneList.length}`;
            sceneList.sort((a, b) => {
                if (a.isCollected) return -1;
                else if (b.isCollected) return 1;
                return 0
            })
            this.sceneDetailsWindow.sceneList.dataProvider = new eui.ArrayCollection(sceneList);
            this.sceneDetailsWindow.sceneList.itemRenderer = SceneDetailsItemRenderer;
        }

        public backClick() {
            this.sceneDetailsWindow.close();
        }

        public previewClick() {
            let sceneItem = this.sceneDetailsWindow.sceneList.selectedItem;
            if (sceneItem.isCollected) {
                let imgList = [
                    `${game.Constants.ResourceEndpoint}resource/assets/scene/${sceneItem.res}.${this.sceneDetailsWindow.type == SceneType.SceneBg ? "jpg" : "png"}`
                ]
                platform.showPreImage(imgList);
            }
        }

        public listNotificationInterests(): Array<any> {
            return [];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
            }
        }

        public get sceneDetailsWindow(): SceneDetailsWindow {
            return <SceneDetailsWindow><any>(this.viewComponent);
        }
    }
}