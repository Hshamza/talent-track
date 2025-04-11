// "use client"

// import { useState } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { ArrowLeft, Trash } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Checkbox } from "@/components/ui/checkbox"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Separator } from "@/components/ui/separator"
// import { toast } from "@/components/ui/use-toast"
// import { createRole } from "@/lib/storage"

// const formSchema = z.object({
//   title: z.string().min(2, {
//     message: "Job title must be at least 2 characters.",
//   }),
//   department: z.string({
//     required_error: "Please select a department.",
//   }),
//   location: z.string().min(2, {
//     message: "Location must be at least 2 characters.",
//   }),
//   locationType: z.enum(["remote", "onsite", "hybrid"], {
//     required_error: "Please select a location type.",
//   }),
//   description: z.string().min(10, {
//     message: "Job description must be at least 10 characters.",
//   }),
//   requirements: z.string().min(10, {
//     message: "Requirements must be at least 10 characters.",
//   }),
//   responsibilities: z.string().min(10, {
//     message: "Responsibilities must be at least 10 characters.",
//   }),
//   minSalary: z.string().optional(),
//   maxSalary: z.string().optional(),
//   showSalary: z.boolean().default(false),
//   employmentType: z.enum(["full-time", "part-time", "contract", "internship"], {
//     required_error: "Please select an employment type.",
//   }),
//   status: z.enum(["active", "draft", "paused"], {
//     required_error: "Please select a status.",
//   }),
//   keySkills: z.array(z.string()).min(1, {
//     message: "Please add at least one key skill required for this job.",
//   }),
//   experienceLevel: z.enum(["entry", "mid", "senior", "executive"], {
//     required_error: "Please select an experience level.",
//   }),
//   applicationDeadline: z.string().optional(),
// })

// export default function PostJobPage() {
//   const router = useRouter()
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [skillInput, setSkillInput] = useState("")
//   const [keySkills, setKeySkills] = useState<string[]>([])

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       title: "",
//       description: "",
//       requirements: "",
//       responsibilities: "",
//       minSalary: "",
//       maxSalary: "",
//       showSalary: false,
//       status: "draft",
//       keySkills: [],
//       experienceLevel: "mid",
//       applicationDeadline: "",
//     },
//   })

//   const addSkill = () => {
//     if (skillInput.trim() && !keySkills.includes(skillInput.trim())) {
//       const newSkills = [...keySkills, skillInput.trim()]
//       setKeySkills(newSkills)
//       form.setValue("keySkills", newSkills)
//       setSkillInput("")
//     }
//   }

//   const removeSkill = (skill: string) => {
//     const newSkills = keySkills.filter((s) => s !== skill)
//     setKeySkills(newSkills)
//     form.setValue("keySkills", newSkills)
//   }

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     setIsSubmitting(true)

//     try {
//       // Create the role with key skills
//       const newRole = createRole({
//         ...values,
//         keySkills: keySkills,
//       })

//       toast({
//         title: "Job posted successfully",
//         description: `${values.title} has been added to your open roles.`,
//       })

//       // Redirect to roles page
//       router.push("/dashboard/roles")
//     } catch (error) {
//       console.error("Error creating role:", error)
//       toast({
//         title: "Something went wrong",
//         description: "Your job couldn't be posted. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <div className="flex items-center gap-2">
//         <Link href="/dashboard/roles">
//           <Button variant="ghost" size="icon">
//             <ArrowLeft className="h-4 w-4" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold">Post New Job</h1>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle>Job Details</CardTitle>
//           <CardDescription>
//             Create a new job posting for your organization. Fill in all the required information.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//               <div className="grid gap-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="title"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Title*</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g. Senior Frontend Developer" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="department"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Department*</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select a department" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="engineering">Engineering</SelectItem>
//                           <SelectItem value="design">Design</SelectItem>
//                           <SelectItem value="product">Product</SelectItem>
//                           <SelectItem value="marketing">Marketing</SelectItem>
//                           <SelectItem value="sales">Sales</SelectItem>
//                           <SelectItem value="hr">HR</SelectItem>
//                           <SelectItem value="finance">Finance</SelectItem>
//                           <SelectItem value="operations">Operations</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="location"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Location*</FormLabel>
//                       <FormControl>
//                         <Input placeholder="e.g. San Francisco, CA" {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="locationType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Location Type*</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select location type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="remote">Remote</SelectItem>
//                           <SelectItem value="onsite">On-site</SelectItem>
//                           <SelectItem value="hybrid">Hybrid</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="employmentType"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Employment Type*</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select employment type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="full-time">Full-time</SelectItem>
//                           <SelectItem value="part-time">Part-time</SelectItem>
//                           <SelectItem value="contract">Contract</SelectItem>
//                           <SelectItem value="internship">Internship</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="experienceLevel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Experience Level*</FormLabel>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select experience level" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="entry">Entry Level</SelectItem>
//                           <SelectItem value="mid">Mid Level</SelectItem>
//                           <SelectItem value="senior">Senior Level</SelectItem>
//                           <SelectItem value="executive">Executive Level</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="applicationDeadline"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Application Deadline</FormLabel>
//                       <FormControl>
//                         <Input type="date" {...field} />
//                       </FormControl>
//                       <FormDescription>Leave blank if there's no deadline</FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="status"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Status*</FormLabel>
//                       <RadioGroup
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                         className="flex flex-col space-y-1"
//                       >
//                         <FormItem className="flex items-center space-x-3 space-y-0">
//                           <FormControl>
//                             <RadioGroupItem value="draft" />
//                           </FormControl>
//                           <FormLabel className="font-normal">Draft</FormLabel>
//                         </FormItem>
//                         <FormItem className="flex items-center space-x-3 space-y-0">
//                           <FormControl>
//                             <RadioGroupItem value="active" />
//                           </FormControl>
//                           <FormLabel className="font-normal">Active</FormLabel>
//                         </FormItem>
//                         <FormItem className="flex items-center space-x-3 space-y-0">
//                           <FormControl>
//                             <RadioGroupItem value="paused" />
//                           </FormControl>
//                           <FormLabel className="font-normal">Paused</FormLabel>
//                         </FormItem>
//                       </RadioGroup>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-medium">Key Skills Required*</h3>
//                   <p className="text-sm text-muted-foreground">
//                     Add the key skills required for this job. These will be used to match with candidate resumes.
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <Input
//                     placeholder="Add a skill (e.g. React, JavaScript, Project Management)"
//                     value={skillInput}
//                     onChange={(e) => setSkillInput(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault()
//                         addSkill()
//                       }
//                     }}
//                   />
//                   <Button type="button" onClick={addSkill}>
//                     Add
//                   </Button>
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {keySkills.map((skill, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
//                     >
//                       {skill}
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         className="h-4 w-4 rounded-full"
//                         onClick={() => removeSkill(skill)}
//                       >
//                         <Trash className="h-3 w-3" />
//                         <span className="sr-only">Remove {skill}</span>
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//                 {form.formState.errors.keySkills && (
//                   <p className="text-sm font-medium text-destructive">{form.formState.errors.keySkills.message}</p>
//                 )}
//               </div>

//               <Separator />

//               <div className="grid gap-6">
//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Description*</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Provide a detailed description of the job..."
//                           className="min-h-[120px]"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="requirements"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Requirements*</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="List the requirements for this position..."
//                           className="min-h-[120px]"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormDescription>
//                         Include skills, experience, education, and other qualifications.
//                       </FormDescription>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="responsibilities"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Responsibilities*</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="List the responsibilities for this position..."
//                           className="min-h-[120px]"
//                           {...field}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <Separator />

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-medium">Salary Information</h3>
//                   <p className="text-sm text-muted-foreground">Provide salary information for this position.</p>
//                 </div>

//                 <div className="grid gap-6 md:grid-cols-2">
//                   <FormField
//                     control={form.control}
//                     name="minSalary"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Minimum Salary</FormLabel>
//                         <FormControl>
//                           <Input type="number" placeholder="e.g. 50000" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="maxSalary"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Maximum Salary</FormLabel>
//                         <FormControl>
//                           <Input type="number" placeholder="e.g. 80000" {...field} />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <FormField
//                   control={form.control}
//                   name="showSalary"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
//                       <FormControl>
//                         <Checkbox checked={field.value} onCheckedChange={field.onChange} />
//                       </FormControl>
//                       <div className="space-y-1 leading-none">
//                         <FormLabel>Display salary range on job posting</FormLabel>
//                         <FormDescription>If checked, the salary range will be visible to candidates.</FormDescription>
//                       </div>
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="flex justify-end space-x-4">
//                 <Button variant="outline" type="button" onClick={() => router.push("/dashboard/roles")}>
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Posting..." : "Post Job"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
