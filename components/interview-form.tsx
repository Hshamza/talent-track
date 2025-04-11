"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Calendar, Clock, User, Users, Briefcase, MapPin, Video, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { createInterview, updateInterview } from "@/lib/storage"
import type { Candidate, Role, Interview } from "@/lib/types"
import Link from "next/link"

const formSchema = z.object({
  candidateId: z.string({
    required_error: "Please select a candidate.",
  }),
  roleId: z.string({
    required_error: "Please select a role.",
  }),
  type: z.string().min(2, {
    message: "Interview type must be at least 2 characters.",
  }),
  date: z.string({
    required_error: "Please select a date.",
  }),
  time: z.string({
    required_error: "Please select a time.",
  }),
  duration: z.coerce.number().min(15, {
    message: "Duration must be at least 15 minutes.",
  }),
  interviewerId: z.string({
    required_error: "Please select an interviewer.",
  }),
  locationType: z.enum(["virtual", "onsite"], {
    required_error: "Please select a location type.",
  }),
  location: z.string().optional(),
  notes: z.string().optional(),
})

interface InterviewFormProps {
  candidates: Candidate[]
  interviewers: any
  roles: Role[]
  interview?: Interview
  isEdit?: boolean
}

export function InterviewForm({ candidates, interviewers, roles, interview, isEdit = false }: InterviewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [locationType, setLocationType] = useState<"virtual" | "onsite">(interview?.location ? "onsite" : "virtual")

  // Prepare default values for edit mode
  const defaultValues = isEdit && interview ? getDefaultValues(interview) : getEmptyDefaultValues()

  function getDefaultValues(interview: Interview) {
    return {
      candidateId: interview.candidateId,
      roleId: interview.roleId,
      type: interview.type,
      date: interview.date,
      time: interview.time,
      duration: interview.duration,
      interviewerId: interview.interviewerId,
      locationType: interview.location ? "onsite" : "virtual",
      location: interview.location || "",
      notes: interview.notes || "",
    }
  }

  function getEmptyDefaultValues() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split("T")[0]

    return {
      candidateId: "",
      roleId: "",
      type: "Technical Interview",
      date: today,
      time: "10:00",
      duration: 60,
      interviewerId: "",
      locationType: "virtual",
      location: "",
      notes: "",
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
 //   defaultValues,
  })

  // Watch for location type changes
  const watchLocationType = form.watch("locationType")
  if (watchLocationType !== locationType) {
    setLocationType(watchLocationType as "virtual" | "onsite")
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Get candidate and role names for display
      const candidate = candidates.find((c) => c.id === values.candidateId)
      const role = roles.find((r) => r.id === values.roleId)
      const interviewer = interviewers.find((i:any) => i.id === values.interviewerId)

      if (!candidate || !role || !interviewer) {
        throw new Error("Invalid selection")
      }

      const interviewData = {
        ...values,
        candidateName: candidate.name,
        roleName: role.title,
        interviewerName: interviewer.name,
        status: "scheduled" as const,
        location: values.locationType === "onsite" ? values.location : 'onsite',
      }

      if (isEdit && interview) {
        // Update existing interview
        const updatedInterview = updateInterview(interview.id, interviewData)

        if (updatedInterview) {
          toast({
            title: "Interview updated successfully",
            description: `The interview with ${candidate.name} has been updated.`,
          })

          // Redirect to interview page
          router.push(`/dashboard/interviews/${interview.id}`)
        } else {
          throw new Error("Failed to update interview")
        }
      } else {
        // Create new interview
        const newInterview = createInterview(interviewData)

        toast({
          title: "Interview scheduled successfully",
          description: `The interview with ${candidate.name} has been scheduled.`,
        })

        // Redirect to interviews page
        router.push(`/dashboard/interviews/${newInterview.id}`)
      }
    } catch (error) {
      console.error("Error with interview:", error)
      toast({
        title: "Something went wrong",
        description: isEdit
          ? "Your interview couldn't be updated. Please try again."
          : "Your interview couldn't be scheduled. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="candidateId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  Candidate*
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a candidate" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {candidates.length === 0 ? (
                      <SelectItem value="no-candidates" disabled>
                        No candidates available
                      </SelectItem>
                    ) : (
                      candidates.map((candidate) => (
                        <SelectItem key={candidate.id} value={candidate.id}>
                          {candidate.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>
                  {candidates.length === 0 ? (
                    <span className="text-amber-500">
                      No candidates available.{" "}
                      <Link href="/dashboard/candidates/new" className="underline">
                        Add a candidate
                      </Link>{" "}
                      first.
                    </span>
                  ) : (
                    "The candidate being interviewed"
                  )}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  Role*
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles.length === 0 ? (
                      <SelectItem value="no-roles" disabled>
                        No roles available
                      </SelectItem>
                    ) : (
                      roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.title}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormDescription>The role the candidate is applying for</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Interview Type*</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Technical Interview" {...field} />
                </FormControl>
                <FormDescription>Type of interview (Technical, Behavioral, etc.)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interviewerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  Interviewer*
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an interviewer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {interviewers.map((interviewer: any) => (
                      <SelectItem key={interviewer.id} value={interviewer.id}>
                        {interviewer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>The person conducting the interview</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  Date*
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  Time*
                </FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)*</FormLabel>
                <FormControl>
                  <Input type="number" min={15} step={15} {...field} />
                </FormControl>
                <FormDescription>Interview length in minutes</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="locationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Type*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="virtual" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center gap-1">
                        <Video className="h-3.5 w-3.5 text-muted-foreground" />
                        Virtual
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="onsite" />
                      </FormControl>
                      <FormLabel className="font-normal flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        On-site
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {locationType === "onsite" && (
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 123 Main St, Suite 200, San Francisco, CA" {...field} />
                </FormControl>
                <FormDescription>Physical location for the interview</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Separator className="my-4" />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                Notes
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any notes or instructions for the interview..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Additional information for the interviewer or candidate</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/interviews")}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || candidates.length === 0 || roles.length === 0}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
          >
            {isSubmitting
              ? isEdit
                ? "Updating..."
                : "Scheduling..."
              : isEdit
                ? "Update Interview"
                : "Schedule Interview"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
