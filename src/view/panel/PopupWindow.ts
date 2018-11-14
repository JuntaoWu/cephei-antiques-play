module game {

    export class PopupWindow extends eui.Panel {

        public constructor() {
            super();
            this.skinName = "PopupWindow";
            this.appVersion = platform.appVersion;
            this.addEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
            this.btnConfirm.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
                this.close();
                this.cbk && this.cbk();
            },this);
        }
        
        public appVersion: string;
        public createCompleteEvent(event: eui.UIEvent): void {
            this.removeEventListener(eui.UIEvent.CREATION_COMPLETE, this.createCompleteEvent, this);
        }

        public textGroup: eui.Group;
        public textIconGroup: eui.Group;
        public textMsg: eui.Label;
        public btnConfirm: eui.Button;
        public msg: string;
        public msg1: string;
        public hasCancel: boolean;
        public cbk: () => {};

        public setPopupWindow(msg: string, hasCancel: boolean = false, cbk: () => {} = null) {
            this.msg = msg;
            this.cbk = cbk;
            this.hasCancel = hasCancel;
            this.btnConfirm.right = hasCancel ? 45 : 190;
            this.showMoneyIcon();
        } 
        
        public showMoneyIcon() {
            if (this.msg.indexOf("青豆") == -1) {
                this.textGroup.visible = false;
            }
            else {
                this.textGroup.visible = true;
                this.textMsg.text = this.msg.replace("青豆", "");
                this.msg = "";
            }
        }

        private insertIcon() {
            this.textIconGroup.removeChildren();
            if (this.msg.indexOf("青豆") == -1) {
                this.textGroup.visible = false;
                return;
            }
            this.textGroup.visible = true;
            let icon: eui.Image = new eui.Image();
            icon.source = "money";
            icon.width = icon.height = 44;
            
            //记录一下关键字的位置
            let idx = this.msg.indexOf("青豆");
            
            //关于位置的信息都获取到了  所以去掉关键字  置空
            let str = this.msg.replace("青豆", `<font size = "${icon.width}">　</font>`);
            this.msg = "";
            
            this.textMsg.textFlow = ( new egret.HtmlTextParser ).parser( str );

            var x = this.textMsg.x + (this.textMsg.size * idx) % 600;
            var y = this.textMsg.y + Math.floor((this.textMsg.size * idx) / 600) * this.textMsg.textHeight;
    
            console.log(x, y)
            icon.x = x;
            icon.y = y;
            this.textIconGroup.addChild(icon);
        }
    }
}