
module game {

    export class SceneSummaryWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "SceneSummaryWindowMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(SceneSummaryWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

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

        public initData() {

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