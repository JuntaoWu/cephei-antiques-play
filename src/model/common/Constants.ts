
module game {

    export class Constants {

        public static get ResourceEndpoint(): string {
            return platform.name == "DebugPlatform" ? this.Endpoints.localResource : this.Endpoints.remoteResource;
        };

        public static get Endpoints() {
            if (platform.env == "dev") {
                return {
                    service: "http://gdjzj.hzsdgames.com:8091/",
                    localResource: "",
                    remoteResource: "http://gdjzj.hzsdgames.com:8091/miniGame/"
                };
            }
            if (platform.env == "prod") {
                return {
                    service: "http://gdjzj.hzsdgames.com:8091/",
                    localResource: "",
                    remoteResource: "http://gdjzj.hzsdgames.com:8091/miniGame/"
                };
            }
        }
    }

    export enum Scene {
        Start = 1,
        Game = 2,
    }

    export const gameKey = {
        FloorSwitch: "地板开关",
        CubeStop: "魔方停止",
    }

    export const gameType = {
        Input: "填空",
        Select: "选择",
        MiniGame: "小游戏",
    }

    export const plotType = {
        ChangeScene: "切换场景",
        AddScene: "添加场景",
        DeleteScene: "删除场景",
        ChangeText: "切换文本",
        PlaySound: "播放音效",
        Question: "谜题",
        SceneReplenish : "场景切换追加",
    }
}