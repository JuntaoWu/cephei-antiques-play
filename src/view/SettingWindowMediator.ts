namespace ap {
    export class SettingWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "SettingWindowMediator";

        private proxy: GameProxy;

        public constructor(viewComponent: any) {
            super(SettingWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);
            this.settingWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);

            this.settingWindow.music.addEventListener(egret.TouchEvent.TOUCH_TAP, this.music, this);
            this.settingWindow.sound.addEventListener(egret.TouchEvent.TOUCH_TAP, this.sound, this);
            this.initData();
        }

        public initData() {

        }

        public music() {
            this.proxy.playerInfo.music = this.proxy.playerInfo.music ? false : true;
            this.settingWindow.music_icon.source = this.proxy.playerInfo.music ? "music_open" : "music_close";
            this.settingWindow.music_text.source = this.proxy.playerInfo.music ? "text_open" : "text_close";

        }

        public sound() {
            this.proxy.playerInfo.sound = this.proxy.playerInfo.sound ? false : true;
            this.settingWindow.sound_icon.source = this.proxy.playerInfo.sound ? "sound_open" : "sound_close";
            this.settingWindow.sound_text.source = this.proxy.playerInfo.sound ? "text_open" : "text_close";
        }

        public get settingWindow(): SettingWindow {
            return <SettingWindow><any>(this.viewComponent);
        }
    }
}