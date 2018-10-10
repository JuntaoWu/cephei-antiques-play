
module game {

    export class QuestionGame {
        id: number; 
        keyword: string;
        type: string; 
        img: string;
        description: string;
        right: string;
        points1: string;
        points2: string;
        question?: string;
        answer?: string;
        optionsId?: number;
    }
}