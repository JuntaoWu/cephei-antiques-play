
module game {

    export class MiniGameMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameMediator";

        public constructor(viewComponent: any) {
            super(MiniGameMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

        }

        private gameObjPool: Object;
        public addMiniGameToStage(questionId: number, gameName: string) {
            // if (gameName) {
            //     this.miniGame.addMiniGame(gameName);
            // }
            this.miniGame.clearStage();
            if (!this.gameObjPool) {
                this.gameObjPool = {};
            }
            if (!this.gameObjPool[gameName]) {
                this.gameObjPool[gameName] = this.getGameDisplayObject(gameName);
            }
            try {
                this.gameObjPool[gameName].setQuestionId && this.gameObjPool[gameName].setQuestionId(questionId);
                this.miniGame.addMiniGameObject(this.gameObjPool[gameName]);
            }
            catch (err) {
                console.log(err);
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
                case "药不然拼古董":
                    displayObject = new MiniGameM8_2();
                    break;
                case "古董组合1":
                    displayObject = new M14();
                    break;
                case "平面魔方":
                    displayObject = new M2();
                    break;
                case "密码锁":
                    displayObject = new M3_2();
                    break;
                case "拼图迷宫":
                    displayObject = new M5();
                    break;
                case "暗号":
                    displayObject = new M6();
                    break;
                case "找到出口":
                    displayObject = new M9();
                    break;
                case "石门机关":
                    displayObject = new M24();
                    break;
                case "旅社求救":
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