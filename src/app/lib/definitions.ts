export type Report = {
  id: string;
  location: string;
  description: string;
  date: string;
  contactName?: string;
  email?: string;
  phone?: string;
  severity: "minor" | "moderate" | "severe";
  feedback?: string;
  imageurl: string;
};
