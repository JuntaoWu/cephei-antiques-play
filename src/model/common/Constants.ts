
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

    export const gameKey = {
        FloorSwitch: "地板开关",
        CubeStop: "魔方停止",
    }

    export enum Scene {
        Start = 1,
        Game = 2,
    }

}