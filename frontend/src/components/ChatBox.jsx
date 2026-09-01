import { useState } from "react";

export default function ChatBox({ messages, onAsk, asking }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    onAsk(question.trim());
    setQuestion("");
  }

  return (
    <div className="chat-box">
      <div className="chat-messages">
        {messages.length === 0 && (
          <p className="chat-empty">Ask a question about your project — materials, alternatives, how-to steps, anything.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`chat-message chat-${m.role}`}>
            <span className="chat-role">{m.role === "user" ? "You" : "Coach"}</span>
            <p>{m.content}</p>
          </div>
        ))}
        {asking && (
          <div className="chat-message chat-assistant">
            <span className="chat-role">Coach</span>
            <p className="chat-thinking">Thinking…</p>
          </div>
        )}
      </div>
      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask a question about this project..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={asking}
        />
        <button type="submit" disabled={asking || !question.trim()}>
          Ask
        </button>
      </form>
    </div>
  );
}
