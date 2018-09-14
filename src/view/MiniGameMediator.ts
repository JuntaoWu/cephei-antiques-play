
module game {

    export class MiniGameMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(MiniGameMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.initData();
        }

        public gameName: any;

        public initData() {
            // if (this.gameName) {
            //     this.miniGame.addMiniGame(this.gameName);
            // }
            let displayObject = this.getGameDisplayObject(this.gameName);
            displayObject && this.miniGame.addMiniGameObject(displayObject);
        }

        private getGameDisplayObject(gameName): egret.DisplayObject {
            let displayObject: egret.DisplayObject = null;
            if (this.gameName == gameKey.FloorSwitch) {
                displayObject = new MiniGameFloorSwitch();
            }
            else if (this.gameName == gameKey.CubeStop) {
                displayObject = new MiniGameCubeStop();
            }
            else if (this.gameName == "迷宫") {
                displayObject = new MiniGameJigsawM16();
            }
            else if (this.gameName == "古董组合") {
                displayObject = new MiniGameJigsawM08();
            }
            return displayObject;
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.SHOW_MINIGAME, GameProxy.PASS_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.SHOW_MINIGAME: 
                    this.gameName = data;
                    this.initData();
                    break;
                case GameProxy.PASS_MINIGAME: 
                    this.miniGame.clearStage();
                    break;
            }
        }

        public get miniGame(): MiniGame {
            return <MiniGame><any>(this.viewComponent);
        }
    }
}