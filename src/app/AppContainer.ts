
module game {

    export class AppContainer extends eui.UILayer {

        public startScreen: StartScreen = new StartScreen();
        public gameScreen: GameScreen = new GameScreen();

        public constructor() {
            super();
            this.alpha = 0;
        }

        /**
         * 进入开始页面
         */
        public enterStartScreen(): void {
            this.removeChildren();

            this.addChild(this.startScreen);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }

        public enterGameScreen(): void {
            this.addChild(this.gameScreen);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }
    }
}