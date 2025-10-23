export interface MeasurementDto {
    id: number;
    seriesId: string;
    seriesName: string;
    timestamp: string;   // backend sends ISO string
    value: number;
    unit: string;
    color: string;
  }