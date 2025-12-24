import { EngagementSignalModel } from './engagementSignal';
import { EngagementSignal } from './engagement.types';

export class EngagementSignalApi {
  private signals: EngagementSignalModel[] = [];

  createSignal(data: EngagementSignal): EngagementSignal {
    const signal = new EngagementSignalModel(data);
    this.signals.push(signal);
    return signal.format();
  }

  getSignalsByPatient(patientId: string): EngagementSignal[] {
    return this.signals
      .filter(s => s.patientId === patientId)
      .map(s => s.format());
  }

  overrideSignal(signalId: string, overrideData: Partial<EngagementSignal>): EngagementSignal | null {
    const signal = this.signals.find(s => s.signalId === signalId);
    if (!signal) return null;
    Object.assign(signal, overrideData, {
      source: 'Clinician',
      overrideReason: overrideData.overrideReason || signal.overrideReason,
      updatedAt: new Date()
    });
    return signal.format();
  }

  getSignal(signalId: string): EngagementSignal | null {
    const signal = this.signals.find(s => s.signalId === signalId);
    return signal ? signal.format() : null;
  }
}
