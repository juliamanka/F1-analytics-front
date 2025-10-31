export interface MeasurementDto {
    id: number;
    seriesId: string;
    seriesName: string;
    timestamp: string;   
    value: number;
    unit: string;
    color: string;
  }

  export interface CreateMeasurement {
    seriesId: string;
    value: number;
    timestamp: string;
  }
  
  export interface UpdateMeasurement {
    seriesId?: string;
    value?: number;
    timestamp?: string;
  }