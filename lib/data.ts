import type { User, Role, Candidate, Interview, Dashboard, Activity } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// Initial data for the application
export const initialUsers: User[] = [
  {
    id: "1",
    name: "HR Admin",
    email: "admin@example.com",
    role: "admin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    role: "hr",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "David Chen",
    email: "david@example.com",
    role: "hiring_manager",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Lisa Wong",
    email: "lisa@example.com",
    role: "recruiter",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export const initialRoles: Role[] = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    department: "engineering",
    location: "Remote",
    locationType: "remote",
    description:
      "We are looking for an experienced Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications.",
    requirements:
      "- 5+ years of experience with React and modern JavaScript\n- Experience with TypeScript\n- Strong understanding of web standards and best practices\n- Experience with responsive design and cross-browser compatibility\n- Good communication skills and ability to work in a team",
    responsibilities:
      "- Develop and maintain user interfaces for our web applications\n- Collaborate with designers and backend developers\n- Write clean, maintainable, and efficient code\n- Optimize applications for maximum speed and scalability\n- Stay up-to-date with emerging trends and technologies",
    minSalary: "120000",
    maxSalary: "150000",
    showSalary: true,
    employmentType: "full-time",
    status: "active",
    postedDate: "2025-04-02",
    updatedDate: "2025-04-02",
  },
  {
    id: "2",
    title: "Product Designer",
    department: "design",
    location: "New York, NY",
    locationType: "onsite",
    description: "Join our design team to create beautiful and functional user experiences for our products.",
    requirements:
      "- 3+ years of experience in product design\n- Proficiency in design tools like Figma and Sketch\n- Strong portfolio demonstrating UI/UX skills\n- Experience with design systems\n- Excellent communication and collaboration skills",
    responsibilities:
      "- Create wireframes, prototypes, and high-fidelity designs\n- Collaborate with product managers and engineers\n- Conduct user research and usability testing\n- Contribute to our design system\n- Present design solutions to stakeholders",
    minSalary: "90000",
    maxSalary: "120000",
    showSalary: true,
    employmentType: "full-time",
    status: "active",
    postedDate: "2025-03-28",
    updatedDate: "2025-03-28",
  },
  {
    id: "3",
    title: "Marketing Manager",
    department: "marketing",
    location: "San Francisco, CA",
    locationType: "hybrid",
    description: "Lead our marketing efforts and drive growth for our products.",
    requirements:
      "- 5+ years of experience in marketing\n- Experience with digital marketing channels\n- Strong analytical skills\n- Excellent communication and leadership abilities\n- Experience with marketing automation tools",
    responsibilities:
      "- Develop and execute marketing strategies\n- Manage marketing campaigns across channels\n- Analyze campaign performance and optimize ROI\n- Collaborate with sales and product teams\n- Manage a team of marketing specialists",
    minSalary: "100000",
    maxSalary: "130000",
    showSalary: false,
    employmentType: "full-time",
    status: "paused",
    postedDate: "2025-03-15",
    updatedDate: "2025-03-20",
  },
  {
    id: "4",
    title: "Backend Engineer",
    department: "engineering",
    location: "Remote",
    locationType: "remote",
    description: "Join our engineering team to build scalable and reliable backend systems.",
    requirements:
      "- 4+ years of experience in backend development\n- Proficiency in Node.js, Python, or Java\n- Experience with databases and API design\n- Knowledge of cloud services (AWS, GCP, or Azure)\n- Understanding of microservices architecture",
    responsibilities:
      "- Design and implement backend services\n- Optimize application performance\n- Ensure high availability and reliability\n- Collaborate with frontend developers\n- Write clean, testable code",
    minSalary: "130000",
    maxSalary: "160000",
    showSalary: true,
    employmentType: "full-time",
    status: "active",
    postedDate: "2025-03-10",
    updatedDate: "2025-03-10",
  },
  {
    id: "5",
    title: "Sales Representative",
    department: "sales",
    location: "Chicago, IL",
    locationType: "onsite",
    description: "Drive sales growth by identifying and closing new business opportunities.",
    requirements:
      "- 2+ years of sales experience\n- Strong communication and negotiation skills\n- Self-motivated with a track record of meeting targets\n- Experience with CRM software\n- Ability to build and maintain client relationships",
    responsibilities:
      "- Identify and pursue new sales opportunities\n- Build relationships with potential clients\n- Negotiate contracts and close deals\n- Meet or exceed sales targets\n- Maintain accurate records in our CRM",
    minSalary: "60000",
    maxSalary: "80000",
    showSalary: true,
    employmentType: "full-time",
    status: "filled",
    postedDate: "2025-02-28",
    updatedDate: "2025-03-15",
  },
]

export const initialCandidates: Candidate[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    roleId: "1",
    roleName: "Senior Frontend Developer",
    stage: "interview",
    appliedDate: "2025-04-02",
    lastContactDate: "2025-04-05",
    skills: ["React", "TypeScript", "JavaScript", "HTML/CSS", "Redux", "Next.js", "GraphQL", "Responsive Design"],
    experience: [
      {
        id: "exp1",
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        location: "San Francisco, CA",
        startDate: "2022-01-01",
        current: true,
        description:
          "Led the frontend development team in building a complex SaaS platform. Implemented modern React patterns and improved performance by 40%.",
      },
      {
        id: "exp2",
        title: "Frontend Developer",
        company: "WebDev Agency",
        location: "San Francisco, CA",
        startDate: "2018-03-01",
        endDate: "2021-12-31",
        current: false,
        description:
          "Developed responsive web applications for various clients. Worked with React, Vue, and Angular frameworks.",
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "M.S. Computer Science",
        school: "Stanford University",
        location: "Stanford, CA",
        startDate: "2016-09-01",
        endDate: "2018-06-01",
        current: false,
      },
      {
        id: "edu2",
        degree: "B.S. Computer Science",
        school: "University of California, Berkeley",
        location: "Berkeley, CA",
        startDate: "2012-09-01",
        endDate: "2016-06-01",
        current: false,
      },
    ],
    notes: [
      {
        id: "note1",
        content:
          "Candidate has strong technical skills and experience with React and TypeScript. Good communication skills and problem-solving approach. Recommended for technical interview.",
        createdBy: "Sarah Johnson",
        createdAt: "2025-04-05T10:30:00Z",
        candidateId: "1",
      },
    ],
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    roleId: "2",
    roleName: "Product Designer",
    stage: "screening",
    appliedDate: "2025-03-28",
    lastContactDate: "2025-04-04",
    skills: [
      "UI/UX Design",
      "Figma",
      "Sketch",
      "Adobe Creative Suite",
      "Prototyping",
      "User Research",
      "Design Systems",
    ],
    experience: [
      {
        id: "exp3",
        title: "Product Designer",
        company: "Design Studio",
        location: "New York, NY",
        startDate: "2020-06-01",
        current: true,
        description:
          "Created user interfaces and experiences for mobile and web applications. Collaborated with product managers and developers to implement designs.",
      },
      {
        id: "exp4",
        title: "UI Designer",
        company: "Creative Agency",
        location: "Boston, MA",
        startDate: "2018-01-01",
        endDate: "2020-05-31",
        current: false,
        description: "Designed user interfaces for websites and applications. Created style guides and design systems.",
      },
    ],
    education: [
      {
        id: "edu3",
        degree: "B.F.A. Graphic Design",
        school: "Rhode Island School of Design",
        location: "Providence, RI",
        startDate: "2014-09-01",
        endDate: "2018-05-01",
        current: false,
      },
    ],
    notes: [],
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    phone: "+1 (555) 456-7890",
    location: "Los Angeles, CA",
    roleId: "3",
    roleName: "Marketing Manager",
    stage: "offer",
    appliedDate: "2025-03-15",
    lastContactDate: "2025-04-03",
    skills: [
      "Digital Marketing",
      "Content Strategy",
      "SEO/SEM",
      "Social Media Marketing",
      "Email Marketing",
      "Analytics",
      "Campaign Management",
    ],
    experience: [
      {
        id: "exp5",
        title: "Marketing Specialist",
        company: "Growth Co.",
        location: "Los Angeles, CA",
        startDate: "2021-02-01",
        current: true,
        description:
          "Managed digital marketing campaigns across multiple channels. Increased website traffic by 35% and lead generation by 40%.",
      },
      {
        id: "exp6",
        title: "Marketing Coordinator",
        company: "Brand Inc.",
        location: "San Diego, CA",
        startDate: "2019-05-01",
        endDate: "2021-01-31",
        current: false,
        description:
          "Assisted in the planning and execution of marketing campaigns. Managed social media accounts and created content.",
      },
    ],
    education: [
      {
        id: "edu4",
        degree: "B.A. Marketing",
        school: "University of California, Los Angeles",
        location: "Los Angeles, CA",
        startDate: "2015-09-01",
        endDate: "2019-06-01",
        current: false,
      },
    ],
    notes: [],
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.wilson@example.com",
    phone: "+1 (555) 234-5678",
    location: "Seattle, WA",
    roleId: "4",
    roleName: "Backend Engineer",
    stage: "applied",
    appliedDate: "2025-04-01",
    lastContactDate: "2025-04-01",
    skills: ["Node.js", "Python", "Java", "AWS", "Databases", "API Design", "Microservices", "Docker"],
    experience: [
      {
        id: "exp7",
        title: "Software Engineer",
        company: "Tech Innovators",
        location: "Seattle, WA",
        startDate: "2022-03-01",
        current: true,
        description:
          "Developed and maintained backend services for a cloud-based platform. Implemented RESTful APIs and optimized database queries.",
      },
      {
        id: "exp8",
        title: "Junior Developer",
        company: "Software Solutions",
        location: "Portland, OR",
        startDate: "2020-07-01",
        endDate: "2022-02-28",
        current: false,
        description: "Assisted in the development of web applications. Worked on both frontend and backend components.",
      },
    ],
    education: [
      {
        id: "edu5",
        degree: "B.S. Computer Science",
        school: "University of Washington",
        location: "Seattle, WA",
        startDate: "2016-09-01",
        endDate: "2020-06-01",
        current: false,
      },
    ],
    notes: [],
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 876-5432",
    location: "Chicago, IL",
    roleId: "5",
    roleName: "Sales Representative",
    stage: "hired",
    appliedDate: "2025-02-28",
    lastContactDate: "2025-03-25",
    skills: ["Sales", "Negotiation", "CRM", "Client Relationship Management", "Prospecting", "Closing Techniques"],
    experience: [
      {
        id: "exp9",
        title: "Sales Associate",
        company: "Retail Solutions",
        location: "Chicago, IL",
        startDate: "2023-01-01",
        current: true,
        description:
          "Generated new business opportunities and maintained client relationships. Consistently exceeded sales targets by 15%.",
      },
      {
        id: "exp10",
        title: "Customer Service Representative",
        company: "Service Co.",
        location: "Chicago, IL",
        startDate: "2021-06-01",
        endDate: "2022-12-31",
        current: false,
        description:
          "Provided excellent customer service and resolved client issues. Upsold products and services to existing customers.",
      },
    ],
    education: [
      {
        id: "edu6",
        degree: "B.A. Business Administration",
        school: "University of Illinois",
        location: "Chicago, IL",
        startDate: "2017-09-01",
        endDate: "2021-05-01",
        current: false,
      },
    ],
    notes: [],
  },
]

export const initialInterviews: Interview[] = [
  {
    id: "1",
    candidateId: "1",
    candidateName: "John Doe",
    roleId: "1",
    roleName: "Senior Frontend Developer",
    type: "Technical",
    date: "2025-04-10",
    time: "10:00",
    duration: 60,
    interviewerId: "3",
    interviewerName: "David Chen",
    status: "scheduled",
  },
  {
    id: "2",
    candidateId: "2",
    candidateName: "Jane Smith",
    roleId: "2",
    roleName: "Product Designer",
    type: "Portfolio Review",
    date: "2025-04-11",
    time: "14:00",
    duration: 60,
    interviewerId: "3",
    interviewerName: "David Chen",
    status: "scheduled",
  },
  {
    id: "3",
    candidateId: "3",
    candidateName: "Robert Johnson",
    roleId: "3",
    roleName: "Marketing Manager",
    type: "Final Round",
    date: "2025-04-05",
    time: "11:00",
    duration: 90,
    interviewerId: "4",
    interviewerName: "Lisa Wong",
    status: "completed",
    feedback: "Strong technical background. Good communication skills. Recommended for next round.",
  },
  {
    id: "4",
    candidateId: "4",
    candidateName: "Emily Wilson",
    roleId: "4",
    roleName: "Backend Engineer",
    type: "Initial Screening",
    date: "2025-04-08",
    time: "09:30",
    duration: 45,
    interviewerId: "2",
    interviewerName: "Sarah Johnson",
    status: "cancelled",
  },
  {
    id: "5",
    candidateId: "5",
    candidateName: "Michael Brown",
    roleId: "5",
    roleName: "Sales Representative",
    type: "Role Play",
    date: "2025-04-03",
    time: "15:00",
    duration: 60,
    interviewerId: "4",
    interviewerName: "Amanda Garcia",
    status: "completed",
    feedback: "Excellent sales skills. Great cultural fit. Recommended for hire.",
  },
]

export const initialActivities: Activity[] = [
  {
    id: "1",
    type: "candidate_stage_changed",
    description: "Jane Smith was moved to Screening stage",
    timestamp: "2025-04-04T10:30:00Z",
    candidateId: "2",
    roleId: "2",
  },
  {
    id: "2",
    type: "interview_scheduled",
    description: "John Doe was scheduled for a Technical Interview",
    timestamp: "2025-04-03T14:15:00Z",
    candidateId: "1",
    roleId: "1",
    interviewId: "1",
  },
  {
    id: "3",
    type: "candidate_applied",
    description: "Robert Johnson applied for Marketing Manager position",
    timestamp: "2025-04-03T09:45:00Z",
    candidateId: "3",
    roleId: "3",
  },
  {
    id: "4",
    type: "candidate_applied",
    description: "Emily Wilson applied for Backend Engineer position",
    timestamp: "2025-04-02T11:20:00Z",
    candidateId: "4",
    roleId: "4",
  },
  {
    id: "5",
    type: "offer_sent",
    description: "Offer sent to Robert Johnson for Marketing Manager position",
    timestamp: "2025-04-01T15:30:00Z",
    candidateId: "3",
    roleId: "3",
  },
]

export const initialDashboard: Dashboard = {
  totalRoles: 5,
  activeRoles: 3,
  totalCandidates: 5,
  activeCandidates: 4,
  interviewsThisWeek: 3,
  timeToHire: 18,
  recentActivity: initialActivities,
}

// Helper functions to generate IDs
export const generateId = (): string => {
  return uuidv4()
}

// Helper function to format date
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0]
}

// Helper function to get current date
export const getCurrentDate = (): string => {
  return formatDate(new Date())
}
