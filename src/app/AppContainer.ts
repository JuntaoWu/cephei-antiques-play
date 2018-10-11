
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
            this.gameScreen.parent && this.removeChild(this.gameScreen);

            this.addChild(this.startScreen);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }

        public enterGameScreen(): void {
            this.startScreen.parent && this.removeChild(this.startScreen);

            this.addChild(this.gameScreen);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }

        public storeWindow: StoreWindow = new StoreWindow();
        public showStoreWindow(): void {
            if (!this.storeWindow) {
                this.storeWindow = new StoreWindow();
            }
            this.addChild(this.storeWindow);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }
        
        public sceneWindow: SceneSummaryWindow;
        public showSceneSummaryWindow(): void {
            if (!this.sceneWindow) {
                this.sceneWindow = new SceneSummaryWindow();
            }
            this.addChild(this.sceneWindow);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }
        
        public sceneDetailsWindow: SceneDetailsWindow;
        public showSceneDetailsWindow(type: string): void {
            if (!this.sceneDetailsWindow) {
                this.sceneDetailsWindow = new SceneDetailsWindow();
            }
            this.sceneDetailsWindow.setSceneType(type);
            this.addChild(this.sceneDetailsWindow);
            egret.Tween.get(this).to({ alpha: 1 }, 1500);
        }
    }
}