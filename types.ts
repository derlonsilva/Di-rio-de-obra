export type WeatherCondition = 'ensolarado' | 'nublado' | 'chuvoso' | 'tempestade';

export interface WeatherData {
  morning: WeatherCondition | null;
  afternoon: WeatherCondition | null;
}

export interface ResourceItem {
  id: string;
  name: string;
  quantity: number;
}

export interface PhotoItem {
  id: string;
  file: File;
  previewUrl: string;
  description: string;
}

export interface RDOData {
  project: {
    name: string;
    address: string;
    contract: string;
    startDate: string;
    deadline: string;
    techResp: string;
    crea: string;
    art: string;
    date: string;
    client: string;
  };
  weather: WeatherData;
  labor: ResourceItem[];
  equipment: ResourceItem[];
  photos: PhotoItem[];
  aiSummary: string;
}

export interface SavedProject {
  id: string;
  name: string;
  data: RDOData['project'];
}
