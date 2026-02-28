export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  graduationDate: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
}

export interface CVData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    website?: string;
    summary: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  projects: Project[];
  languages: string[];
}

export type JobType = 'internship' | 'job' | 'contract' | 'remote';
export type Duration = 'short-term' | 'long-term';

export interface UserContext {
  domain: string;
  target: JobType;
  duration: Duration;
  additionalInfo: string;
}

export interface CVAnalysis {
  suggestions: string[];
  keywords: string[];
  improvedCV: CVData;
}
