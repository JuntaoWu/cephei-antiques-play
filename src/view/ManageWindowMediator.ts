
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
            // this.initData();
        }

        private manageEvent: any;
        public initData() {
            this.chushishezhi();
            this.haha();
        }

        public haha() {
            if (!this.manageEvent) {
                let gold_haha: number = 0;
                this.manageWindow.option.visible = false;
                this.manageWindow.text1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
                this.manageWindow.text1.text = "OVER";
                this.proxy.playerInfo.guPrice[this.suiji(0, 3)] *= 4;
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guPrice[i] *= 0.5;
                    this.proxy.playerInfo.guPrice[i] = Math.floor(this.proxy.playerInfo.guPrice[i] + 0.5);
                    if (this.proxy.playerInfo.guPrice[i] <= 0) {
                        this.proxy.playerInfo.guPrice[i] = 1;
                    }
                    gold_haha += (this.proxy.playerInfo.guPrice[i] * this.proxy.playerInfo.guColl[i]);
                }
                platform.showModal("你获得了" + gold_haha + "金币", false);
            } else {
                if (this.manageEvent.subType == "有选项" || this.manageEvent.type == "角色") {
                    this.manageWindow.option.visible = true;
                    this.manageWindow.text1.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
                } else if (this.manageEvent.type == "小游戏") {
                    this.manageWindow.option.visible = false;
                    this.change = { ...this.proxy.changeArr.get("53") };
                } else {
                    this.manageWindow.option.visible = false;
                    this.manageWindow.text1.addEventListener(egret.TouchEvent.TOUCH_TAP, this.nextManageEvent, this);
                    this.change = { ...this.proxy.changeArr.get(this.manageEvent.Column9.toString()) };
                }
            }
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
        }

        public yes() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedYes.toString()) };
            this.nextManageEvent();
        }

        public no() {
            this.change = { ...this.proxy.changeArr.get(this.manageEvent.selectedNo.toString()) };
            this.nextManageEvent();
        }

        public eachGu: number = 0;
        public gogog() {
            console.log(this.change);
            let aa: Array<string> = ["木器", "书画", "青铜", "金玉"];          

            if (this.change.leixing1 == "古董数量变化") {
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
                } else if (this.change.mubiao1 == "随机两种古董") {
                    let no1: number = this.suiji(0, 3);
                    let no2: number = this.suiji(0, 2);
                    no2 = (no1 + no2) % 4;
                    this.proxy.playerInfo.guColl[no1] += 2;
                    this.proxy.playerInfo.guColl[no2] += 2;
                } else if (this.change.mubiao1 == "每回合") {
                    this.eachGu += parseInt(this.change.shuzhi1);
                } else if (this.change.mubiao1 == "特殊1") {
                    this.shuliangpaixu();
                    if (this.ary2[0] != this.ary2[1]) {
                        let less: number = this.proxy.playerInfo.guColl.indexOf(this.ary2[0]);
                        let hh: number = 0;
                        for (let i = 0; i < 4; i++) {
                            this.proxy.playerInfo.guColl[i] *= 0.5;
                            hh += this.proxy.playerInfo.guColl[i];
                        }
                        this.proxy.playerInfo.guColl[less] += hh;
                    }
                } else if (this.change.mubiao1 == "特殊2") {
                    this.shuliangpaixu();
                    if (this.ary2[3] > this.ary2[2]) {
                        let more: number = this.proxy.playerInfo.guColl.indexOf(this.ary2[3]);
                        let a: number = this.proxy.playerInfo.guColl[more] / 4;
                        this.proxy.playerInfo.guColl[more] = 0;
                        for (let i = 0; i < 4; i++) {
                            this.proxy.playerInfo.guColl[i] += a;
                        }
                    }
                } else {
                    if (this.change.tiaojian1 == "青铜价格最高") {
                        this.mmpriceMax(2);
                    } else if (this.change.tiaojian1 == "青铜数量最多") {
                        this.mmNumMax(2);
                    } else if (this.change.tiaojian1 == "木器价格最高") {
                        this.mmpriceMax(0);
                    } else if (this.change.tiaojian1 == "木器数量最多") {
                        this.mmNumMax(0);
                    } else if (this.change.tiaojian1 == "书画价格最高") {
                        this.mmpriceMax(1);
                    } else if (this.change.tiaojian1 == "书画数量最多") {
                        this.mmNumMax(1);
                    } else if (this.change.tiaojian1 == "金玉价格最高") {
                        this.mmpriceMax(3);
                    } else if (this.change.tiaojian1 == "金玉数量最多") {
                        this.mmNumMax(3);
                    } else if (this.change.tiaojian1 == "随机") {
                        let xx: Array<any> = [0, 0, 0, 0];
                        let Range = parseInt(this.change.shuzhi1);
                        let Rand;
                        for (let i = 0; i < 3; i++) {
                            Rand = Math.random();
                            xx[i] += Math.round(Rand * Range);
                            Range -= xx[i];
                        };
                        xx[3] += Range;
                        console.log(xx);
                        for (let i = 0; i < 4; i++) {
                            this.proxy.playerInfo.guColl[i] += xx[i];
                        }
                    } else {
                        this.proxy.playerInfo.guColl[aa.indexOf(this.change.mubiao1)] += parseInt(this.change.shuzhi1);
                    }
                }
            } else if (this.change.leixing1 == "价格变化") {
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guPrice[i] *= parseFloat(this.change.shuzhi1);
                }
                this.proxy.playerInfo.guPrice[aa.indexOf(this.change.tiaojian1)] /= parseFloat(this.change.shuzhi1);
            }

            if (this.change.leixing2 == "价格变化") {
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
                } else if (this.change.mubiao2 == "第一二古董价格") {
                    this.jiazhipaixu();
                    if (this.ary[1] != this.ary[2]) {
                        if (this.change.chengyi) {
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[1])] *= parseFloat(this.change.shuzhi2);
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[0])] *= parseFloat(this.change.shuzhi2);
                        } else {
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[1])] += parseInt(this.change.shuzhi2);
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[0])] += parseInt(this.change.shuzhi2);
                        }
                    }
                } else if (this.change.mubiao2 == "第三四古董价格") {
                    this.jiazhipaixu();
                    if (this.ary[1] != this.ary[2]) {
                        if (this.change.chengyi) {
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[2])] *= parseFloat(this.change.shuzhi2);
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[3])] *= parseFloat(this.change.shuzhi2);
                        } else {
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[2])] += parseInt(this.change.shuzhi2);
                            this.proxy.playerInfo.guPrice[this.proxy.playerInfo.guPrice.indexOf(this.ary[3])] += parseInt(this.change.shuzhi2);
                        }
                    }
                } else {
                    if (this.change.chengyi) {
                        this.proxy.playerInfo.guPrice[aa.indexOf(this.change.mubiao2)] *= parseFloat(this.change.shuzhi2);
                    } else {
                        this.proxy.playerInfo.guPrice[aa.indexOf(this.change.mubiao2)] += parseInt(this.change.shuzhi2);
                    }
                }
            } else if (this.change.leixing2 == "回合变化") {
                this.proxy.playerInfo.time -= parseInt(this.change.shuzhi2);
            } else if (this.change.leixing2 == "古董数量变化") {
                if (this.change.tiaojian2 == "五回合") {
                    this.five[aa.indexOf(this.change.mubiao2)] = 5;
                } else {
                    for (let i = 0; i < 4; i++) {
                        this.proxy.playerInfo.guColl[i] += parseInt(this.change.shuzhi2);
                    }
                    this.proxy.playerInfo.guColl[aa.indexOf(this.change.tiaojian2)] -= parseInt(this.change.shuzhi2);
                }
            }
            this.shuzhijiance();
        }

        public shuzhijiance() {
            for (let i = 0; i < 4; i++) {
                this.proxy.playerInfo.guPrice[i] = Math.floor(this.proxy.playerInfo.guPrice[i] + 0.5);
                this.proxy.playerInfo.guColl[i] = Math.floor(this.proxy.playerInfo.guColl[i] + 0.5);
                if (this.proxy.playerInfo.guPrice[i] <= 0) {
                    this.proxy.playerInfo.guPrice[i] = 1;
                }
                if (this.proxy.playerInfo.guColl[i] < 0) {
                    this.proxy.playerInfo.guColl[i] = 0;
                }
            }
        }

        public mmpriceMax(data: number) {
            this.jiazhipaixu();
            if (this.ary[3] != this.ary[2] && this.proxy.playerInfo.guPrice[data] == this.ary[3]) {
                this.proxy.playerInfo.guColl[data] += 5;
            }
        }

        public mmNumMax(data: number) {
            this.shuliangpaixu();
            if (this.ary2[3] != this.ary2[2] && this.proxy.playerInfo.guColl[data] == this.ary2[3]) {
                this.proxy.playerInfo.guColl[data] *= 1.5;
            }
        }

        public ary: Array<any> = [0, 0, 0, 0];
        public jiazhipaixu() {
            for (let i = 0; i < 4; i++) {
                this.ary[i] = this.proxy.playerInfo.guPrice[i];
            }
            this.ary.sort(function (a, b) { return a - b; });
        }

        public ary2: Array<any> = [0, 0, 0, 0];
        public shuliangpaixu() {
            for (let i = 0; i < 4; i++) {
                this.ary2[i] = this.proxy.playerInfo.guColl[i];
            }
            this.ary2.sort(function (a, b) { return a - b; });
        }

        public shuzu: Array<number> = [1, 1, 1, 1];
        public chushi(data: number) {
            let Range = data;
            let Rand;
            for (let i = 0; i < 3; i++) {
                Rand = Math.random();
                this.shuzu[i] += Math.round(Rand * Range);
                Range -= this.shuzu[i];
                Range++;
            };
            this.shuzu[3] += Range;
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
                this.chushi(this.zongjiazhi - 4);
                for (let i = 0; i < 4; i++) {
                    this.proxy.playerInfo.guPrice[i] = this.shuzu[i];
                }
                // this.chushi(this.zongbaowushu);
                // for (let i = 0; i < 4; i++) {
                //     this.proxy.playerInfo.guColl[i] = this.shuzu[i];
                // }
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

        public gameImgList: Array<any>;
        public answerImgList: Array<any>;
        public trueFalseList: Array<boolean>;
        public trueAndFalseUIList: Array<eui.Group>;
        public setManageEvent() {
            this.manageWindow.miniGameGroup.visible = false;
            if (!this.manageEvent) return;
            console.log(this.manageEvent.type, this.manageEvent.subType);
            this.manageWindow.description = this.manageEvent.description;
            if (this.manageEvent.type == "小游戏") {
                this.canSelectedCard = false;
                this.manageWindow.miniGameGroup.visible = true;
                this.selectedImg = [];
                this.manageWindow.gameTrueFalse.visible = this.manageWindow.gameList.visible = false;
                this.manageWindow.gameTrueFalse.removeChildren();
                if (this.manageEvent.subType == "猜真假") {
                    this.manageWindow.gameTrueFalse.visible = true;
                    this.trueAndFalseUIList = [];
                    this.trueFalseList = [
                        true, true, true
                        , true, true, true
                        , true, true, true
                    ]
                    for (let i = 0; i < 3; i++) {
                        let randomIndex = _.random(i * 3, i * 3 + 2);
                        this.trueFalseList[randomIndex] = false;
                    }
                    this.trueFalseList.forEach((v, i) => {
                        let img = new eui.Image();
                        img.source = "manage-card2";
                        img.name = "img";
                        let textLabel = new eui.Label();
                        textLabel.text = v ? "真" : "假";
                        textLabel.size = 60;
                        textLabel.horizontalCenter = 0;
                        textLabel.verticalCenter = 0;
                        let group = new eui.Group();
                        group.addChild(img);
                        group.addChild(textLabel);
                        group.name = i.toString();
                        group.x = i % 3 ? 215 * (i % 3) : 0;
                        group.y = (i - i % 3) / 3 ? 280 * ((i - i % 3) / 3) : 0;
                        this.manageWindow.gameTrueFalse.addChild(group);
                        group.addEventListener(egret.TouchEvent.TOUCH_TAP, this.trueFalseSelect, this);
                        this.trueAndFalseUIList.push(group);
                    })
                    egret.setTimeout(() => {
                        this.transferCards();
                    }, this, 3000);
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
                            this.gameImgList = [0, 1, 2, 3].map(i => {
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
                    this.gameImgList.forEach((i, index) => {
                        i.index = index;
                    })
                    this.manageWindow.gameList.dataProvider = new eui.ArrayCollection(this.gameImgList);
                    this.manageWindow.gameList.itemRenderer = ManageGameItemRenderer;
                    this.canSelectedCard = true;
                }
            }
            else {

            }
        }

        public selectedImg: Array<any>;
        public selectItem() {
            if (!this.canSelectedCard) return;
            this.gameImgList.forEach(i => {
                if (i.index == this.manageWindow.gameList.selectedItem.index) {
                    i.isSelected = !i.isSelected;
                    this.selectedImg.push(i);
                }
            })
            if (this.selectedImg.length > this.answerImgList.length) {
                let shiftItem = this.selectedImg.shift();
                this.gameImgList.find(i => i.index == shiftItem.index).isSelected = false;
            }
            let isRight = true;
            if (this.selectedImg.length == this.answerImgList.length) {
                this.selectedImg.forEach(i => {
                    if (!this.answerImgList.includes(i.res)) {
                        isRight = false;
                    }
                })
                this.setGameReward(isRight);
            }
            console.log(isRight, this.selectedImg, this.answerImgList);
        }

        private canSelectedCard: boolean;
        public trueFalseSelect(e: egret.TouchEvent) {
            if (!this.canSelectedCard) return;
            let currentImg = e.currentTarget.getChildByName("img") as eui.Image;
            e.currentTarget.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.trueFalseSelect, this);
            console.log(currentImg.name);
            currentImg.source = "manage-card2";
            e.currentTarget.addChildAt(currentImg, 0);
            this.selectedImg.push(this.trueFalseList[e.currentTarget.name]);
            if (this.selectedImg.length == 2) {
                if (!this.selectedImg.includes(true)) {
                    this.setGameReward(true);
                }
                else {
                    this.setGameReward(false);
                }
            }
        }

        public setGameReward(isRight: boolean) {
            this.canSelectedCard = false;
            let img = new eui.Image();
            img.source = isRight ? "manage-right" : "manage-errer";
            img.top = 50;
            img.horizontalCenter = 0;
            img.alpha = 0;
            this.manageWindow.miniGameGroup.addChild(img);
            egret.Tween.get(img).to({ alpha: 1 }, 1000).call(() => {
                this.manageWindow.miniGameGroup.removeChild(img);
                this.nextManageEvent();
            })
            if (!isRight) return;
            let rewardList = [];
            if (this.manageEvent.subType == "找不同") {
                rewardList = [2, 1, 1, 1];
            }
            else if (this.manageEvent.subType == "找相同") {
                rewardList = [1, 2, 1, 1];
            }
            else if (this.manageEvent.subType == "找同类") {
                rewardList = [1, 1, 2, 1];
            }
            else if (this.manageEvent.subType == "找异类") {
                rewardList = [2, 1, 1, 2];
            }
            else if (this.manageEvent.subType == "猜真假") {
                rewardList = [3, 3, 3, 3];
            }
            rewardList.forEach((v, i) => {
                this.proxy.playerInfo.guColl[i] += v;
            })
        }

        public transferCards() {
            this.trueAndFalseUIList.forEach(i => {
                let img = i.getChildByName("img") as eui.Image;
                i.addChild(img);
                egret.Tween.get(img).to({ scaleX: 0.5 }, 500).call(() => {
                    img.source = "manage-card1";
                    egret.Tween.get(img).to({ scaleX: 1 }, 500);
                });
            })
            egret.setTimeout(() => {
                let randomIndex = _.random(0, 2);
                let swapIndex = _.random(0, 8);
                swapIndex = randomIndex == swapIndex ? swapIndex + 1 : swapIndex;
                let randomX = this.trueAndFalseUIList[randomIndex].x;
                let randomY = this.trueAndFalseUIList[randomIndex].y;
                let swapX = this.trueAndFalseUIList[swapIndex].x;
                let swapY = this.trueAndFalseUIList[swapIndex].y;
                this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[randomIndex]);
                this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[swapIndex]);
                egret.Tween.get(this.trueAndFalseUIList[randomIndex]).to({ x: swapX, y: swapY }, 1000);
                egret.Tween.get(this.trueAndFalseUIList[swapIndex]).to({ x: randomX, y: randomY }, 1000).call(() => {
                    let randomIndex = _.random(3, 5);
                    let swapIndex = _.random(0, 8);
                    swapIndex = randomIndex == swapIndex ? swapIndex + 1 : swapIndex;
                    let randomX = this.trueAndFalseUIList[randomIndex].x;
                    let randomY = this.trueAndFalseUIList[randomIndex].y;
                    let swapX = this.trueAndFalseUIList[swapIndex].x;
                    let swapY = this.trueAndFalseUIList[swapIndex].y;
                    this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[randomIndex]);
                    this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[swapIndex]);
                    egret.Tween.get(this.trueAndFalseUIList[randomIndex]).to({ x: swapX, y: swapY }, 1000);
                    egret.Tween.get(this.trueAndFalseUIList[swapIndex]).to({ x: randomX, y: randomY }, 1000).call(() => {
                        let randomIndex = _.random(6, 8);
                        let swapIndex = _.random(0, 8);
                        swapIndex = randomIndex == swapIndex ? swapIndex - 1 : swapIndex;
                        let randomX = this.trueAndFalseUIList[randomIndex].x;
                        let randomY = this.trueAndFalseUIList[randomIndex].y;
                        let swapX = this.trueAndFalseUIList[swapIndex].x;
                        let swapY = this.trueAndFalseUIList[swapIndex].y;
                        this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[randomIndex]);
                        this.manageWindow.gameTrueFalse.addChild(this.trueAndFalseUIList[swapIndex]);
                        egret.Tween.get(this.trueAndFalseUIList[randomIndex]).to({ x: swapX, y: swapY }, 1000);
                        egret.Tween.get(this.trueAndFalseUIList[swapIndex]).to({ x: randomX, y: randomY }, 1000);
                        this.canSelectedCard = true;
                    });
                });
            }, this, 1000)
        }

        public five: Array<any> = [-1, -1, -1, -1];
        public nextManageEvent() {
            this.gogog();
            this.fivehaha();
            this.proxy.playerInfo.time--;
            this.proxy.playerInfo.guColl[this.suiji(0, 3)] += this.eachGu;
            this.manageEvent = this.proxy.getRandomManageEvent();
            this.setManageEvent();
            this.haha();
        }

        public fivehaha() {
            for (let i = 0; i < 4; i++) {
                this.five[i]--;
                if (this.five[i] == 0) {
                    this.proxy.playerInfo.guColl[i] -= 10;
                }
            }
            this.shuzhijiance();
        }

        public get manageWindow(): ManageWindow {
            return <ManageWindow><any>(this.viewComponent);
        }
    }
}