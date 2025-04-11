import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Download, Mail, MapPin, Phone } from "lucide-react"
import { SkillGraph } from "@/components/skill-graph";

export default function CandidateProfile({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the candidate data based on the ID
  const candidate = {
    id: params.id,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    position: "Senior Frontend Developer",
    stage: "Interview",
    appliedDate: "Apr 2, 2025",
    lastContact: "Apr 5, 2025",
    about:
      "Experienced frontend developer with 7+ years of experience building responsive web applications. Proficient in React, TypeScript, and modern frontend frameworks.",
    experience: [
      {
        title: "Senior Frontend Developer",
        company: "Tech Solutions Inc.",
        period: "2022 - Present",
        description:
          "Led the frontend development team in building a complex SaaS platform. Implemented modern React patterns and improved performance by 40%.",
      },
      {
        title: "Frontend Developer",
        company: "WebDev Agency",
        period: "2018 - 2022",
        description:
          "Developed responsive web applications for various clients. Worked with React, Vue, and Angular frameworks.",
      },
    ],
    education: [
      {
        degree: "M.S. Computer Science",
        school: "Stanford University",
        year: "2018",
      },
      {
        degree: "B.S. Computer Science",
        school: "University of California, Berkeley",
        year: "2016",
      },
    ],
    skills: [
      { name: "React", proficiency: "advanced" as const },
      { name: "TypeScript", proficiency: "advanced" as const },
      { name: "JavaScript", proficiency: "intermediate" as const },
      { name: "HTML/CSS", proficiency: "advanced" as const },
      { name: "Redux", proficiency: "intermediate" as const },
    ],
    interviews: [
      {
        type: "Technical Interview",
        date: "Apr 10, 2025",
        time: "10:00 AM",
        interviewer: "Sarah Johnson",
        status: "Scheduled",
      },
      {
        type: "Initial Screening",
        date: "Apr 5, 2025",
        time: "2:00 PM",
        interviewer: "Michael Chen",
        status: "Completed",
        feedback: "Strong technical background. Good communication skills. Recommended for next round.",
      },
    ],
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Link href="/dashboard/candidates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Candidate Profile</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt={candidate.name} />
              <AvatarFallback>
                {candidate.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{candidate.name}</CardTitle>
              <CardDescription>{candidate.position}</CardDescription>
              <Badge className="mt-2" variant="secondary">
                {candidate.stage}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{candidate.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>{candidate.location}</span>
              </div>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Applied: {candidate.appliedDate}</span>
              </div>
            </div>

            <SkillGraph skills={candidate.skills} />

            <Separator />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact
                </Button>
              </div>
              <Link href="/dashboard/interviews/new">
                <Button className="w-full">Schedule Interview</Button>
              </Link>

              <Button asChild variant="secondary" className="w-full mt-2">
  <Link href={`/dashboard/candidates/${candidate.id}/edit`}>Edit Candidate</Link>
</Button>

            </div>
          </CardContent>
        </Card>

        <div className="space-y-6 md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="interviews">Interviews</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{candidate.about}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.experience.map((exp, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{exp.title}</h3>
                          <p className="text-sm text-muted-foreground">{exp.company}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{exp.period}</p>
                      </div>
                      <p className="text-sm">{exp.description}</p>
                      {index < candidate.experience.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{edu.degree}</h3>
                          <p className="text-sm text-muted-foreground">{edu.school}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                      {index < candidate.education.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="interviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview History</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {candidate.interviews.map((interview, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{interview.type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {interview.date} • {interview.time} • {interview.interviewer}
                          </p>
                        </div>
                        <Badge variant={interview.status === "Scheduled" ? "outline" : "secondary"}>
                          {interview.status}
                        </Badge>
                      </div>
                      {interview.feedback && (
                        <div className="rounded-md bg-muted p-3 text-sm">
                          <p className="font-medium">Feedback:</p>
                          <p>{interview.feedback}</p>
                        </div>
                      )}
                      {index < candidate.interviews.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Interview</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Schedule Interview</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="font-medium">Initial Screening Notes</div>
                      <div className="text-sm text-muted-foreground">Apr 5, 2025</div>
                    </div>
                    <p className="text-sm">
                      Candidate has strong technical skills and experience with React and TypeScript. Good communication
                      skills and problem-solving approach. Recommended for technical interview.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Add Note</h3>
                    <Textarea placeholder="Type your notes here..." />
                    <Button className="mt-2">Save Note</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Resume.pdf</div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Cover Letter.pdf</div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Portfolio.pdf</div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
