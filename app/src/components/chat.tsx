"use client";

import { FormEvent, useState } from "react";
import { PromptLibrary } from "@/components/prompt-library";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const starters = [
  "Turn my rough idea into a simple product plan",
  "Help me choose what to build this week",
  "Find the riskiest assumption in my project",
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendMessage(event?: FormEvent, preset?: string) {
    event?.preventDefault();
    const content = (preset ?? draft).trim();
    if (!content || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft("");
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages.map(({ role, content: text }) => ({ role, content: text })) }),
      });

      if (!response.ok || !response.body) {
        throw new Error("The assistant is unavailable right now.");
      }

      const assistantId = crypto.randomUUID();
      setMessages((current) => [...current, { id: assistantId, role: "assistant", content: "" }]);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId ? { ...message, content: assistantText } : message,
          ),
        );
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong.");
      setMessages((current) => current.filter((message) => message.role !== "assistant" || message.content));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="chat-shell" aria-label="Chat with Compass">
      <div className="conversation" aria-live="polite">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="compass-mark" aria-hidden="true">✦</div>
            <p className="eyebrow">Start anywhere</p>
            <h2>What are you trying to make clearer?</h2>
            <p className="empty-copy">Compass helps you move from a vague idea to a useful next step.</p>
            <div className="starter-list">
              {starters.map((starter) => (
                <button key={starter} type="button" className="starter" onClick={() => sendMessage(undefined, starter)}>
                  {starter}<span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <PromptLibrary onSelect={setDraft} />
          </div>
        ) : (
          <div className="message-list">
            {messages.map((message) => (
              <article key={message.id} className={`message ${message.role}`}>
                <span className="message-label">{message.role === "user" ? "You" : "Compass"}</span>
                <p>{message.content || "Thinking…"}</p>
              </article>
            ))}
          </div>
        )}
      </div>

      <form className="composer" onSubmit={sendMessage}>
        <label htmlFor="message" className="sr-only">Message Compass</label>
        <textarea
          id="message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask Compass anything…"
          rows={1}
          disabled={isLoading}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage();
            }
          }}
        />
        <button className="send-button" type="submit" disabled={!draft.trim() || isLoading} aria-label="Send message">
          {isLoading ? "…" : "Send"}
        </button>
      </form>
      {error && <p className="error-message" role="alert">{error}</p>}
      <p className="composer-note">Compass can make mistakes. Use it to think, then verify.</p>
    </section>
  );
}
