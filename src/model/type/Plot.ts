
module game {

    export class Plot {
        id: number; 
        res: string;
        type: string; 
        description: string;
        questionId?: number; //迷題id
        effect?: string;
        effectTrigger?: string;
        sound?: string;
        playTime?: number;
        talkId?: number;
        autoNextTime?: number;
    }
}