import type { User, Role, Candidate, Interview, Dashboard, Activity, Note, ApplicationHistory, RegistrationData } from "@/lib/types"
import {
  initialUsers,
  initialRoles,
  initialCandidates,
  initialInterviews,
  initialDashboard,
  initialActivities,
  generateId,
  getCurrentDate,
} from "@/lib/data"

// Storage keys
const STORAGE_KEYS = {
  USERS: "talent_track_users",
  CURRENT_USER: "talent_track_current_user",
  ROLES: "talent_track_roles",
  CANDIDATES: "talent_track_candidates",
  INTERVIEWS: "talent_track_interviews",
  DASHBOARD: "talent_track_dashboard",
  ACTIVITIES: "talent_track_activities",
}

// Initialize storage with default data if empty
export const initializeStorage = (): void => {
  if (typeof window === "undefined") return

  // Check if storage is already initialized
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  if (!users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers))
    localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(initialRoles))
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(initialCandidates))
    localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(initialInterviews))
    localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(initialDashboard))
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(initialActivities))
  }
}

// User functions
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(STORAGE_KEYS.USERS)
  return users ? JSON.parse(users) : []
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
  return user ? JSON.parse(user) : null
}

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}

export const authenticateUser = (email: string, password: string): User | null => {
  const users = getUsers()
  // In a real app, you would check password hash, but for demo we'll just check email
  const user = users.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    return user
  }
  return null
}

export const logoutUser = (): void => {
  setCurrentUser(null)
}

export const registerUser = (registrationData: RegistrationData): User => {
  const users = getUsers()
  const newUser: User = {
    id: generateId(),
    name: registrationData.name,
    email: registrationData.email,
    role: "recruiter", // Default role for new users
  }

  users.push(newUser)
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    
  // Set current user after registration
  setCurrentUser(newUser)
  
  return newUser
}

// Role functions
export const getRoles = (): Role[] => {
  if (typeof window === "undefined") return []
  const roles = localStorage.getItem(STORAGE_KEYS.ROLES)
  return roles ? JSON.parse(roles) : []
}

export const getRole = (id: string): Role | null => {
  const roles = getRoles()
  return roles.find((role) => role.id === id) || null
}

export const createRole = (role: Omit<Role, "id" | "postedDate" | "updatedDate">): Role => {
  const roles = getRoles()
  const newRole: Role = {
    ...role,
    id: generateId(),
    postedDate: getCurrentDate(),
    updatedDate: getCurrentDate(),
  }

  roles.push(newRole)
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))

  // Add activity
  addActivity({
    type: "role_created",
    description: `New role created: ${newRole.title}`,
    roleId: newRole.id,
  })

  // Update dashboard
  updateDashboardStats()

  return newRole
}

export const updateRole = (id: string, updates: Partial<Role>): Role | null => {
  const roles = getRoles()
  const index = roles.findIndex((role) => role.id === id)

  if (index === -1) return null

  const updatedRole = {
    ...roles[index],
    ...updates,
    updatedDate: getCurrentDate(),
  }

  roles[index] = updatedRole
  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(roles))

  // Update dashboard
  updateDashboardStats()

  return updatedRole
}

export const deleteRole = (id: string): boolean => {
  const roles = getRoles()
  const filteredRoles = roles.filter((role) => role.id !== id)

  if (filteredRoles.length === roles.length) return false

  localStorage.setItem(STORAGE_KEYS.ROLES, JSON.stringify(filteredRoles))

  // Update dashboard
  updateDashboardStats()

  return true
}

// Candidate functions
export const getCandidates = (): Candidate[] => {
  if (typeof window === "undefined") return []
  const candidates = localStorage.getItem(STORAGE_KEYS.CANDIDATES)
  return candidates ? JSON.parse(candidates) : []
}

export const getCandidate = (id: string): Candidate | null => {
  const candidates = getCandidates()
  return candidates.find((candidate) => candidate.id === id) || null
}

export const getCandidatesByRole = (roleId: string): Candidate[] => {
  const candidates = getCandidates()
  return candidates.filter((candidate) => candidate.roleId === roleId)
}

export const findCandidateByEmailOrPhone = (email: string, phone?: string): Candidate | null => {
  const candidates = getCandidates()
  return (
    candidates.find(
      (candidate) =>
        candidate.email.toLowerCase() === email.toLowerCase() ||
        (phone && candidate.phone && candidate.phone === phone),
    ) || null
  )
}

export const createCandidate = (candidate: Omit<Candidate, "id" | "appliedDate">): Candidate => {
  const candidates = getCandidates()
  const role = getRole(candidate.roleId)

  if (!role) throw new Error("Role not found")

  const newCandidate: Candidate = {
    ...candidate,
    id: generateId(),
    appliedDate: getCurrentDate(),
    roleName: role.title,
    notes: [],
    applicationHistory: [
      {
        id: generateId(),
        roleId: candidate.roleId,
        roleName: role.title,
        date: getCurrentDate(),
        stage: candidate.stage,
        matchScore: candidate.matchScore,
      },
    ],
  }

  candidates.push(newCandidate)
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates))

  // Add activity
  addActivity({
    type: "candidate_applied",
    description: `${newCandidate.name} applied for ${newCandidate.roleName} position`,
    candidateId: newCandidate.id,
    roleId: newCandidate.roleId,
  })

  // Update dashboard
  updateDashboardStats()

  return newCandidate
}

export const updateCandidate = (id: string, updates: Partial<Candidate>): Candidate | null => {
  const candidates = getCandidates()
  const index = candidates.findIndex((candidate) => candidate.id === id)

  if (index === -1) return null

  const oldStage = candidates[index].stage
  const updatedCandidate = {
    ...candidates[index],
    ...updates,
    lastContactDate: getCurrentDate(),
  }

  candidates[index] = updatedCandidate
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates))

  // Add activity if stage changed
  if (updates.stage && updates.stage !== oldStage) {
    addActivity({
      type: "candidate_stage_changed",
      description: `${updatedCandidate.name} was moved to ${updates.stage} stage`,
      candidateId: updatedCandidate.id,
      roleId: updatedCandidate.roleId,
    })
  }

  // Update dashboard
  updateDashboardStats()

  return updatedCandidate
}

export const addApplicationToHistory = (
  candidateId: string,
  roleId: string,
  stage: Candidate["stage"],
  matchScore?: number,
): ApplicationHistory | null => {
  const candidates = getCandidates()
  const index = candidates.findIndex((candidate) => candidate.id === candidateId)

  if (index === -1) return null

  const role = getRole(roleId)
  if (!role) return null

  const newApplication: ApplicationHistory = {
    id: generateId(),
    roleId,
    roleName: role.title,
    date: getCurrentDate(),
    stage,
    matchScore,
  }

  if (!candidates[index].applicationHistory) {
    candidates[index].applicationHistory = []
  }

  candidates[index].applicationHistory!.push(newApplication)
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates))

  return newApplication
}

export const handleCandidateApplication = (candidateData: {
  name: string
  email: string
  phone?: string
  location?: string
  roleId: string
  skills?: string[]
  experience?: any[]
  education?: any[]
  matchScore?: number
  coverLetter?: string
}): { candidate: Candidate; isNewCandidate: boolean; isMatch: boolean } => {
  // Check if candidate already exists
  const existingCandidate = findCandidateByEmailOrPhone(candidateData.email, candidateData.phone)
  const role = getRole(candidateData.roleId)

  if (!role) throw new Error("Role not found")

  // Determine if the resume matches the job requirements
  const isMatch = (candidateData.matchScore || 0) >= 0.6 // 60% match threshold
  const stage = isMatch ? "applied" : "no_match"

  let candidate: Candidate
  let isNewCandidate = false

  if (existingCandidate) {
    // Update existing candidate
    const updates: Partial<Candidate> = {
      roleId: candidateData.roleId,
      roleName: role.title,
      stage,
      skills: candidateData.skills,
      experience: candidateData.experience,
      education: candidateData.education,
      matchScore: candidateData.matchScore,
      lastContactDate: getCurrentDate(),
    }

    // If phone or location is provided, update those too
    if (candidateData.phone) updates.phone = candidateData.phone
    if (candidateData.location) updates.location = candidateData.location
    if (candidateData.coverLetter) updates.coverLetter = candidateData.coverLetter

    candidate = updateCandidate(existingCandidate.id, updates)!

    // Add this application to history
    addApplicationToHistory(existingCandidate.id, candidateData.roleId, stage, candidateData.matchScore)

    // Add reapplication activity
    addActivity({
      type: "candidate_reapplied",
      description: `${candidate.name} reapplied for ${role.title} position`,
      candidateId: candidate.id,
      roleId: candidateData.roleId,
    })
  } else {
    // Create new candidate
    candidate = createCandidate({
      ...candidateData,
      stage,
      roleName: ""
    })
    isNewCandidate = true
  }

  return { candidate, isNewCandidate, isMatch }
}

export const deleteCandidate = (id: string): boolean => {
  const candidates = getCandidates()
  const filteredCandidates = candidates.filter((candidate) => candidate.id !== id)

  if (filteredCandidates.length === candidates.length) return false

  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(filteredCandidates))

  // Update dashboard
  updateDashboardStats()

  return true
}

export const addCandidateNote = (candidateId: string, content: string): Note | null => {
  const candidates = getCandidates()
  const index = candidates.findIndex((candidate) => candidate.id === candidateId)

  if (index === -1) return null

  const currentUser = getCurrentUser()
  if (!currentUser) return null

  const newNote: Note = {
    id: generateId(),
    content,
    createdBy: currentUser.name,
    createdAt: new Date().toISOString(),
    candidateId,
  }

  if (!candidates[index].notes) {
    candidates[index].notes = []
  }

  candidates[index].notes!.push(newNote)
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates))

  // Add activity
  addActivity({
    type: "note_added",
    description: `Note added for ${candidates[index].name}`,
    candidateId,
    roleId: candidates[index].roleId,
  })

  return newNote
}

// Interview functions
export const getInterviews = (): Interview[] => {
  if (typeof window === "undefined") return []
  const interviews = localStorage.getItem(STORAGE_KEYS.INTERVIEWS)
  return interviews ? JSON.parse(interviews) : []
}

export const getInterview = (id: string): Interview | null => {
  const interviews = getInterviews()
  return interviews.find((interview) => interview.id === id) || null
}

export const getInterviewsByCandidate = (candidateId: string): Interview[] => {
  const interviews = getInterviews()
  return interviews.filter((interview) => interview.candidateId === candidateId)
}

export const getInterviewsByRole = (roleId: string): Interview[] => {
  const interviews = getInterviews()
  return interviews.filter((interview) => interview.roleId === roleId)
}

export const createInterview = (interview: Omit<Interview, "id">): Interview => {
  const interviews = getInterviews()
  const newInterview: Interview = {
    ...interview,
    id: generateId(),
  }

  interviews.push(newInterview)
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews))

  // Add activity
  addActivity({
    type: "interview_scheduled",
    description: `${newInterview.candidateName} was scheduled for a ${newInterview.type} interview`,
    candidateId: newInterview.candidateId,
    roleId: newInterview.roleId,
    interviewId: newInterview.id,
  })

  // Update dashboard
  updateDashboardStats()

  return newInterview
}

export const updateInterview = (id: string, updates: Partial<Interview>): Interview | null => {
  const interviews = getInterviews()
  const index = interviews.findIndex((interview) => interview.id === id)

  if (index === -1) return null

  const updatedInterview = {
    ...interviews[index],
    ...updates,
  }

  interviews[index] = updatedInterview
  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(interviews))

  // Update dashboard
  updateDashboardStats()

  return updatedInterview
}

export const deleteInterview = (id: string): boolean => {
  const interviews = getInterviews()
  const filteredInterviews = interviews.filter((interview) => interview.id !== id)

  if (filteredInterviews.length === interviews.length) return false

  localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(filteredInterviews))

  // Update dashboard
  updateDashboardStats()

  return true
}

// Activity functions
export const getActivities = (): Activity[] => {
  if (typeof window === "undefined") return []
  const activities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES)
  return activities ? JSON.parse(activities) : []
}

export const detectDuplicateCandidates = (candidate: Omit<Candidate, "id" | "appliedDate">): Candidate[] => {
  const candidates = getCandidates();
  const potentialDuplicates = candidates.filter(
    (existingCandidate) =>
      existingCandidate.email === candidate.email ||
      existingCandidate.phone === candidate.phone ||
      existingCandidate.name === candidate.name
  );
  return potentialDuplicates;
};

export const addActivity = (activity: Omit<Activity, "id" | "timestamp">): Activity => {
  const activities = getActivities()
  const newActivity: Activity = {
    ...activity,
    id: generateId(),
    timestamp: new Date().toISOString(),
  }

  activities.unshift(newActivity) // Add to beginning of array

  // Keep only the most recent 100 activities
  const trimmedActivities = activities.slice(0, 100)
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(trimmedActivities))

  // Update dashboard
  const dashboard = getDashboard()
  dashboard.recentActivity = trimmedActivities.slice(0, 5)
  localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(dashboard))

  return newActivity
}

// Dashboard functions
export const getDashboard = (): Dashboard => {
  if (typeof window === "undefined") return initialDashboard
  const dashboard = localStorage.getItem(STORAGE_KEYS.DASHBOARD)
  return dashboard ? JSON.parse(dashboard) : initialDashboard
}

export const updateDashboardStats = (): void => {
  if (typeof window === "undefined") return

  const roles = getRoles()
  const candidates = getCandidates()
  const interviews = getInterviews()
  const activities = getActivities()

  // Calculate stats
  const activeRoles = roles.filter((role) => role.status === "active").length
  const activeCandidates = candidates.filter(
    (candidate) => candidate.stage !== "hired" && candidate.stage !== "rejected",
  ).length

  // Calculate interviews this week
  const today = new Date()
  const oneWeekFromNow = new Date()
  oneWeekFromNow.setDate(today.getDate() + 7)

  const interviewsThisWeek = interviews.filter((interview) => {
    const interviewDate = new Date(interview.date)
    return interviewDate >= today && interviewDate <= oneWeekFromNow && interview.status !== "cancelled"
  }).length

  // Update dashboard
  const dashboard = getDashboard()
  dashboard.totalRoles = roles.length
  dashboard.activeRoles = activeRoles
  dashboard.totalCandidates = candidates.length
  dashboard.activeCandidates = activeCandidates
  dashboard.interviewsThisWeek = interviewsThisWeek
  dashboard.recentActivity = activities.slice(0, 5)

  localStorage.setItem(STORAGE_KEYS.DASHBOARD, JSON.stringify(dashboard))
}
