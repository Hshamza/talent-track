"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getCandidate, updateCandidate } from "@/lib/storage";
import type { Candidate } from "@/lib/types";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCandidateProps {
  params: {
    id: string;
  };
}

export default function EditCandidatePage({ params }: EditCandidateProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [stage, setStage] = useState<"applied" | "screening" | "interview" | "offer" | "hired" | "rejected">("applied");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCandidate = () => {
      const candidateId = params.id;
      const data = getCandidate(candidateId);
      if (data) {
        setCandidate(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setRoleId(data.roleId);
        setStage(data.stage);
      }
    };
    loadCandidate();
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!candidate) {
      toast.error("Candidate not found");
      setIsLoading(false);
      return;
    }

    const updatedCandidate = updateCandidate(candidate.id, {
      name,
      email,
      phone,
      roleId,
      stage,
    });

    if (updatedCandidate) {
      toast.success(`Candidate ${updatedCandidate.name} updated successfully!`);
      router.push(`/dashboard/candidates/${candidate.id}`);
    } else {
      toast.error("Failed to update candidate. Please try again.");
    }

    setIsLoading(false);
  };

  if (!candidate) {
    return <div className="text-center mt-10">Loading candidate details...</div>;
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Edit Candidate</h1>
          <p className="text-sm text-muted-foreground">Update the candidate's information</p>
        </div>
        <Card>
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="123-456-7890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="roleId">Role ID</Label>
                  <Input
                    id="roleId"
                    type="text"
                    placeholder="Enter Role ID"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stage">Stage</Label>
                  <Select value={stage} onValueChange={(value) => setStage(value as typeof stage)}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "Updating Candidate..." : "Update Candidate"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
