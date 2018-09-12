module game {

    export class CubeStopItemRenderer extends eui.ItemRenderer {

        public constructor() {
            super();
            this.skinName = "CubeStopItemSkin";
        }

        private img: string;

        protected createChildren(): void {
            super.createChildren();
        }

        protected dataChanged(): void {
            this.img = this.data.isSelected ? this.data.img : "m20_0";
        }
    }
}