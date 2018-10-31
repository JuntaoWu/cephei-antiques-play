
module game {

    export class MiniGameMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(MiniGameMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
        }

        public addMiniGameToStage(questionId: number, gameName: string) {
            // if (gameName) {
            //     this.miniGame.addMiniGame(gameName);
            // }
            this.miniGame.clearStage();
            let displayObject = this.getGameDisplayObject(gameName);
            if (displayObject) {
                displayObject.setQuestionId && displayObject.setQuestionId(questionId);
                this.miniGame.addMiniGameObject(displayObject);
            }
        }

        private getGameDisplayObject(gameName: string): any {
            let displayObject: egret.DisplayObject = null;
            switch (gameName) {
                case "地板开关":
                    displayObject = new MiniGameFloorSwitch();
                    break;
                case "魔方停止":
                    displayObject = new MiniGameCubeStop();
                    break;
                case "迷宫":
                    displayObject = new MiniGameJigsawM16();
                    break;
                case "古董组合":
                    displayObject = new MiniGameJigsawM08();
                    break;
                case "拼装分水镜":
                    displayObject = new MiniGameM42();
                    break;
                case "拼装分水镜2":
                    displayObject = new MiniGameM8_2();
                    break;
                case "古董组合1":
                    displayObject = new M14();
                    break;
                case "密码锁2":
                    displayObject = new M2();
                    break;
                case "M3aaa":
                    displayObject = new M3_2();
                    break;
                case "拼图迷宫5":
                    displayObject = new M5();
                    break;
                case "暗号6":
                    displayObject = new M6();
                    break;
                case "找到出口":
                    displayObject = new M9();
                    break;
                case "石门机关":
                    displayObject = new M24();
                    break;
                case "旅社求救，剧情补充":
                    displayObject = new M15();
                    break;
                case "铜人":
                    displayObject = new M17();
                    break;
            }
            return displayObject;
        }

        public listNotificationInterests(): Array<any> {
            return [GameProxy.SHOW_MINIGAME];
        }

        public handleNotification(notification: puremvc.INotification): void {
            var data: any = notification.getBody();
            switch (notification.getName()) {
                case GameProxy.SHOW_MINIGAME:
                    this.addMiniGameToStage(data.id, data.keyword);
                    break;
            }
        }

        public get miniGame(): MiniGame {
            return <MiniGame><any>(this.viewComponent);
        }
    }
}