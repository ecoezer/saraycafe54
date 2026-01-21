export interface DeliveryZone {
  label: string;
  minOrder: number;
  fee: number;
}

export const DELIVERY_ZONES: Record<string, DeliveryZone> = {
  'nordstemmen': { label: 'Nordstemmen', minOrder: 15, fee: 1.50 },
  'mahlerten': { label: 'Mahlerten', minOrder: 15, fee: 2.00 },
  'heyersum': { label: 'Heyersum', minOrder: 15, fee: 2.00 },
  'burgstemmen': { label: 'Burgstemmen', minOrder: 15, fee: 2.00 },
  'roessing': { label: 'Rössing', minOrder: 15, fee: 2.00 },
  'klein-escherde': { label: 'Klein Escherde', minOrder: 15, fee: 2.50 },
  'gross-escherde': { label: 'Groß Escherde', minOrder: 15, fee: 2.50 },
  'barnten': { label: 'Barnten', minOrder: 15, fee: 2.50 },
  'schulenburg': { label: 'Schulenburg', minOrder: 15, fee: 2.50 },
  'adensen': { label: 'Adensen', minOrder: 15, fee: 2.50 },
  'wuellingen': { label: 'Wüllingen', minOrder: 15, fee: 2.50 },
  'alferde': { label: 'Alferde', minOrder: 15, fee: 2.50 },
  'eldagsen': { label: 'Eldagsen', minOrder: 25, fee: 3.50 },
  'elze': { label: 'Elze', minOrder: 25, fee: 3.00 },
  'eime': { label: 'Eime', minOrder: 25, fee: 3.50 }
} as const;
