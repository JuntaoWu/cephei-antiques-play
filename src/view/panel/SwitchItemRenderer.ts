module game {

    export class SwitchItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "SwitchItemSkin";
        }

        private buttonImg: eui.Image;

        protected createChildren(): void {
            super.createChildren();
        }

        protected dataChanged(): void {
            if (this.data.isSelected) {
                this.buttonImg.scaleX = this.buttonImg.scaleY = 0.9;
            }
        }
    }
}