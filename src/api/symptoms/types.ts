export interface SymptomEntry {
  _id?: string;
  id?: string; // For frontend compatibility
  userId: string;
  date: string;
  painLevel: number;
  location: string;
  description: string;
  medications: string;
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SymptomEntryRequest {
  date: string;
  painLevel: number;
  location?: string;
  description?: string;
  medications?: string;
}
