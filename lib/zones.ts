// DRAFT delivery zones for Chiclayo. Fees [draft — confirmar] with the business.

export type Zone = {
  name: string;
  fee: number; // soles (S/)
  note?: string;
  // Zone centroid (from OpenStreetMap) used to auto-pick the nearest zone from
  // the visitor's GPS location. Tune if the business defines exact boundaries.
  lat?: number;
  lng?: number;
};

export const ZONES: Zone[] = [
  { name: "Chiclayo Centro", fee: 4, lat: -6.7716, lng: -79.8387 },
  { name: "Santa Victoria", fee: 4, lat: -6.7812, lng: -79.8385 },
  { name: "La Victoria", fee: 5, lat: -6.8071, lng: -79.8519 },
  { name: "Federico Villarreal", fee: 5, lat: -6.7743, lng: -79.8543 },
  { name: "José Leonardo Ortiz (JLO)", fee: 6, lat: -6.7421, lng: -79.8342 },
  { name: "Pimentel", fee: 8, note: "según punto", lat: -6.8208, lng: -79.9187 },
];
