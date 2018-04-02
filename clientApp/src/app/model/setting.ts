export class Setting {
  id: number;
  alias: string;
  trainersPerPage: number;
  reportGrads: number;
  batchLength: number;
  reportIncomingGrads: number;
  minBatchSize: number;
  maxBatchSize: number;
  trainerBreakDays: number;
  defaultLocation: number;
  defaultBuilding: number;
  defaultNamePattern: string;

  constructor(
    id: number,
    alias: string,
    trainersPerPage: number,
    reportGrads: number,
    batchLength: number,
    reportIncomingGrads: number,
    minBatchSize: number,
    maxBatchSize: number,
    trainerBreakDays: number,
    defaultLocation: number,
    defaultBuilding: number,
    defaultNamePattern: string
  ) {
    this.id = id;
    this.alias = alias;
    this.trainersPerPage = trainersPerPage;
    this.reportGrads = reportGrads;
    this.batchLength = batchLength;
    this.reportIncomingGrads = reportIncomingGrads;
    this.minBatchSize = minBatchSize;
    this.maxBatchSize = maxBatchSize;
    this.trainerBreakDays = trainerBreakDays;
    this.defaultLocation = defaultLocation;
    this.defaultBuilding = defaultBuilding;
    this.defaultNamePattern = defaultNamePattern;
  }
}
