"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { Scenario } from "@/types";

interface ScenarioDisplayProps {
  scenario: Scenario;
  onQuestionClick: (question: string) => void;
}

export function ScenarioDisplay({
  scenario,
  onQuestionClick,
}: ScenarioDisplayProps) {
  const [isVocabOpen, setIsVocabOpen] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Key Vocabulary */}
      {scenario.key_vocabulary && scenario.key_vocabulary.length > 0 && (
        <Collapsible open={isVocabOpen} onOpenChange={setIsVocabOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50">
                <CardTitle className="flex items-center gap-2">
                  {isVocabOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <BookOpen className="h-4 w-4" />
                  📚 Key Vocabulary
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {scenario.key_vocabulary.map((vocab, index) => (
                    <div key={index} className="p-2 bg-muted rounded-md">
                      <span className="font-medium text-foreground">• {vocab}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Follow-up Questions */}
      {scenario.follow_up_questions &&
        Object.keys(scenario.follow_up_questions).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>📝 Suggested Questions (Click to Send)</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue={Object.keys(scenario.follow_up_questions)[0]}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {Object.keys(scenario.follow_up_questions).map((topic) => (
                    <TabsTrigger key={topic} value={topic} className="text-xs">
                      {topic.length > 12
                        ? `${topic.substring(0, 10)}...`
                        : topic}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {Object.entries(scenario.follow_up_questions).map(
                  ([topic, questions]) => (
                    <TabsContent
                      key={topic}
                      value={topic}
                      className="space-y-2"
                    >
                      <h3 className="font-semibold text-lg mb-3">
                        {topic} Questions:
                      </h3>
                      {questions.map((question, index) => (
                        <Button
                          key={`${topic}-${index}`}
                          variant="outline"
                          className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                          onClick={() => onQuestionClick(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </TabsContent>
                  )
                )}
              </Tabs>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
