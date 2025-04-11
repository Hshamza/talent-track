"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Skill } from "@/lib/types";

interface SkillGraphProps {
  skills: Skill[];
}

export function SkillGraph({ skills }: SkillGraphProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent>
        {skills && skills.length > 0 ? (
          <ul>
            {skills.map((skill, index) => (
              <li key={index}>
                {skill.name} ({skill.proficiency})
              </li>
            ))}
          </ul>
        ) : (
          <p>No skills found.</p>
        )}
      </CardContent>
    </Card>
  );
}
