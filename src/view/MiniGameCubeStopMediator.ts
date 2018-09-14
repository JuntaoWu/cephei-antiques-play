
module game {

    export class MiniGameCubeStopMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "MiniGameCubeStopMediator";

        public constructor(viewComponent: any) {
            super(MiniGameCubeStopMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");

            this.cubeStop.buttonList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            this.cubeStop.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
        }

        public async initData() {
            
            this.dataList = [
                {name: "一" ,img: "m20_1", isSelected: false}
                , {name: "一" ,img: "m20_2", isSelected: false}
                , {name: "一" ,img: "m20_3", isSelected: false}
                , {name: "一" ,img: "m20_4", isSelected: false}
                , {name: "一" ,img: "m20_5", isSelected: false}
                , {name: "一" ,img: "m20_6", isSelected: false}
                , {name: "一" ,img: "m20_7", isSelected: false}
                , {name: "一" ,img: "m20_8", isSelected: false}
                , {name: "一" ,img: "m20_9", isSelected: false}
            ];
            
            this.cubeStop.buttonList.dataProvider = new eui.ArrayCollection(this.dataList);
            this.cubeStop.buttonList.itemRenderer = CubeStopItemRenderer;

        }

        private dataList: Array<any>;
        private selectedList: Array<any> = [];

        public selectItem() {
            console.log(this.cubeStop.buttonList.selectedItem);
            let selectedItem = this.cubeStop.buttonList.selectedItem;
            let selected = this.dataList.find(i => i.img == selectedItem.img);
            let selectedIndex = this.dataList.findIndex(i => i.img == selectedItem.img);
            selected.isSelected = !selected.isSelected;
            if (selectedIndex + 3 < 9) {
                this.dataList[selectedIndex + 3].isSelected = !this.dataList[selectedIndex + 3].isSelected;
            }
            if (selectedIndex - 3 >= 0) {
                this.dataList[selectedIndex - 3].isSelected = !this.dataList[selectedIndex - 3].isSelected;
            }
            if (selectedIndex % 3 != 2) {
                this.dataList[selectedIndex + 1].isSelected = !this.dataList[selectedIndex + 1].isSelected;
            }
            if (selectedIndex % 3 != 0) {
                this.dataList[selectedIndex - 1].isSelected = !this.dataList[selectedIndex - 1].isSelected;
            }

            if (!this.dataList.find(i => !i.isSelected)) {
                this.cubeStop.buttonList.touchEnabled = false;
                this.cubeStop.buttonList.touchChildren = false;
                this.sendNotification(GameProxy.PASS_MINIGAME);
            }
            this.cubeStop.buttonList.dataProvider = new eui.ArrayCollection(this.dataList);
            this.cubeStop.buttonList.itemRenderer = CubeStopItemRenderer;
        }

        public get cubeStop(): MiniGameCubeStop {
            return <MiniGameCubeStop><any>(this.viewComponent);
        }
    }
}