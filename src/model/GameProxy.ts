module game {

    export class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
        public static NAME: string = "GameProxy";

        //小游戏
        public static SHOW_MINIGAME: string = "show_minigame";
        //重置小游戏
        public static RESET_MINIGAME: string = "reset_minigame";
        //小游戏确认提交结果
        public static CONFIRM_MINIGAME: string = "confirm_minigame";
        //通过小游戏
        public static PASS_MINIGAME: string = "pass_minigame";
        //小游戏减体力值
        public static REDUCE_POWER: string = "reduce_power";

        public playerInfo: PlayerInfo = {
            plotId: 1,
            collectedScenes: [],
            fatigueValue: fatigueValue,
            gold: "0",
            lastEntryTime: "",
            hints: 50,
            time: 24,
            guPrice: [0, 0, 0, 0],
            guColl: [5, 5, 5, 5],
            guEventList: [],
            sound: true,
            music: true,
            isManage: false,
            ending: [],
            pointHunag: 43,
            pointMu: 43,
        };

        public constructor() {
            super(GameProxy.NAME);
        }

        private _questions: Map<string, any>;
        public get questions(): Map<string, any> {
            if (!this._questions) {
                this._questions = new Map(Object.entries(RES.getRes("question_json")));
            }
            return this._questions;
        }

        private _chapterPlot: Map<string, any>;
        public get chapterPlot(): Map<string, any> {
            if (!this._chapterPlot) {
                this._chapterPlot = new Map(Object.entries(RES.getRes("chapter-plot_json")));
            }
            return this._chapterPlot;
        }

        public getCurrentPlot(): Plot {
            this.savePlayerInfoToStorage();
            return this.chapterPlot.get(this.playerInfo.plotId.toString());
        }

        private _changeArr: Map<string, any>;
        public get changeArr(): Map<string, any> {
            if (!this._changeArr) {
                this._changeArr = new Map(Object.entries(RES.getRes("manage-change_json")));
            }
            return this._changeArr;
        }

        public resetGame() {
            this.playerInfo.plotId = 1;
            this.playerInfo.pointMu = this.playerInfo.pointHunag = 43;
        }

        /**
         * 进入故事下一个情节
         */
        public nextPlot(skipPlotNum: number = 1): void {
            this.playerInfo.plotId += skipPlotNum;
        }

        public canReduecePower(value: number = 1): boolean {
            return this.playerInfo.fatigueValue >= value;
        }

        public addEnding(ending: string) {
            if (!this.playerInfo.ending.includes(ending)) {
                this.playerInfo.ending.push(ending);
                this.savePlayerInfoToStorage();
            }
        }

        public addCollectedScenes(sceneCG: string) {
            if (sceneCG == "s0") return;
            if (!this.playerInfo.collectedScenes.includes(sceneCG)) {
                this.playerInfo.collectedScenes.push(sceneCG);
                this.savePlayerInfoToStorage();
            }
        }

        // 减少体力值
        public reducePower(value: number = 1): void {
            this.playerInfo.fatigueValue -= value;
            this.savePlayerInfoToStorage();
            console.log("减", value, "体力，剩余体力值：", this.playerInfo.fatigueValue);
        }

        // 减少提示次数
        public reduceHints(value: number = 1): void {
            this.playerInfo.hints -= value;
            this.savePlayerInfoToStorage();
        }

        private _sceneRes: Map<string, any>;
        public get sceneRes(): Map<string, any> {
            if (!this._sceneRes) {
                let config = RES.getRes("scene_json") as Array<any>;
                let dictionary = _(config).groupBy((a: any) => a.type).value();
                this._sceneRes = new Map(Object.entries(dictionary));
            }
            return this._sceneRes;
        }

        // 经营模式事件列表
        private _manageEventArr: Array<any>;
        public get manageEventArr(): Array<any> {
            if (!this._manageEventArr) {
                this._manageEventArr = RES.getRes("manage-event_json") as Array<any>;
            }
            return this._manageEventArr;
        }
        private _manageEvent: Map<string, any>;
        public get manageEventMap(): Map<string, any> {
            if (!this._manageEvent) {
                let dictionary = _(this.manageEventArr).groupBy((a: any) => a.type).value();
                this._manageEvent = new Map(Object.entries(dictionary));
            }
            return this._manageEvent;
        }

        public getRandomManageEvent(): any {
            let getType = Math.random() < 0.3 ? "小游戏" : (Math.random() < 0.5 ? "随机事件" : "角色");
            let eventList: Array<any> = this.manageEventMap.get(getType);
            let notMeetEvent = eventList.filter(i => !this.playerInfo.guEventList.includes(i.id));
            if (getType == "小游戏") {
                notMeetEvent = eventList.filter(i => !this.playerInfo.guEventList.includes(i.subType));
                if (!notMeetEvent.length) {
                    notMeetEvent = eventList;
                }
            }
            if (this.playerInfo.time <= 0) {
                return null;
            }
            else if (!notMeetEvent.length) {
                return this.getRandomManageEvent();
            }
            else {
                let finalRoundRandomIndex = _.random(0, notMeetEvent.length - 1);
                if (notMeetEvent[finalRoundRandomIndex].type != "小游戏") {
                    this.playerInfo.guEventList.push(notMeetEvent[finalRoundRandomIndex].id);
                }
                else {
                    this.playerInfo.guEventList.push(notMeetEvent[finalRoundRandomIndex].subType);
                }
                return notMeetEvent[finalRoundRandomIndex];
            }
        }

        public async getPlayerInfoFromStorage() {
            try {
                let res = await platform.getStorageAsync("playerInfo");
                console.log("mergeRemoteInfoToStorage: parse playerInfo");
                this.playerInfo = Object.assign(this.playerInfo, JSON.parse(res.data));
                console.log(this.playerInfo)
            }
            catch (error) {
                console.error("localPlayerInfo is not JSON, skip.");
            }
            if (!this.playerInfo.lastEntryTime || this.playerInfo.lastEntryTime != new Date().toJSON().substr(0, 10)) {
                // this.playerInfo.fatigueValue = fatigueValue;
                this.playerInfo.time = 24;
                this.playerInfo.guPrice = [0, 0, 0, 0];
                this.playerInfo.guColl = [5, 5, 5, 5];
                this.playerInfo.guEventList = [];
                this.playerInfo.lastEntryTime = new Date().toJSON().substr(0, 10);
                this.savePlayerInfoToStorage();
            }
        }

        public savePlayerInfoToStorage() {
            try {
                platform.setStorageAsync("playerInfo", JSON.stringify(this.playerInfo));
            }
            catch (error) {
                console.error(error);
            }
        }
    }
}