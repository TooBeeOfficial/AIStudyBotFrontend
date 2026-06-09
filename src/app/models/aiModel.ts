export class AIModel {
  id: number;
  modelName: string;

  constructor(id: number = 1, modelName: string = 'Default') {
    this.id = id;
    this.modelName = modelName;
  }

  static fromApi(data: any): AIModel {
    return new AIModel(data?.id, data?.name);
  }
}
