export type User = {
  id: string
  name: string
  email: string
  role: "hr" | "recruiter" | "hiring_manager" | "admin"
  avatar?: string
}

export type Role = {
  id: string
  title: string
  department: string
  location: string
  locationType: "remote" | "onsite" | "hybrid"
  description: string
  requirements: string
  responsibilities: string
  minSalary?: string
  maxSalary?: string
  showSalary: boolean
  employmentType: "full-time" | "part-time" | "contract" | "internship"
  status: "active" | "draft" | "paused" | "filled" | "closed"
  postedDate: string
  updatedDate: string
  keySkills?: string[]
  experienceLevel?: "entry" | "mid" | "senior" | "executive"
  applicationDeadline?: string
}


export type Candidate = {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  roleId: string
  roleName: string
  stage: "applied" | "no_match" | "screening" | "interview" | "offer" | "hired" | "rejected",
  appliedDate: string
  lastContactDate?: string
  resume?: string
  coverLetter?: string
  notes?: Note[]
  skills?: string[] ,
  experience?: Experience[]
  education?: Education[],
  matchScore?: number
  applicationHistory?: ApplicationHistory[]
}

export type ApplicationHistory = {
  id: string
  roleId: string
  roleName: string
  date: string
  stage: "applied" | "no_match" | "screening" | "interview" | "offer" | "hired" | "rejected"
  matchScore?: number
}

export type Skill = {
  name: string;
  proficiency: "beginner" | "intermediate" | "advanced" | "expert";
}

export type Experience = {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export type Education = {
  id: string
  degree: string
  school: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description?: string
}

export type Interview = {
  id: string
  candidateId: string
  candidateName: string
  roleId: string
  roleName: string
  type: string
  date: string
  time: string
  duration: number
  location?: string
  interviewerId: string
  interviewerName: string
  status: "scheduled" | "completed" | "cancelled" | "rescheduled"
  feedback?: string
  notes?: string
}

export type Note = {
  id: string
  content: string
  createdBy: string
  createdAt: string
  candidateId: string
}

export type Dashboard = {
  totalRoles: number
  activeRoles: number
  totalCandidates: number
  activeCandidates: number
  interviewsThisWeek: number
  timeToHire: number
  recentActivity: Activity[]
}

export type Activity = {
  id: string
  type:
    | "role_created"
    | "candidate_applied"
    | "interview_scheduled"
    | "candidate_stage_changed"
    | "note_added"
    | "offer_sent"
    | "candidate_reapplied"
  description: string
  timestamp: string
  roleId?: string
  candidateId?: string
  interviewId?: string
}

export type RegistrationData = {
  name: string
  email: string
  password: string
}
