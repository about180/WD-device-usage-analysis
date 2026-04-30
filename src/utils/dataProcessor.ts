import Papa from 'papaparse';
import { ReceiverLog } from '../types';

const COLUMN_MAPPING: Record<string, keyof ReceiverLog> = {
  'ReceiverMac': 'receiverMac',
  'Receiver MAC': 'receiverMac',
  'ReceiverId': 'receiverMac',
  'ReceiverName': 'receiverName',
  'Receiver Name': 'receiverName',
  'SourceName': 'sourceName',
  'Source Name': 'sourceName',
  'FirmwareVersion': 'firmwareVersion',
  'Firmware Version': 'firmwareVersion',
  'Channel': 'channel',
  'EventDescription': 'eventDescription',
  'Event Description': 'eventDescription',
  'Date & Time': 'recordTime',
  'RecordTime': 'recordTime',
  'Duration': 'duration',
  'Duration (second)': 'duration'
};

export const parseCSV = (file: File): Promise<ReceiverLog[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const logs: ReceiverLog[] = results.data.map((row: any) => {
          const log: Partial<ReceiverLog> = {};
          
          Object.keys(row).forEach(key => {
            const mappedKey = COLUMN_MAPPING[key.trim()];
            if (mappedKey) {
              if (mappedKey === 'duration') {
                log[mappedKey] = parseFloat(row[key]) || 0;
              } else {
                log[mappedKey] = String(row[key] || '');
              }
            }
          });

          return log as ReceiverLog;
        }).filter(log => log.receiverMac); // Basic validation
        
        resolve(logs);
      },
      error: (error) => reject(error)
    });
  });
};

export const isValidFilename = (filename: string): boolean => {
  const lower = filename.toLowerCase();
  return lower.startsWith('receiverlog') || lower.startsWith('receiver_log');
};

export const generateHSLColor = (index: number, total: number) => {
  const h = (index * (360 / Math.max(total, 1))) % 360;
  return `hsl(${h}, 70%, 55%)`;
};
