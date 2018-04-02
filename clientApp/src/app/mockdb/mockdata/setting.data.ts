import { Setting } from '../../model/setting';

export const settings: Setting[] = [
  {
    id: 1,
    alias: 'global',
    trainersPerPage: 0,
    reportGrads: 22,
    batchLength: 11,
    reportIncomingGrads: 26,
    minBatchSize: 10,
    maxBatchSize: 20,
    trainerBreakDays: 14,
    defaultLocation: 1,
    defaultBuilding: 64,
    defaultNamePattern: '$y$m $mmm$d $c'
  }
];
