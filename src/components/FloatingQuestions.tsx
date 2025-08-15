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

interface FloatingQuestionsProps {
  scenario: Scenario | null;
  onQuestionClick: (question: string) => void;
}

export function FloatingQuestions({
  scenario,
  onQuestionClick,
}: FloatingQuestionsProps) {
  if (
    !scenario ||
    !scenario.follow_up_questions ||
    Object.keys(scenario.follow_up_questions).length === 0
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-36 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="shadow-lg hover:shadow-xl transition-shadow duration-200 bg-background/80 backdrop-blur-sm border-2"
          >
            <Lightbulb className="mr-2 h-4 w-4 text-yellow-500" />
            <div className="text-white">Suggested Questions</div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-96 max-w-[90vw] mr-4 mb-2 shadow-xl border-2"
          side="top"
          align="end"
        >
          <div className="mb-2">
            <h3 className="font-semibold text-sm text-foreground">
              Quick Questions
            </h3>
            <p className="text-xs text-muted-foreground">
              Click any question to start the conversation
            </p>
          </div>
          <Tabs
            defaultValue={Object.keys(scenario.follow_up_questions)[0]}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 gap-1 h-auto mb-3">
              {Object.keys(scenario.follow_up_questions).map((topic) => (
                <TabsTrigger
                  key={topic}
                  value={topic}
                  className="text-xs px-2 py-1.5 text-white border-white"
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
                  className="mt-0 space-y-2 max-h-64 overflow-y-auto"
                >
                  {questions.map((question, index) => (
                    <Button
                      key={`${topic}-${index}`}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-3 text-sm whitespace-normal hover:bg-muted/50 border border-border/50 hover:border-border"
                      onClick={() => onQuestionClick(question)}
                    >
                      <div className="text-left leading-relaxed">
                        {question}
                      </div>
                    </Button>
                  ))}
                </TabsContent>
              )
            )}
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
}
