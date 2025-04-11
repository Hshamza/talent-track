import { v4 as uuidv4 } from "uuid"

// This is a simplified resume parser for demonstration purposes
// In a real application, you would use a more sophisticated NLP-based parser
// or a third-party resume parsing service

interface ParsedResume {
  skills: string[]
  experience: {
    id: string
    title: string
    company: string
    location?: string
    startDate: string
    endDate?: string
    current: boolean
    description?: string
  }[]
  education: {
    id: string
    degree: string
    school: string
    location?: string
    startDate: string
    endDate?: string
    current: boolean
    description?: string
  }[]
  matchScore: number
}

export function parseResume(resumeText: string, jobSkills: string[]): ParsedResume {
  // Handle empty input
  if (!resumeText || resumeText.trim().length === 0) {
    // Return a default parsed resume with some generic skills
    return {
      skills: ["JavaScript", "Communication", "Problem Solving"],
      experience: [
        {
          id: uuidv4(),
          title: "Developer",
          company: "Tech Company",
          location: "Remote",
          startDate: "2020-01-01",
          endDate: "",
          current: true,
          description: "Software development role",
        },
      ],
      education: [
        {
          id: uuidv4(),
          degree: "Computer Science",
          school: "University",
          location: "Online",
          startDate: "2016-01-01",
          endDate: "2020-01-01",
          current: false,
          description: "",
        },
      ],
      matchScore: 0.5, // Neutral match score
    }
  }

  // Extract skills (simplified)
  const extractedSkills = extractSkills(resumeText)

  // Extract experience (simplified)
  const extractedExperience = extractExperience(resumeText)

  // Extract education (simplified)
  const extractedEducation = extractEducation(resumeText)

  // Calculate match score based on skills
  const matchScore = calculateMatchScore(extractedSkills, jobSkills)

  return {
    skills: extractedSkills,
    experience: extractedExperience,
    education: extractedEducation,
    matchScore,
  }
}

function extractSkills(text: string): string[] {
  // Common skills to look for in the resume
  const commonSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "HTML",
    "CSS",
    "Python",
    "Java",
    "C++",
    "C#",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Azure",
    "Docker",
    "Kubernetes",
    "Git",
    "CI/CD",
    "Project Management",
    "Agile",
    "Scrum",
    "Leadership",
    "Communication",
    "Marketing",
    "SEO",
    "Content Writing",
    "Social Media",
    "Analytics",
    "Design",
    "UI/UX",
    "Figma",
    "Photoshop",
    "Illustrator",
    "Sales",
    "Customer Service",
    "Negotiation",
    "CRM",
    "Account Management",
  ]

  // Extract skills that appear in the resume text
  const skills = commonSkills.filter((skill) => text.toLowerCase().includes(skill.toLowerCase()))

  // Add some random skills based on the text length to simulate more complex parsing
  if (text.length > 500) {
    if (!skills.includes("Communication")) skills.push("Communication")
    if (!skills.includes("Problem Solving")) skills.push("Problem Solving")
  }

  if (text.length > 1000) {
    if (!skills.includes("Team Leadership")) skills.push("Team Leadership")
  }

  return skills
}

function extractExperience(text: string): any[] {
  // This is a simplified simulation of experience extraction
  // In a real app, you would use NLP to extract structured data from the resume

  const experience = []

  // Check for common experience patterns
  if (text.toLowerCase().includes("experience") || text.toLowerCase().includes("work")) {
    // Add a simulated experience entry
    experience.push({
      id: uuidv4(),
      title: "Software Developer",
      company: "Tech Company",
      location: "San Francisco, CA",
      startDate: "2020-01-01",
      endDate: "",
      current: true,
      description: "Developed and maintained web applications using modern technologies.",
    })
  }

  // Add another experience if the text is longer (simulating more content)
  if (text.length > 800) {
    experience.push({
      id: uuidv4(),
      title: "Junior Developer",
      company: "Startup Inc.",
      location: "Remote",
      startDate: "2018-06-01",
      endDate: "2019-12-31",
      current: false,
      description: "Worked on frontend development using React and JavaScript.",
    })
  }

  return experience
}

function extractEducation(text: string): any[] {
  // This is a simplified simulation of education extraction

  const education = []

  // Check for common education patterns
  if (
    text.toLowerCase().includes("education") ||
    text.toLowerCase().includes("university") ||
    text.toLowerCase().includes("college") ||
    text.toLowerCase().includes("degree")
  ) {
    // Add a simulated education entry
    education.push({
      id: uuidv4(),
      degree: "Bachelor of Science in Computer Science",
      school: "University of Technology",
      location: "Boston, MA",
      startDate: "2014-09-01",
      endDate: "2018-05-31",
      current: false,
    })
  }

  return education
}

function calculateMatchScore(candidateSkills: string[], jobSkills: string[]): number {
  if (!jobSkills || !jobSkills.length) return 0.5 // If no job skills specified, return neutral score
  if (!candidateSkills || !candidateSkills.length) return 0.3 // If no candidate skills found, return low score

  // Convert all skills to lowercase for case-insensitive matching
  const normalizedCandidateSkills = candidateSkills.map((s) => s.toLowerCase())
  const normalizedJobSkills = jobSkills.map((s) => s.toLowerCase())

  // Count how many job skills are found in candidate skills
  let matchCount = 0
  for (const skill of normalizedJobSkills) {
    if (normalizedCandidateSkills.some((s) => s.includes(skill) || skill.includes(s))) {
      matchCount++
    }
  }

  // Calculate match percentage
  return jobSkills.length > 0 ? matchCount / normalizedJobSkills.length : 0.5
}
