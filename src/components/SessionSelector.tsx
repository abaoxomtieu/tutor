"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MessageSquare, Trash2 } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  created_at: string;
  last_message?: string;
  message_count: number;
}

interface SessionSelectorProps {
  sessions: Session[];
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onCreateSession: (name: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export function SessionSelector({
  sessions,
  currentSessionId,
  onSessionSelect,
  onCreateSession,
  onDeleteSession,
}: SessionSelectorProps) {
  const [newSessionName, setNewSessionName] = React.useState('');
  const [isCreating, setIsCreating] = React.useState(false);

  const handleCreateSession = () => {
    if (newSessionName.trim()) {
      onCreateSession(newSessionName.trim());
      setNewSessionName('');
      setIsCreating(false);
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length > 1) {
      onDeleteSession(sessionId);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Chat Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Create new session */}
        <div className="space-y-2">
          {isCreating ? (
            <div className="flex gap-2">
              <Input
                value={newSessionName}
                onChange={(e) => setNewSessionName(e.target.value)}
                placeholder="Session name..."
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleCreateSession()}
                autoFocus
              />
              <Button onClick={handleCreateSession} size="sm" disabled={!newSessionName.trim()}>
                Add
              </Button>
              <Button 
                onClick={() => {
                  setIsCreating(false);
                  setNewSessionName('');
                }} 
                size="sm" 
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsCreating(true)}
              className="w-full"
              variant="outline"
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Session
            </Button>
          )}
        </div>

        {/* Sessions list */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSessionSelect(session.id)}
              className={`
                p-3 rounded-lg border cursor-pointer transition-colors relative group
                ${currentSessionId === session.id 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:bg-muted/50'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{session.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                  {session.last_message && (
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {session.last_message}
                    </p>
                  )}
                </div>
                {sessions.length > 1 && (
                  <Button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              {session.message_count > 0 && (
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span>{session.message_count} messages</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            No sessions yet. Create your first session above.
          </div>
        )}
      </CardContent>
    </Card>
  );
}