"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Scenario } from '@/types';

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario | null;
  onScenarioSelect: (scenario: Scenario) => void;
  onScenarioUpdate: (scenario: Scenario) => void;
}

export function ScenarioSelector({ 
  scenarios, 
  selectedScenario, 
  onScenarioSelect, 
  onScenarioUpdate 
}: ScenarioSelectorProps) {
  const handleFieldChange = (field: keyof Scenario, value: string | string[]) => {
    if (!selectedScenario) return;
    
    const updatedScenario = { ...selectedScenario, [field]: value };
    onScenarioUpdate(updatedScenario);
  };

  const handleVocabularyChange = (value: string) => {
    const vocabularyArray = value.split('\n').filter(item => item.trim());
    handleFieldChange('key_vocabulary', vocabularyArray);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>🎭 Scenario Configuration</CardTitle>
        <CardDescription>Choose and customize your role-playing scenario</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scenario-select">Choose a scenario</Label>
          <Select 
            value={selectedScenario?.id || ""} 
            onValueChange={(id) => {
              const scenario = scenarios.find(s => s.id === id);
              if (scenario) onScenarioSelect(scenario);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a scenario" />
            </SelectTrigger>
            <SelectContent>
              {scenarios.map((scenario) => (
                <SelectItem key={scenario.id} value={scenario.id}>
                  {scenario.scenario_title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedScenario && (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedScenario.scenario_title}
                onChange={(e) => handleFieldChange('scenario_title', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedScenario.scenario_description}
                onChange={(e) => handleFieldChange('scenario_description', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="context">Context</Label>
              <Input
                id="context"
                value={selectedScenario.scenario_context}
                onChange={(e) => handleFieldChange('scenario_context', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input
                id="role"
                value={selectedScenario.your_role}
                onChange={(e) => handleFieldChange('your_role', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vocabulary">Key Vocabulary (one per line)</Label>
              <Textarea
                id="vocabulary"
                value={selectedScenario.key_vocabulary.join('\n')}
                onChange={(e) => handleVocabularyChange(e.target.value)}
                rows={6}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
