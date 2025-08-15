"use client";

import React, { useState, useEffect } from "react";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { SessionSelector } from "@/components/SessionSelector";
import { Chat } from "@/components/Chat";
import { FloatingQuestions } from "@/components/FloatingQuestions";
import {
  fetchScenarios,
  sendMessage,
  getMessages,
  getSessions,
  createSession,
  deleteSession,
  generateUUID,
} from "@/lib/api/client";
import { Scenario, Message } from "@/types";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

interface Session {
  id: string;
  name: string;
  created_at: string;
  lastMessage?: string;
  message_count: number;
}

export default function Home() {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null
  );
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  // Session management
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");

  // Scenario collapse state
  // const [isScenarioCollapsed, setIsScenarioCollapsed] = useState(false);

  // Initialize with sessions from backend
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const backendSessions = await getSessions();
        if (backendSessions.length === 0) {
          // Create a default session if none exist
          const defaultSession = await createSession("New Conversation");
          setSessions([defaultSession]);
          setCurrentSessionId(defaultSession.id);
        } else {
          setSessions(backendSessions);
          setCurrentSessionId(backendSessions[0].id);
        }
      } catch (err) {
        console.error("Error loading sessions:", err);
        // Create a fallback session with UUID
        const fallbackSessionId = generateUUID();
        const fallbackSession: Session = {
          id: fallbackSessionId,
          name: "New Conversation",
          created_at: new Date().toISOString(),
          message_count: 0,
        };
        setSessions([fallbackSession]);
        setCurrentSessionId(fallbackSessionId);
      }
    };

    loadSessions();
  }, []);

  // Load scenarios on mount
  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await fetchScenarios();
        setScenarios(data);
      } catch (err) {
        setError("Could not load scenarios: " + (err as Error).message);
      }
    };

    loadScenarios();
  }, []);

  // Update current scenario when selected scenario changes
  useEffect(() => {
    setCurrentScenario(selectedScenario);
  }, [selectedScenario]);

  const handleSendMessage = async (message: string) => {
    if (!currentScenario) {
      setError("Please select a scenario before starting the chat.");
      return;
    }
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(
        message,
        currentSessionId,
        currentScenario
      );

      // Add assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content: response,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Update session with last message
      setSessions((prev) =>
        prev.map((session) =>
          session.id === currentSessionId
            ? { ...session, lastMessage: message }
            : session
        )
      );
    } catch (err) {
      const errorMessage: Message = {
        role: "assistant",
        content: "Error: " + (err as Error).message,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question);
  };

  // Session management functions
  const handleCreateSession = async (sessionName: string) => {
    try {
      const newSession = await createSession(sessionName);
      setSessions((prev) => [...prev, newSession]);
      setCurrentSessionId(newSession.id);
      setMessages([]); // Clear messages for new session
    } catch (err) {
      console.error("Error creating session:", err);
      // Fallback to local creation
      const newSessionId = generateUUID();
      const newSession: Session = {
        id: newSessionId,
        name: sessionName,
        created_at: new Date().toISOString(),
        message_count: 0,
      };
      setSessions((prev) => [...prev, newSession]);
      setCurrentSessionId(newSessionId);
      setMessages([]);
      setError("Could not create session on server: " + (err as Error).message);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    if (sessionId === currentSessionId) return;

    setCurrentSessionId(sessionId);
    setIsLoading(true);

    try {
      // Load messages for selected session
      const sessionMessages = await getMessages(sessionId);
      setMessages(sessionMessages);
    } catch (err) {
      console.error("Error loading messages:", err);
      setMessages([]);
      setError("Could not load session messages: " + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (sessions.length <= 1) return; // Don't delete the last session

    try {
      await deleteSession(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));

      if (sessionId === currentSessionId) {
        // Switch to another session
        const remainingSessions = sessions.filter(
          (session) => session.id !== sessionId
        );
        const nextSession = remainingSessions[0];
        setCurrentSessionId(nextSession.id);
        await handleSelectSession(nextSession.id);
      }
    } catch (err) {
      console.error("Error deleting session:", err);
      setError("Could not delete session: " + (err as Error).message);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    // Update session to remove last message
    setSessions((prev) =>
      prev.map((session) =>
        session.id === currentSessionId
          ? { ...session, lastMessage: undefined }
          : session
      )
    );
  };

  const handleScenarioUpdate = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setCurrentScenario(scenario);
  };

  const SidebarContent = () => (
    <>
      <h1 className="text-2xl font-bold text-center">Settings</h1>
      <Separator />

      {/* Session Management */}
      <SessionSelector
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateSession={handleCreateSession}
        onSessionSelect={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />

      <Separator />

      {/* Scenario Selection */}
      <ScenarioSelector
        scenarios={scenarios}
        selectedScenario={selectedScenario}
        onScenarioSelect={setSelectedScenario}
        onScenarioUpdate={setSelectedScenario}
      />
    </>
  );

  if (!isDesktop) {
    return (
      <div className="flex flex-col h-screen bg-black">
        <header className="flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-lg font-bold text-white">Role-Play Chat</h1>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <PanelLeft className="h-5 w-5 text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-3/4 flex flex-col space-y-4 p-4 overflow-y-auto"
            >
              <SheetHeader>
                <SheetTitle>Settings</SheetTitle>
              </SheetHeader>
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          {error && (
            <div className="p-4 bg-red-100 border-b border-red-300 text-red-700">
              {error}
            </div>
          )}

          <div className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            {/* Chat Component */}
            <div className="flex-1 flex flex-col min-h-0">
              <Chat
                messages={messages}
                onSendMessage={handleSendMessage}
                onClearChat={handleClearChat}
                isLoading={isLoading}
              />
            </div>
          </div>
        </main>

        {/* Floating Questions - positioned at bottom right */}
        <FloatingQuestions
          scenario={currentScenario}
          onQuestionClick={handleQuestionClick}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black text-foreground">
      {/* Sidebar */}
      <div className="w-1/4 flex flex-col space-y-4 p-4 border-r border-border overflow-y-auto bg-black">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
        {error && (
          <div className="p-4 bg-red-100 border-b border-red-300 text-red-700">
            {error}
          </div>
        )}

        <div className="flex-1 flex flex-col p-6 overflow-y-hidden">
          {/* Chat Component */}
          <div className="flex-1 flex flex-col h-full">
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              onClearChat={handleClearChat}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Floating Questions - positioned at bottom right */}
      <FloatingQuestions
        scenario={currentScenario}
        onQuestionClick={handleQuestionClick}
      />
    </div>
  );
}
