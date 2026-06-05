export class AIModel {
    id!: number;
    modelName!: string;
    
    static fromApi(data: any): AIModel {
        const model = new AIModel();

        model.id = data.id;
        model.modelName = data.name;

        return model;
    }
}