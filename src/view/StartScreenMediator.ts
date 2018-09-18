
module game {

    export class StartScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "StartScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(StartScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.startScreen.btnGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.entryGame, this);
            this.startScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public initData() {

        }

        public entryGame() {
            this.sendNotification(game.SceneCommand.CHANGE, Scene.Game);
        }

        public listNotificationInterests(): Array<any> {
            return [];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
            }
        }

        public get startScreen(): StartScreen {
            return <StartScreen><any>(this.viewComponent);
        }
    }
}