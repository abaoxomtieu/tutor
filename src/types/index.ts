export interface Scenario {
  id: string;
  scenario_title: string;
  scenario_description: string;
  scenario_context: string;
  your_role: string;
  key_vocabulary: string[];
  topics_covered: string[];
  follow_up_questions: {
    [topic: string]: string[];
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatState {
  messages: Message[];
  currentScenario: Scenario | null;
  isLoading: boolean;
}

export interface ApiResponse {
  content: string;
}
