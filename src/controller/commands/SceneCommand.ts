/**
 * Created by xzper on 2014/11/15.
 */

namespace ap {

    export class SceneCommand extends puremvc.SimpleCommand implements puremvc.ICommand {

        public constructor() {
            super();
        }
        public static NAME: string = "SceneCommand";

        /**
         * 切换场景
         */
        public static CHANGE: string = "scene_change";

        public static SHOW_MANAGE: string = "show_manage";
        public static SHOW_DEVE: string = "show_developer";

        public static SHOW_STORE: string = "show_store";
        public static SHOW_SCENE: string = "show_scene";
        public static SHOW_SCENE_DETAILS: string = "show_scene_details";
        public static SHOW_SETTING: string = "show_setting";

        public static SHOW_GUIDE: string = "show_guide";

        public static SHOW_POPUP: string = "show_popup";

        public register(): void {
            this.initializeNotifier("ApApplicationFacade");
        }

        initializeNotifier(key: string) {
            super.initializeNotifier(key);
            this.facade().registerCommand(SceneCommand.CHANGE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_MANAGE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_DEVE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_STORE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_SCENE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_SCENE_DETAILS, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_SETTING, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_GUIDE, SceneCommand);
            this.facade().registerCommand(SceneCommand.SHOW_POPUP, SceneCommand);
        }

        public async execute(notification: puremvc.INotification): Promise<any> {
            var data: any = notification.getBody();
            var appMediator: ApplicationMediator =
                <ApplicationMediator><any>this.facade().retrieveMediator(ApplicationMediator.NAME);

            var gameProxy: GameProxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            switch (notification.getName()) {
                case SceneCommand.CHANGE: 
                    if (data == Scene.Start) {
                        appMediator.main.enterStartScreen();
                    }
                    else if (data == Scene.Game) {
                        appMediator.main.enterGameScreen();
                    }
                    break;
                case SceneCommand.SHOW_STORE:
                    appMediator.main.showStoreWindow();
                    break;
                case SceneCommand.SHOW_SCENE:
                    appMediator.main.showSceneSummaryWindow();
                    break;
                case SceneCommand.SHOW_SCENE_DETAILS:
                    appMediator.main.showSceneDetailsWindow(data);
                    break;
                case SceneCommand.SHOW_DEVE:
                    appMediator.main.showDeveloperWindow();
                    break;
                case SceneCommand.SHOW_MANAGE:
                    appMediator.main.showManageWindow();
                    break;
                case SceneCommand.SHOW_SETTING:
                    appMediator.main.showSettingWindow();
                    break;
                case SceneCommand.SHOW_GUIDE:
                    appMediator.main.showGuideWindow();
                    break;
                case SceneCommand.SHOW_POPUP:
                    if (typeof data === "string") {
                        appMediator.main.showPopupWindow(data);
                    }
                    else {
                        appMediator.main.showPopupWindow(data.msg, data.hasCancel, data.cbk);
                    }
                    break;
            }
        }
    }
}