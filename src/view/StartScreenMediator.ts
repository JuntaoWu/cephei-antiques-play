
module game {

    export class StartScreenMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "StartScreenMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(StartScreenMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.startScreen.btnResumeGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.entryGame, this);
            this.startScreen.btnNewGame.addEventListener(egret.TouchEvent.TOUCH_TAP, this.newGame, this);
            
            this.startScreen.btnPicture.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pictClick, this);
            this.startScreen.btnStore.addEventListener(egret.TouchEvent.TOUCH_TAP, this.storeClick, this);
            this.startScreen.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareClick, this);
            this.startScreen.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.settingClick, this);
            this.startScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public initData() {
            this.startScreen.btnResumeGame.visible = this.proxy.playerInfo.plotId != 1 ? true : false;
        }

        public entryGame() {
            this.sendNotification(game.SceneCommand.CHANGE, Scene.Game);
        }

        public newGame() {
            this.proxy.playerInfo.plotId = 1;
            this.sendNotification(game.SceneCommand.CHANGE, Scene.Game);
        }

        public pictClick() {
            this.sendNotification(game.SceneCommand.SHOW_SCENE); 
        }

        public storeClick() {
            this.sendNotification(game.SceneCommand.SHOW_STORE);
        }

        public shareClick() {
            platform.shareAppMessage();
        }

        public settingClick() {

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