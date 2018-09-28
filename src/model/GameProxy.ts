module game {

    export class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
        public static NAME: string = "GameProxy";

        //小游戏
        public static SHOW_MINIGAME: string = "show_minigame";
        //通过小游戏
        public static PASS_MINIGAME: string = "pass_minigame";

        public playerInfo;
        public pointHunag: number = 1;
        public pointMu: number = 1; 

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
    }
}