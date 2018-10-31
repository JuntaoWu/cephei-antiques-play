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
            plotId: 9,
            collectedScenes: [],
            fatigueValue: fatigueValue,
            gold: "40",
            lastEntryTime: "",
            hints: 50,
        };
        public pointHunag: number = 43;
        public pointMu: number = 43;

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

        /**
         * 进入故事下一个情节
         */
        public nextPlot(skipPlotNum: number = 1): void {
            this.playerInfo.plotId += skipPlotNum;
        }

        public canReduecePower(value: number = 1): boolean {
            return this.playerInfo.fatigueValue >= value;
        }

        // 减少体力值
        public reducePower(value: number = 1): void {
            this.playerInfo.fatigueValue -= value;
            console.log("减", value, "体力，剩余体力值：", this.playerInfo.fatigueValue);
        }

        // 减少提示次数
        public reduceHints(value: number = 1): void {
            this.playerInfo.hints -= value;
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

        public async getPlayerInfoFromStorage() {
            try {
                let res = await platform.getStorageAsync("playerInfo");
                console.log("mergeRemoteInfoToStorage: parse playerInfo");
                this.playerInfo = JSON.parse(res.data);
                console.log(this.playerInfo)
            }
            catch (error) {
                console.error("localPlayerInfo is not JSON, skip.");
            }
            if (!this.playerInfo.lastEntryTime || this.playerInfo.lastEntryTime != new Date().toJSON().substr(0, 10)) {
                this.playerInfo.fatigueValue = fatigueValue;
                this.playerInfo.lastEntryTime = new Date().toJSON().substr(0, 10);
            }
        }

        public savePlayerInfoToStorage() {
            platform.setStorageAsync("playerInfo", JSON.stringify(this.playerInfo));
        }
    }
}