export interface SeriesDto {
    id: number;
    seriesId: string;
    name: string;
    description?: string;
    minValue: number;
    maxValue: number;
    unit: string;
    color: string;
    measurementType?: string;
    measurementCount: number;
  }