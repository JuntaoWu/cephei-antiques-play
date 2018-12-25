
namespace ap {

    export class Constants {

        public static get ResourceEndpoint(): string {
            return (platform.env == "local" || platform.env == "dev" || platform.name != "wxgame") ? Constants.Endpoints.localResource : Constants.Endpoints.remoteResource;
        };

        public static get Endpoints() {
            if (platform.env == "dev") {
                return {
                    service: "http://gdjzj.hzsdgames.com:8098/",
                    localResource: "",
                    remoteResource: "http://gdjzj.hzsdgames.com:8098/miniGame/"
                };
            }
            if (platform.env == "prod") {
                return {
                    service: "https://gdjzj.hzsdgames.com:8099/",
                    localResource: "",
                    remoteResource: "https://gdjzj.hzsdgames.com:8099/miniGame/"
                };
            }
            if (platform.env == "test") {
                return {
                    service: "http://gdjzj.hzsdgames.com:8098/",
                    localResource: "",
                    remoteResource: "http://gdjzj.hzsdgames.com:8098/miniGame/"
                };
            }
        }

        public static authorizeButtonImageUrl = `${Constants.ResourceEndpoint}resource/assets/Button/btn-wxlogin.png`;
        public static gameTitle = `寻墨探宝`;
        public static shareImageUrl = `${Constants.ResourceEndpoint}resource/assets/start/logo.png`;
    }

    export enum Scene {
        Start = 1,
        Game = 2,
    }

    export const gameType = {
        Input: "填空",
        Select: "选择",
        MiniGame: "小游戏",
    }

    export const SceneType = {
        SceneBg: "场景CG",
        ScenePerson: "人物CG",
        SceneProps: "道具CG",
    }

    export const plotType = {
        PlotChange: "切换",
        PlotAdded: "追加",
        PlotQuestion: "谜题",
        Transition: "转场特效",
        PageChange: "界面切换经营",
    }

    export const fatigueValue = 100;

    export const Antiques = ["木器", "书画", "青铜", "金玉"];

    export const PlotEnding = ["m1", "m2"];

}