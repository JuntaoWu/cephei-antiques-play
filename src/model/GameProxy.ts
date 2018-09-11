module game {

    export class GameProxy extends puremvc.Proxy implements puremvc.IProxy {
        public static NAME: string = "GameProxy";

        public playerInfo;

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
    }
}