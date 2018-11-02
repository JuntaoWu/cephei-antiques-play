
module game {

    export class ManageWindowMediator extends puremvc.Mediator implements puremvc.IMediator {
        public static NAME: string = "ManageWindowMediator";

        private proxy: GameProxy;
        public change: Change;

        public constructor(viewComponent: any) {
            super(ManageWindowMediator.NAME, viewComponent);
            super.initializeNotifier("ApplicationFacade");
            this.proxy = <GameProxy><any>this.facade().retrieveProxy(GameProxy.NAME);

            this.manageWindow.yes.addEventListener(egret.TouchEvent.TOUCH_TAP, this.yes, this);
            this.manageWindow.no.addEventListener(egret.TouchEvent.TOUCH_TAP, this.no, this);
            this.manageWindow.addEventListener(egret.Event.ADDED_TO_STAGE, this.initData, this);
            this.manageWindow.gameList.addEventListener(eui.ItemTapEvent.ITEM_TAP, this.selectItem, this);
            this.manageWindow.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
            this.initData();
        }

        private manageEvent: any;
        public initData() {
            this.chushishezhi();
            this.haha();
        }

        public haha() {
            this.manageWindow.gu1.text = this.proxy.playerInfo.guPrice[0].toString();
            this.manageWindow.gu2.text = this.proxy.playerInfo.guPrice[1].toString();
            this.manageWindow.gu3.text = this.proxy.playerInfo.guPrice[2].toString();
            this.manageWindow.gu4.text = this.proxy.playerInfo.guPrice[3].toString();
            this.manageWindow.coll1.text = this.proxy.playerInfo.guColl[0].toString();
            this.manageWindow.coll2.text = this.proxy.playerInfo.guColl[1].toString();
            this.manageWindow.coll3.text = this.proxy.playerInfo.guColl[2].toString();
            this.manageWindow.coll4.text = this.proxy.playerInfo.guColl[3].toString();
            this.manageWindow.clock.text = this.proxy.playerInfo.time.toString();
            this.manageWindow.gold.text = this.proxy.playerInfo.gold;
            if (this.manageEvent.subType == "有选项") {
                this.manageWindow.option.visible = true;
                this.manageWindow.text1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
            } else if (this.manageEvent.type == "小游戏") {
                this.manageWindow.option.visible = false;
                this.manageWindow.text1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
            } else {
                this.manageWindow.option.visible = false;
                this.manageWindow.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
                this.change = { ...this.proxy.changeArr.get(this.manageEvent.Column9.toString()) };
            }
        }

        public yes() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedYes.toString()) };
            this.nextManageEvent();
        }

        public no() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedNo.toString()) };
            this.nextManageEvent();
        }

        public gogog() {
            console.log(this.change);
            if (this.change.leixing1 == "古董数量变化") {
                let aa: Array<string> = ["木器", "书画", "青铜", "金玉"];
                if (this.change.mubiao1 == "随机") {
                    this.proxy.playerInfo.guColl[this.suiji(0, 3)] += parseInt(this.change.shuzhi1);
                } else if (this.change.mubiao1 == "价值最低") {
                    this.jiazhipaixu();
                    if (this.ary[0] != this.ary[1]) {
                        this.proxy.playerInfo.guColl[this.proxy.playerInfo.guPrice.indexOf(this.ary[0])] += parseInt(this.change.shuzhi1);
                    }
                } else if (this.change.mubiao1 == "所有") {
                    for (let i = 0; i < 4; i++) {
                        this.proxy.playerInfo.guColl[i] += parseInt(this.change.shuzhi1);
                    }
                } else {
                    this.proxy.playerInfo.guColl[aa.indexOf(this.change.mubiao1)] += parseInt(this.change.shuzhi1);
                }
            }
            if (this.change.leixing2 == "价格变化") {
                let aa: Array<string> = ["木器", "书画", "青铜", "金玉"];
                if (this.change.mubiao2 == "随机") {
                    if (this.change.chengyi) {
                        this.proxy.playerInfo.guPrice[this.suiji(0, 3)] *= parseFloat(this.change.shuzhi2);
                    } else {
                        this.proxy.playerInfo.guPrice[this.suiji(0, 3)] += parseInt(this.change.shuzhi2);
                    }
                } else if (this.change.mubiao2 == "价值最低") {
                    this.jiazhipaixu();
                    if (this.ary[0] != this.ary[1]) {
                        this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[0])] += parseInt(this.change.shuzhi2);
                    }
                } else if (this.change.mubiao2 == "所有") {
                    for (let i = 0; i < 4; i++) {
                        if (this.change.chengyi) {
                            this.proxy.playerInfo.guPrice[i] *= parseFloat(this.change.shuzhi2);
                        } else {
                            this.proxy.playerInfo.guPrice[i] += parseInt(this.change.shuzhi2);
                        }
                    }
                } else {
                    if (this.change.chengyi) {
                        this.proxy.playerInfo.guPrice[aa.indexOf(this.change.mubiao2)] *= parseFloat(this.change.shuzhi2);
                    } else {
                        this.proxy.playerInfo.guPrice[aa.indexOf(this.change.mubiao2)] += parseInt(this.change.shuzhi2);
                    }
                }
            }
            for (let i = 0; i < 4; i++) {
                this.proxy.playerInfo.guPrice[i] = Math.floor(this.proxy.playerInfo.guPrice[i] + 0.5);
            }
        }

        public ary: Array<any>;
        public jiazhipaixu() {
            this.ary = this.proxy.playerInfo.guPrice;
            this.ary.sort(function (a, b) { return a - b; });
        }

        public shuzu: Array<number> = [0, 0, 0, 0];
        public chushi(data: number) {
            let Range = data;
            let Rand;
            for (let i = 0; i < 3; i++) {
                Rand = Math.random();
                this.shuzu[i] = Math.round(Rand * Range);
                Range -= this.shuzu[i];
            };
            this.shuzu[3] = Range;
        }

        public suiji(min: number, max: number) {
            let data = max - min;
            let aa = Math.random();
            return (min + Math.round(aa * data));
        }

        public zongjiazhi: number = 10;
        public zongbaowushu: number = 20;
        public chushishezhi() {
            let haha: number = 0;
            for (let i = 0; i < 4; i++) {
                haha += this.proxy.playerInfo.guPrice[i];
            }
            if (haha == 0 && this.proxy.playerInfo.time == 24) {
                this.chushi(this.zongjiazhi);
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guPrice[i] = this.shuzu[i];
                }
                this.chushi(this.zongbaowushu);
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guColl[i] = this.shuzu[i];
                }
            }
            if (!this.proxy.playerInfo.guEventList.length) {
                this.manageEvent = this.proxy.getRandomManageEvent();
            }
            else {
                this.manageEvent = this.proxy.manageEventArr.find(i => i.id == this.proxy.playerInfo.guEventList[this.proxy.playerInfo.guEventList.length - 1]);
            }
            console.log(this.manageEvent);
            this.setManageEvent();
        }


        public selectItem() {
            this.gameImgList.forEach(i => {
                if (i.res == this.manageWindow.gameList.selectedItem.res) {
                    i.isSelected = !i.isSelected;
                }
            })
            let selectedImg = this.gameImgList.filter(i => i.isSelected);
            let isRight = true;
            if (selectedImg.length != this.answerImgList.length) {
                isRight = false;
            } else {
                selectedImg.forEach(i => {
                    if (!this.answerImgList.includes(i.res)) {
                        isRight = false;
                    }
                })
            }
            console.log(isRight, selectedImg, this.answerImgList);
            if (isRight) {
                this.nextManageEvent();
            }
        }

        public gameImgList: Array<any>;
        public answerImgList: Array<any>;
        public setManageEvent() {
            this.manageWindow.showGameGroup = false;
            if (!this.manageEvent) return;
            console.log(this.manageEvent.type, this.manageEvent.subType);
            this.manageWindow.description = this.manageEvent.description;
            if (this.manageEvent.type == "小游戏") {
                this.manageWindow.showGameGroup = true;
                this.manageWindow.gameTrueFalse.visible = this.manageWindow.gameList.visible = false;
                if (this.manageEvent.subType == "猜真假") {
                    this.manageWindow.gameTrueFalse.visible = true;
                }
                else {
                    this.gameImgList = [];
                    this.answerImgList = [];
                    this.manageWindow.gameList.visible = true;
                    let resTypeList = ["qingtong", "shuhua", "muqi", "ciqi", "yu"];
                    let randomTypeIndex = _.random(0, 4);
                    let yitong = [4, 5, 6];
                    let randomIndex = _.random(0, 2);
                    let randomNum = _.random(1, 8);
                    switch (this.manageEvent.subType) {
                        case "找不同": 
                            for (let i = 0; i < 4; i++) {
                                if (i == randomIndex) {
                                    this.gameImgList.push({ 
                                        res: `${resTypeList[randomTypeIndex]}(${yitong[i]})`, 
                                        isSelected: false 
                                    })
                                    this.answerImgList.push(`${resTypeList[randomTypeIndex]}(${yitong[i]})`);
                                } 
                                else {
                                    let i = (1 + randomIndex) % 3;
                                    this.gameImgList.push({ 
                                        res: `${resTypeList[randomTypeIndex]}(${yitong[i]})`, 
                                        isSelected: false 
                                    })
                                }
                            }
                            break;
                        case "找相同": 
                            this.gameImgList = yitong.map(i => {
                                return { 
                                    res: `${resTypeList[randomTypeIndex]}(${i})`, 
                                    isSelected: false 
                                }
                            })
                            this.gameImgList.push({ 
                                res: `${resTypeList[randomTypeIndex]}(${yitong[randomIndex]})`, 
                                isSelected: false 
                            })
                            this.answerImgList.push(`${resTypeList[randomTypeIndex]}(${yitong[randomIndex]})`, `${resTypeList[randomTypeIndex]}(${yitong[randomIndex]})`);
                            break;
                        case "找同类":
                            // 同类
                            this.gameImgList.push({ 
                                res: `${resTypeList[randomTypeIndex]}(${randomNum})`, 
                                isSelected: false 
                            }, {
                                res: `${resTypeList[randomTypeIndex]}(${(randomTypeIndex + randomNum) % 8 + 1})`, 
                                isSelected: false 
                            })
                            this.answerImgList.push(`${resTypeList[randomTypeIndex]}(${randomNum})`, `${resTypeList[randomTypeIndex]}(${(randomTypeIndex + randomNum) % 8 + 1})`);
                            // 异类
                            let otherTypeIndex = _.random(0, 4);
                            while (otherTypeIndex == randomTypeIndex) {
                                otherTypeIndex = _.random(0, 4);
                            }
                            let otherTypeIndex2 = _.random(0, 4);
                            while (otherTypeIndex2 == randomTypeIndex || otherTypeIndex2 == otherTypeIndex) {
                                otherTypeIndex2 = _.random(0, 4);
                            }
                            this.gameImgList.push({ 
                                res: `${resTypeList[otherTypeIndex]}(${(otherTypeIndex2 + randomNum) % 8 + 1})`, 
                                isSelected: false 
                            }, {
                                res: `${resTypeList[otherTypeIndex2]}(${(otherTypeIndex + randomNum) % 8 + 1})`, 
                                isSelected: false 
                            })
                            break;
                        case "找异类": 
                            let index = _.random(0, 3);
                            this.gameImgList = [0,1,2,3].map(i => {
                                let obj = null;
                                if (i == index) {
                                    let otherTypeIndex = _.random(0, 4);
                                    while (otherTypeIndex == randomTypeIndex) {
                                        otherTypeIndex = _.random(0, 4);
                                    }
                                    obj = {
                                        res: `${resTypeList[otherTypeIndex]}(${randomNum})`, 
                                        isSelected: false 
                                    }
                                    this.answerImgList.push(`${resTypeList[otherTypeIndex]}(${randomNum})`);
                                }
                                else {
                                    obj = { 
                                        res: `${resTypeList[randomTypeIndex]}(${(randomTypeIndex + randomNum + i) % 8 + 1})`, 
                                        isSelected: false 
                                    }
                                }
                                return obj;
                            })
                            break;
                    }
                    this.manageWindow.gameList.dataProvider = new eui.ArrayCollection(this.gameImgList);
                    this.manageWindow.gameList.itemRenderer = ManageGameItemRenderer;
                }
            }
            else {

            }
        }

        public nextManageEvent() {
            this.gogog();
            this.proxy.playerInfo.time--;
            this.manageEvent = this.proxy.getRandomManageEvent();
            this.setManageEvent();
            this.haha();
        }

        public get manageWindow(): ManageWindow {
            return <ManageWindow><any>(this.viewComponent);
        }
    }
}