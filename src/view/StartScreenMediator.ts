
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
            this.startScreen.btnManage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showManage, this);
            this.startScreen.btnDev.addEventListener(egret.TouchEvent.TOUCH_TAP, this.showDeveloper, this);

            this.startScreen.btnPicture.addEventListener(egret.TouchEvent.TOUCH_TAP, this.pictClick, this);
            this.startScreen.btnStore.addEventListener(egret.TouchEvent.TOUCH_TAP, this.storeClick, this);
            this.startScreen.btnShare.addEventListener(egret.TouchEvent.TOUCH_TAP, this.shareClick, this);
            this.startScreen.btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this.settingClick, this);
            this.startScreen.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.initData();
        }

        public async initData() {
            await this.proxy.getPlayerInfoFromStorage();
            this.startScreen.btnResumeGame.visible = this.proxy.playerInfo.plotId != 1 ? true : false;
            this.startScreen.btnManage.visible = this.proxy.playerInfo.isManage;
            this.startScreen.no_manage.visible = !this.proxy.playerInfo.isManage;
        }

        public entryGame() {
            this.sendNotification(game.SceneCommand.CHANGE, Scene.Game);
        }

        public newGame() {
            if (this.proxy.playerInfo.plotId != 1) {
                let obj = {
                    msg: "你的进度将会被重置，是否确认开始新的游戏？",
                    hasCancel: true,
                    cbk: () => {
                        this.proxy.resetGame();
                        this.sendNotification(SceneCommand.CHANGE, Scene.Game);
                    }
                }
                this.sendNotification(SceneCommand.SHOW_POPUP, obj);
                // try {
                //     platform.showModal("是否确认新的开始？", true).then((res) => {
                //         if (res.confirm) {
                //             this.proxy.playerInfo.plotId = 1;
                //             this.sendNotification(SceneCommand.CHANGE, Scene.Game);
                //         }
                //     });
                // }
                // catch (err) {
                //     this.proxy.playerInfo.plotId = 1;
                //     this.sendNotification(SceneCommand.CHANGE, Scene.Game);
                // }
            }
            else {
                this.sendNotification(SceneCommand.CHANGE, Scene.Game);
            }

        }

        public showManage() {
            if (!this.proxy.playerInfo.time) {
                // platform.showModal("经营模式每日只能完成一次，今日经营模式已完成！", false);
                this.sendNotification(SceneCommand.SHOW_POPUP, "经营模式每日只能完成一次，今日经营模式已完成！");
            }
            else {
                this.sendNotification(SceneCommand.SHOW_MANAGE);
            }
        }

        public showDeveloper() {
            this.sendNotification(SceneCommand.SHOW_DEVE);
        }

        public pictClick() {
            this.sendNotification(SceneCommand.SHOW_SCENE);
        }

        public storeClick() {
            this.sendNotification(SceneCommand.SHOW_STORE);
        }

        public shareClick() {
            platform.shareAppMessage();
        }

        public settingClick() {
            this.sendNotification(SceneCommand.SHOW_SETTING);
        }

        public listNotificationInterests(): Array<any> {
            return [GameScreenMediator.manage_show];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameScreenMediator.manage_show: {
                    this.startScreen.no_manage.visible = false;
                    this.startScreen.btnManage.visible = true;
                    break;
                }
            }
        }

        public get startScreen(): StartScreen {
            return <StartScreen><any>(this.viewComponent);
        }
    }
}