"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ArrowLeft, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { getRole, handleCandidateApplication } from "@/lib/storage"
import { parseResume } from "@/lib/resume-parser"
import type { Role } from "@/lib/types"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  location: z.string().optional(),
  coverLetter: z.string().optional(),
  resume: z.instanceof(FileList).refine((files) => files.length > 0, "Resume is required"),
})

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      location: "",
      coverLetter: "",
    },
  })

  useEffect(() => {
    // Get role data
    const roleData = getRole(params.id)
    if (!roleData || roleData.status !== "active") {
      router.push("/careers")
      return
    }

    setRole(roleData)
    setIsLoading(false)
  }, [params.id, router])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setResumeFile(file)
      form.setValue("resume", files)

      // Read the file as text (simulating resume parsing)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        setResumeText(text)
      }
      reader.readAsText(file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!role) return

    setIsSubmitting(true)

    try {
      // Use a fallback text if the resume couldn't be read
      const textToAnalyze = resumeText || "Sample resume content for demo purposes"

      // Parse the resume (in a real app, this would use NLP or a resume parsing service)
      const parsedResume = parseResume(textToAnalyze, role.keySkills || [])

      // Process the candidate application (create new or update existing)
      const { candidate, isNewCandidate, isMatch } = handleCandidateApplication({
        name: values.name,
        email: values.email,
        phone: values.phone || "",
        location: values.location || "",
        roleId: role.id,
        skills: parsedResume.skills,
        experience: parsedResume.experience,
        education: parsedResume.education,
        matchScore: parsedResume.matchScore,
        coverLetter: values.coverLetter,
      })

      // Show appropriate toast message
      if (isNewCandidate) {
        toast({
          title: "Application submitted successfully",
          description: isMatch
            ? "Your resume matches our requirements! We'll be in touch soon."
            : "Thank you for your application. We'll review it and get back to you.",
        })
      } else {
        toast({
          title: "Application updated successfully",
          description: isMatch
            ? "Your updated resume matches our requirements! We'll be in touch soon."
            : "Thank you for updating your application. We'll review it and get back to you.",
        })
      }

      // Redirect to success page
      router.push(
        `/careers/${role.id}/apply/success?match=${isMatch ? "true" : "false"}&id=${
          candidate.id
        }&isNew=${isNewCandidate}`,
      )
    } catch (error) {
      console.error("Error submitting application:", error)
      toast({
        title: "Something went wrong",
        description: "Your application couldn't be submitted. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !role) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/careers/${params.id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/careers/${params.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Apply for {role.title}</h1>
          <p className="text-muted-foreground">Complete the form below to submit your application</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Application Form</CardTitle>
          <CardDescription>
            Please fill out all required fields and upload your resume to apply for this position.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="resume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resume*</FormLabel>
                    <FormControl>
                      <div
                        className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.txt"
                          onChange={(e) => {
                            const files = e.target.files
                            if (files?.length) {
                              setResumeFile(files[0])
                              field.onChange(files)

                              // Read the file as text (simulating resume parsing)
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                const text = e.target?.result as string
                                setResumeText(text || "Sample resume content for demo purposes")
                              }
                              reader.readAsText(files[0])
                            }
                          }}
                        />
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">
                          {resumeFile ? resumeFile.name : "Click to upload your resume"}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF, DOC, DOCX or TXT (max 5MB)</p>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Your resume will be automatically analyzed to match your skills with the job requirements.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="coverLetter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover Letter</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us why you're interested in this position and why you'd be a good fit..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Optional but recommended</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button" onClick={() => router.push(`/careers/${params.id}`)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
