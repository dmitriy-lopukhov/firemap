export interface IHeatPoint {
  lat: number;
  lng: number;
  count: number;
}

export interface IPoint {
  lat: number;
  lon: number;
}
export interface IHeatItem {
  id: number;
  point: IPoint;
  polygon: {
    points: IPoint[];
  };
  polygonBurn: {
    points: IPoint[];
  };
  reportDay: string;
  status: string;
  satelliteTime: string;
  satellitePortalTime: string;
  reactionTime: string | null;
  respPerson: {
    name: string;
    phone: string;
  } | null;
  subject: string;
  region: string;
  theNearestSettlement: string;
  destination: number;
  azimuth: number;
  riskLeve: number;
  type: string;
  classification: string;
}
