module game {
    export class shop_list extends eui.ItemRenderer {

        public pay:eui.Group;
        public pay_money:eui.Label;

        public constructor() {
            super();
            this.skinName = 'resource/containers/skins_list/shop_list.exml';
            this.pay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.haha,this);
        }

        public haha() {
            console.log("你花费了" + this.pay_money.text);
        }
    }
}
