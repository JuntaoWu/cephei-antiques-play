
module game {

    export class PlayerInfo {
        plotId: number; //当前剧情id
        collectedScenes?: Array<string>; //收集场景
        fatigueValue?: number; //体力值
        gold?: string; //金币
        lastEntryTime?: string;
        hints?: number; //可用提示次数
        time?: number;  //经营模式剩余回合
        guPrice?: Array<number>; //经营模式古董价格
        guColl?: Array<number>;  //经营模式获得古董数量
        guEventList?: Array<number>; //经营模式事件存档
    }
}