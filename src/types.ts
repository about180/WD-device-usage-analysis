export interface ReceiverLog {
  receiverMac: string;
  receiverName: string;
  sourceName: string;
  firmwareVersion: string;
  channel: string;
  eventDescription: string;
  duration: number;
  recordTime: number;
}

export interface UserQueryRow {
  sourceUser: string;
  receiverName: string;
  receiverMac: string;
  maxDuration: number;
  totalDuration: number;
  connectionSuccess: number;
  normalDisconnect: number;
  abnormalDisconnect: number;
  hasMultipleValues: boolean;
  multipleValues?: {
    receiverNames: string[];
    channels: string[];
    firmwareVersions: string[];
  };
}

export interface FirmwareRow {
  version: string;
  receiverNames: string[];
  deviceCount: number;
}

export interface ReceiverAnalysisRow {
  sourceUser: string;
  totalDuration: number;
  maxDuration: number;
}

export interface UsageShareRow {
  sourceUser: string;
  totalDuration: number;
  share: number;
  color: string;
}
