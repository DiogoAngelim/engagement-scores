import { EngagementSignalType, EngagementSignal } from './engagement.types';

export class EngagementSignalModel implements EngagementSignal {
  patientId: string;
  type: EngagementSignalType;
  value: number;
  occurredAt: Date;
  signalId: string;
  source?: string;
  overrideReason?: string;
  createdBy?: string;
  lastModifiedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: EngagementSignal) {
    this.patientId = data.patientId;
    this.type = data.type;
    this.value = data.value;
    this.occurredAt = data.occurredAt;
    this.signalId = EngagementSignalModel.generateId();
    this.createdAt = data.createdAt ?? new Date();
    this.updatedAt = data.updatedAt ?? new Date();
    this.source = data.source;
    this.overrideReason = data.overrideReason;
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
  }

  static generateId(): string {
    return 'sig_' + Math.random().toString(36).substr(2, 9);
  }

  format(): EngagementSignal {
    return {
      patientId: this.patientId,
      type: this.type,
      value: this.value,
      occurredAt: this.occurredAt
    };
  }
}
