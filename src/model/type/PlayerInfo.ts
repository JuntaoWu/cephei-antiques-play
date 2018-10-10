
module game {

    export class PlayerInfo {
        id: number;
        plotId: number; //当前剧情id
        collectedScene?: Array<string>; //收集场景
    }
}