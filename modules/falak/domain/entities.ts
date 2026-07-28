import { BaseEntity, type BaseEntityProps } from "@/modules/shared/domain/base.entity";
import type { PrayerMethod, ObservationStatus, RukyatResult } from "./types";

export interface FalakPrayerTimeProps extends BaseEntityProps {
  locationName: string;
  latitude: number;
  longitude: number;
  timezone: string;
  calculationMethod: PrayerMethod;
  prayerDate: Date;
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export class FalakPrayerTime extends BaseEntity<FalakPrayerTimeProps> {
  private constructor(props: FalakPrayerTimeProps) {
    super(props);
  }

  get locationName(): string { return this.props.locationName; }
  get latitude(): number { return this.props.latitude; }
  get longitude(): number { return this.props.longitude; }
  get timezone(): string { return this.props.timezone; }
  get calculationMethod(): PrayerMethod { return this.props.calculationMethod; }
  get prayerDate(): Date { return this.props.prayerDate; }
  get fajr(): Date { return this.props.fajr; }
  get sunrise(): Date { return this.props.sunrise; }
  get dhuhr(): Date { return this.props.dhuhr; }
  get asr(): Date { return this.props.asr; }
  get maghrib(): Date { return this.props.maghrib; }
  get isha(): Date { return this.props.isha; }

  static create(props: FalakPrayerTimeProps): FalakPrayerTime {
    return new FalakPrayerTime(props);
  }
}

export interface FalakRukyatProps extends BaseEntityProps {
  observationDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
  observerId: string;
  weather: string;
  result: RukyatResult;
  notes: string | null;
  status: ObservationStatus;
  deletedAt: Date | null;
}

export class FalakRukyat extends BaseEntity<FalakRukyatProps> {
  private constructor(props: FalakRukyatProps) {
    super(props);
  }

  get observationDate(): Date { return this.props.observationDate; }
  get locationName(): string { return this.props.locationName; }
  get latitude(): number { return this.props.latitude; }
  get longitude(): number { return this.props.longitude; }
  get observerId(): string { return this.props.observerId; }
  get weather(): string { return this.props.weather; }
  get result(): RukyatResult { return this.props.result; }
  get notes(): string | null { return this.props.notes; }
  get status(): ObservationStatus { return this.props.status; }
  get deletedAt(): Date | null { return this.props.deletedAt; }

  static create(props: FalakRukyatProps): FalakRukyat {
    return new FalakRukyat(props);
  }
}
