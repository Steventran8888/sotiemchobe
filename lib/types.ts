export type VaccineCategory = "free_commune" | "service" | "regional_pilot";

export interface VaccineSchedule {
  id: string;
  name: string;
  disease: string;
  dose_number: number;
  age_recommended: string;
  age_months_min: number;
  category: VaccineCategory;
  notes: string | null;
  created_at: string;
}

export interface Child {
  id: string;
  user_id: string;
  name: string;
  dob: string;
  gender: "male" | "female" | "other" | null;
  created_at: string;
}

export type VaccinationStatus = "planned" | "done" | "skipped";

export interface VaccinationRecord {
  id: string;
  child_id: string;
  vaccine_schedule_id: string;
  status: VaccinationStatus;
  date_given: string | null;
  location: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
