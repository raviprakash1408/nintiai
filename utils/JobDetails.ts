export interface JobDetails {
  id: number;
  jobName: string;
  progress: number;
  description?: string;
  diagnosis?: string;
  prognosis?: string;
}

export const jobDetails: JobDetails[] = [
  {
    id: 1,
    jobName: 'Saravanan - Heart surgery',
    progress: 50,
    description: '',
    diagnosis: 'Some random diagnosis text for dummy data',
    prognosis: 'Some random prognosis text for dummy data',
  },
  {
    id: 2,
    jobName: 'Anunaga - ENT surgery',
    progress: 70,
    description: '',
    diagnosis: 'Some random diagnosis text for dummy data',
    prognosis: 'Some random prognosis text for dummy data',
  },
  {
    id: 3,
    jobName: 'Anunaga - ENT surgery',
    progress: 90,
    description: '',
    diagnosis: 'Some random diagnosis text for dummy data',
    prognosis: 'Some random prognosis text for dummy data',
  },
];
