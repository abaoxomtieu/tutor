"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Lightbulb } from "lucide-react";
import { Scenario } from "@/types";

interface ScenarioDisplayProps {
  scenario: Scenario;
  onQuestionClick: (question: string) => void;
}

export function ScenarioDisplay({
  scenario,
  onQuestionClick,
}: ScenarioDisplayProps) {
  if (
    !scenario.follow_up_questions ||
    Object.keys(scenario.follow_up_questions).length === 0
  ) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Lightbulb className="mr-2 h-4 w-4 text-white" />
          <div className="text-white"> Suggested Questions</div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-w-md">
        <Tabs
          defaultValue={Object.keys(scenario.follow_up_questions)[0]}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1 h-auto">
            {Object.keys(scenario.follow_up_questions).map((topic) => (
              <TabsTrigger
                key={topic}
                value={topic}
                className="text-xs px-2 py-1.5"
              >
                {topic}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.entries(scenario.follow_up_questions).map(
            ([topic, questions]) => (
              <TabsContent
                key={topic}
                value={topic}
                className="mt-2 space-y-2 max-h-60 overflow-y-auto"
              >
                {questions.map((question, index) => (
                  <Button
                    key={`${topic}-${index}`}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-2 text-xs whitespace-normal text-white"
                    onClick={() => onQuestionClick(question)}
                  >
                    {question}
                  </Button>
                ))}
              </TabsContent>
            )
          )}
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
