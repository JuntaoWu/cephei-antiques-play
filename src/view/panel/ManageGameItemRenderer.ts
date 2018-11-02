module game {

    export class ManageGameItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "ManageGameItemSkin";
        }

        protected createChildren(): void {
            super.createChildren();
        }

        protected dataChanged(): void {
            if (this.data.isSelected) {
                this.scaleX = this.scaleY = 1.2;
            }
        }
    }
}