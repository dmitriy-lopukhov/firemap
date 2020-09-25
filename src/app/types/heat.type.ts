export interface IHeatPoint {
  lat: number;
  lng: number;
  count: number;
}
export interface IHeatItem {
  id: number;
  point: {
    lat: number;
    lon: number;
  };
  reportDay: string;
  satelliteTime: string;
  satellitePortalTime: string;
  reactionTime: string | null;
  respPerson: string | null;
  subject: string;
  region: string;
  theNearestSettlement: string;
  destination: number;
  azimuth: number;
  riskLeve: number;
  type: string;
  classification: string;
}
