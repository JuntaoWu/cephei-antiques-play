
module game {

    export class SceneSummaryWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "SceneSummaryWindowMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(SceneSummaryWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.loadResGroup();

            this.sceneSummaryWindow.btnBack.addEventListener(egret.TouchEvent.TOUCH_TAP, this.backClick, this);
            this.sceneSummaryWindow.btnSceneBg.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.sendNotification(SceneCommand.SHOW_SCENE_DETAILS, SceneType.SceneBg);
            }, this);
            this.sceneSummaryWindow.btnScenePerson.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.sendNotification(SceneCommand.SHOW_SCENE_DETAILS, SceneType.ScenePerson);
            }, this);
            this.sceneSummaryWindow.btnSceneProps.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.sendNotification(SceneCommand.SHOW_SCENE_DETAILS, SceneType.SceneProps);
            }, this);
            this.sceneSummaryWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        private loadResGroup() {
            const chapterResGroup = [0, 34, 69, 134, 184, 223];
            for (let i = 0; i < 6; i++) {
                if (this.proxy.playerInfo.plotId > chapterResGroup[i]) {
                    try {
                        RES.loadGroup(`chapter${i}`, 0);
                    }
                    catch (err) {
                        console.log(err);
                    }
                }
            }
        }

        public initData() {
            let sceneRes = RES.getRes("scene_json") as Array<any>;
            this.sceneSummaryWindow.collectedText = `${this.proxy.playerInfo.collectedScenes.length}/${sceneRes.length}`;
            this.sceneSummaryWindow.finishText = `1/10`;
        }

        public backClick() {
            this.sceneSummaryWindow.close();
        }

        public listNotificationInterests(): Array<any> {
            return [];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
            }
        }

        public get sceneSummaryWindow(): SceneSummaryWindow {
            return <SceneSummaryWindow><any>(this.viewComponent);
        }
    }
}