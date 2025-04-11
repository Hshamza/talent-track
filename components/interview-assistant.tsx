"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Brain, Copy, Download, Lightbulb, MessageSquare, Save, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Role, Candidate, Interview } from "@/lib/types"

interface InterviewAssistantProps {
  role?: Role
  candidate?: Candidate
  interview?: Interview
  mode?: "prepare" | "conduct" | "review"
}

export function InterviewAssistant({ role, candidate, interview, mode = "prepare" }: InterviewAssistantProps) {
  const [activeTab, setActiveTab] = useState(mode)
  const [isGenerating, setIsGenerating] = useState(false)
  const [questions, setQuestions] = useState<{ text: string; category: string; checked: boolean }[]>([])
  const [notes, setNotes] = useState("")
  const [insights, setInsights] = useState<{ type: string; text: string }[]>([])
  const [feedback, setFeedback] = useState("")
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null)

  // Simulate loading questions based on role
  useEffect(() => {
    if (role && activeTab === "prepare" && questions.length === 0) {
      generateQuestions()
    }
  }, [role, activeTab, questions.length])

  // Simulate generating interview questions based on role
  const generateQuestions = () => {
    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const generatedQuestions = getQuestionsForRole(role?.title || "")
      setQuestions(generatedQuestions)
      setIsGenerating(false)

      toast({
        title: "Questions generated",
        description: `${generatedQuestions.length} questions have been generated for this role.`,
      })
    }, 1500)
  }

  // Simulate analyzing notes for insights
  const analyzeNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "No notes to analyze",
        description: "Please enter some interview notes first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      // Determine sentiment based on notes content
      let detectedSentiment: "positive" | "neutral" | "negative" = "neutral"

      if (
        notes.toLowerCase().includes("excellent") ||
        notes.toLowerCase().includes("outstanding") ||
        notes.toLowerCase().includes("great fit")
      ) {
        detectedSentiment = "positive"
      } else if (
        notes.toLowerCase().includes("concern") ||
        notes.toLowerCase().includes("weak") ||
        notes.toLowerCase().includes("not a good fit")
      ) {
        detectedSentiment = "negative"
      }

      setSentiment(detectedSentiment)

      // Generate insights based on notes
      const generatedInsights = [
        {
          type: "strength",
          text: "Candidate demonstrated strong technical knowledge in the required areas.",
        },
        {
          type: "area",
          text: "Consider evaluating team collaboration skills more deeply in the next round.",
        },
        {
          type: "recommendation",
          text:
            detectedSentiment === "positive"
              ? "Recommend advancing to the next interview stage."
              : detectedSentiment === "negative"
                ? "Consider other candidates who may be a better fit."
                : "Additional assessment recommended to evaluate cultural fit.",
        },
      ]

      setInsights(generatedInsights)
      setIsGenerating(false)

      toast({
        title: "Analysis complete",
        description: "Your interview notes have been analyzed.",
      })
    }, 2000)
  }

  // Generate feedback based on notes and insights
  const generateFeedback = () => {
    if (insights.length === 0) {
      toast({
        title: "No insights available",
        description: "Please analyze your notes first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Simulate API call delay
    setTimeout(() => {
      const generatedFeedback = `
Based on the interview with ${candidate?.name || "the candidate"} for the ${role?.title || "role"}, here's a summary:

Strengths:
- Technical skills align well with our requirements
- Demonstrated problem-solving abilities
- Good communication skills

Areas for Development:
- Could benefit from more experience with team collaboration
- Consider additional assessment for cultural fit

Recommendation:
${
  sentiment === "positive"
    ? "The candidate shows strong potential and should be advanced to the next stage of the interview process."
    : sentiment === "negative"
      ? "While the candidate has some strengths, there may be better fits for this specific role."
      : "The candidate has potential but requires additional assessment in key areas before making a final decision."
}

Next Steps:
${
  sentiment === "positive"
    ? "Schedule a follow-up interview focusing on team collaboration scenarios."
    : sentiment === "negative"
      ? "Consider other candidates in the pipeline while keeping this candidate's application active."
      : "Conduct an additional technical assessment to evaluate specific skills in more depth."
}
`

      setFeedback(generatedFeedback)
      setIsGenerating(false)

      toast({
        title: "Feedback generated",
        description: "Comprehensive feedback has been created based on your notes and analysis.",
      })
    }, 2000)
  }

  // Handle checkbox toggle
  const toggleQuestion = (index: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[index].checked = !updatedQuestions[index].checked
    setQuestions(updatedQuestions)
  }

  // Copy content to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    })
  }

  // Save interview guide as PDF (simulated)
  const saveAsPDF = () => {
    toast({
      title: "PDF generated",
      description: "Your interview guide has been saved as a PDF.",
    })
  }

  return (
    <Card className="overflow-hidden border-none bg-white shadow-md dark:bg-slate-900">
      <div className="absolute left-0 top-0 h-2 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-violet-100 p-1.5 dark:bg-violet-900/30">
              <Brain className="h-5 w-5 text-violet-500" />
            </div>
            <CardTitle>Interview Assistant</CardTitle>
          </div>
          <Badge variant="outline" className="bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400">
            AI-Powered
          </Badge>
        </div>
        <CardDescription>Your AI assistant for preparing, conducting, and reviewing interviews</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prepare">Prepare</TabsTrigger>
            <TabsTrigger value="conduct">Conduct</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Prepare Tab - Question Generation */}
          <TabsContent value="prepare" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Interview Questions</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateQuestions}
                disabled={isGenerating}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                {isGenerating ? "Generating..." : "Regenerate"}
              </Button>
            </div>

            {isGenerating ? (
              <div className="flex h-40 items-center justify-center">
                <div className="relative h-16 w-16">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></div>
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-violet-500">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ) : questions.length > 0 ? (
              <ScrollArea className="h-[320px] rounded-md border p-4">
                <div className="space-y-6">
                  {Object.entries(
                    questions.reduce(
                      (acc, question) => {
                        if (!acc[question.category]) {
                          acc[question.category] = []
                        }
                        acc[question.category].push(question)
                        return acc
                      },
                      {} as Record<string, typeof questions>,
                    ),
                  ).map(([category, categoryQuestions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-sm text-violet-600 dark:text-violet-400">{category}</h4>
                      <div className="space-y-2">
                        {categoryQuestions.map((question, index) => {
                          const questionIndex = questions.findIndex((q) => q.text === question.text)
                          return (
                            <div key={index} className="flex items-start gap-2">
                              <Checkbox
                                id={`question-${questionIndex}`}
                                checked={question.checked}
                                onCheckedChange={() => toggleQuestion(questionIndex)}
                                className="mt-1"
                              />
                              <Label
                                htmlFor={`question-${questionIndex}`}
                                className="text-sm leading-relaxed cursor-pointer"
                              >
                                {question.text}
                              </Label>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
                <Lightbulb className="h-8 w-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  Generate interview questions based on the role requirements
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(questions.map((q) => q.text).join("\n\n"))}
                disabled={questions.length === 0}
              >
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy All
              </Button>
              <Button variant="outline" size="sm" onClick={saveAsPDF} disabled={questions.length === 0}>
                <Download className="mr-2 h-3.5 w-3.5" />
                Save as PDF
              </Button>
            </div>
          </TabsContent>

          {/* Conduct Tab - Note Taking */}
          <TabsContent value="conduct" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Interview Notes</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={analyzeNotes}
                disabled={isGenerating || !notes.trim()}
                className="gap-1.5"
              >
                <Brain className="h-3.5 w-3.5 text-violet-500" />
                Analyze Notes
              </Button>
            </div>

            <Textarea
              placeholder="Take notes during the interview... The AI will analyze your notes to provide insights."
              className="min-h-[200px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            {isGenerating ? (
              <div className="flex h-40 items-center justify-center">
                <div className="relative h-16 w-16">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></div>
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-violet-500">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ) : insights.length > 0 ? (
              <div className="space-y-4 rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Real-time Insights</h4>
                  {sentiment && (
                    <Badge
                      variant="outline"
                      className={cn(
                        "px-2 py-1",
                        sentiment === "positive" &&
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                        sentiment === "neutral" && "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                        sentiment === "negative" &&
                          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                      )}
                    >
                      {sentiment === "positive" && <ThumbsUp className="mr-1 h-3 w-3" />}
                      {sentiment === "negative" && <ThumbsDown className="mr-1 h-3 w-3" />}
                      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)} Impression
                    </Badge>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  {insights.map((insight, index) => (
                    <div key={index} className="rounded-md bg-muted p-3">
                      <p className="text-sm font-medium mb-1">
                        {insight.type === "strength" && "Strength"}
                        {insight.type === "area" && "Area to Explore"}
                        {insight.type === "recommendation" && "Recommendation"}
                      </p>
                      <p className="text-sm">{insight.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  Take notes during the interview and get AI-powered insights
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(notes)} disabled={!notes.trim()}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Notes saved",
                    description: "Your interview notes have been saved.",
                  })
                }}
                disabled={!notes.trim()}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                Save Notes
              </Button>
            </div>
          </TabsContent>

          {/* Review Tab - Feedback Generation */}
          <TabsContent value="review" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Interview Feedback</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={generateFeedback}
                disabled={isGenerating || insights.length === 0}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                Generate Feedback
              </Button>
            </div>

            {isGenerating ? (
              <div className="flex h-40 items-center justify-center">
                <div className="relative h-16 w-16">
                  <div className="absolute h-full w-full animate-ping rounded-full bg-violet-400 opacity-75"></div>
                  <div className="relative flex h-full w-full items-center justify-center rounded-full bg-violet-500">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                </div>
              </div>
            ) : feedback ? (
              <div className="rounded-md border p-4">
                <pre className="whitespace-pre-wrap text-sm">{feedback}</pre>
              </div>
            ) : (
              <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed p-4">
                <Lightbulb className="h-8 w-8 text-muted-foreground" />
                <p className="text-center text-sm text-muted-foreground">
                  {insights.length > 0
                    ? "Generate comprehensive feedback based on your notes and insights"
                    : "Analyze your interview notes first to generate feedback"}
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(feedback)} disabled={!feedback}>
                <Copy className="mr-2 h-3.5 w-3.5" />
                Copy Feedback
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: "Feedback saved",
                    description: "Your interview feedback has been saved.",
                  })
                }}
                disabled={!feedback}
              >
                <Save className="mr-2 h-3.5 w-3.5" />
                Save Feedback
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
        <p className="text-xs text-muted-foreground">Powered by AI to help you conduct better interviews</p>
        <Badge variant="outline" className="text-xs">
          Beta
        </Badge>
      </CardFooter>
    </Card>
  )
}

// Helper function to generate role-specific questions
function getQuestionsForRole(roleTitle: string): { text: string; category: string; checked: boolean }[] {
  const lowerCaseTitle = roleTitle.toLowerCase()

  // Default questions for any role
  const defaultQuestions = [
    { text: "Tell me about yourself and your background.", category: "Introduction", checked: false },
    { text: "What interests you about this role?", category: "Introduction", checked: false },
    { text: "What do you know about our company?", category: "Introduction", checked: false },
    {
      text: "Describe a challenging situation you faced at work and how you handled it.",
      category: "Behavioral",
      checked: false,
    },
    { text: "How do you handle feedback and criticism?", category: "Behavioral", checked: false },
    {
      text: "Tell me about a time you had to work with a difficult team member.",
      category: "Behavioral",
      checked: false,
    },
    {
      text: "How do you prioritize your work when you have multiple deadlines?",
      category: "Behavioral",
      checked: false,
    },
    { text: "Where do you see yourself in 5 years?", category: "Career Goals", checked: false },
    { text: "What are your salary expectations?", category: "Closing", checked: false },
    { text: "Do you have any questions for me?", category: "Closing", checked: false },
  ]

  // Role-specific questions
  let roleSpecificQuestions: { text: string; category: string; checked: boolean }[] = []

  if (lowerCaseTitle.includes("frontend") || lowerCaseTitle.includes("front-end") || lowerCaseTitle.includes("react")) {
    roleSpecificQuestions = [
      {
        text: "Can you explain the difference between controlled and uncontrolled components in React?",
        category: "Technical",
        checked: false,
      },
      { text: "How do you approach responsive design?", category: "Technical", checked: false },
      {
        text: "Explain how you would optimize a web application's performance.",
        category: "Technical",
        checked: false,
      },
      { text: "What's your experience with state management libraries?", category: "Technical", checked: false },
      { text: "How do you handle cross-browser compatibility issues?", category: "Technical", checked: false },
      { text: "Describe your experience with TypeScript.", category: "Technical", checked: false },
      { text: "How do you approach testing in frontend applications?", category: "Technical", checked: false },
    ]
  } else if (
    lowerCaseTitle.includes("backend") ||
    lowerCaseTitle.includes("back-end") ||
    lowerCaseTitle.includes("node")
  ) {
    roleSpecificQuestions = [
      { text: "Explain RESTful API design principles.", category: "Technical", checked: false },
      { text: "How do you handle database optimization?", category: "Technical", checked: false },
      { text: "Describe your experience with microservices architecture.", category: "Technical", checked: false },
      { text: "How do you approach API security?", category: "Technical", checked: false },
      { text: "Explain your experience with caching strategies.", category: "Technical", checked: false },
      { text: "How do you handle error handling in backend applications?", category: "Technical", checked: false },
      { text: "Describe your experience with containerization and deployment.", category: "Technical", checked: false },
    ]
  } else if (lowerCaseTitle.includes("design") || lowerCaseTitle.includes("ux") || lowerCaseTitle.includes("ui")) {
    roleSpecificQuestions = [
      { text: "Walk me through your design process.", category: "Technical", checked: false },
      { text: "How do you incorporate user feedback into your designs?", category: "Technical", checked: false },
      {
        text: "Describe a project where you had to balance user needs with business requirements.",
        category: "Technical",
        checked: false,
      },
      { text: "How do you approach accessibility in your designs?", category: "Technical", checked: false },
      { text: "What design tools are you proficient in?", category: "Technical", checked: false },
      {
        text: "How do you collaborate with developers to implement your designs?",
        category: "Technical",
        checked: false,
      },
      { text: "Describe your experience with design systems.", category: "Technical", checked: false },
    ]
  } else if (lowerCaseTitle.includes("product") || lowerCaseTitle.includes("manager")) {
    roleSpecificQuestions = [
      { text: "How do you prioritize features in a product roadmap?", category: "Technical", checked: false },
      { text: "Describe how you gather and incorporate user feedback.", category: "Technical", checked: false },
      { text: "How do you measure the success of a product or feature?", category: "Technical", checked: false },
      {
        text: "Tell me about a time you had to make a difficult product decision.",
        category: "Technical",
        checked: false,
      },
      {
        text: "How do you communicate product vision to different stakeholders?",
        category: "Technical",
        checked: false,
      },
      { text: "Describe your experience with agile methodologies.", category: "Technical", checked: false },
      { text: "How do you balance technical constraints with user needs?", category: "Technical", checked: false },
    ]
  } else if (lowerCaseTitle.includes("marketing")) {
    roleSpecificQuestions = [
      { text: "Describe a successful marketing campaign you've led.", category: "Technical", checked: false },
      { text: "How do you measure the ROI of marketing initiatives?", category: "Technical", checked: false },
      { text: "What marketing channels have you found most effective?", category: "Technical", checked: false },
      { text: "How do you stay updated with the latest marketing trends?", category: "Technical", checked: false },
      { text: "Describe your experience with content marketing.", category: "Technical", checked: false },
      { text: "How do you approach audience segmentation?", category: "Technical", checked: false },
      { text: "Tell me about your experience with marketing automation tools.", category: "Technical", checked: false },
    ]
  } else if (lowerCaseTitle.includes("sales")) {
    roleSpecificQuestions = [
      { text: "Describe your sales methodology.", category: "Technical", checked: false },
      { text: "How do you handle objections during the sales process?", category: "Technical", checked: false },
      { text: "Tell me about your most significant sale.", category: "Technical", checked: false },
      { text: "How do you build relationships with potential clients?", category: "Technical", checked: false },
      { text: "Describe your experience with CRM systems.", category: "Technical", checked: false },
      { text: "How do you approach sales forecasting?", category: "Technical", checked: false },
      {
        text: "Tell me about a time you lost a sale and what you learned from it.",
        category: "Technical",
        checked: false,
      },
    ]
  }

  return [...defaultQuestions, ...roleSpecificQuestions]
}
