namespace ap {

    export class SettingWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "SettingWindow";
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public createCompleteEvent(event: eui.UIEvent): void {
            this.height = this.stage.stageHeight;
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            ApplicationFacade.getInstance().registerMediator(new SettingWindowMediator(this));
        }

        public music: eui.Group;
        public music_icon: eui.Image;
        public music_text: eui.Image;
        public sound: eui.Group;
        public sound_icon: eui.Image;
        public sound_text: eui.Image;
    }
}