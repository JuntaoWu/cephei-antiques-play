
module game {

    export class PlayerInfo {
        plotId: number; //当前剧情id
        collectedScenes?: Array<string>; //收集场景
        fatigueValue?: number; //体力值
        gold?: string; //金币
        lastEntryTime?: string;
        hints?: number; //可用提示次数
    }
}