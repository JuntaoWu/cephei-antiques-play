
module game {

    export class GameCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }
        public static NAME: string = "GameCommand";

        /**
         * 开始游戏
         */
        public static START_GAME: string = "start_game";

        /**
         * 注册消息
         */
        public register(): void {
            this.initializeNotifier("ApplicationFacade");
            this.facade().registerCommand(GameCommand.START_GAME, GameCommand);
        }

        public async execute(notification: puremvc.INotification): Promise<any> {
            var gameProxy: GameProxy = <GameProxy><any>(this.facade().retrieveProxy(GameProxy.NAME));
            const data = notification.getBody();
            switch (notification.getName()) {
                
            }
        }
    }
}