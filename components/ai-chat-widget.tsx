"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { useEffect, useRef, useState } from "react"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
} from "lucide-react"

const SUGGESTED_QUESTIONS = [
  "What courses do you offer?",
  "How can I get started?",
  "Do you offer corporate training?",
  "Tell me about your solutions",
]

/** Extract text from a UIMessage's parts array */
function getMessageText(m: UIMessage): string {
  return m.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, setMessages, status } = useChat()

  const isLoading = status === "streaming" || status === "submitted"

  /* scroll to bottom on new messages */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  /* focus input when opening */
  useEffect(() => {
    if (isOpen) {
      setHasOpened(true)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const send = (text: string) => {
    if (!text.trim() || isLoading) return
    sendMessage({ text: text.trim() })
    setInputValue("")
  }

  const handleSuggestion = (q: string) => {
    send(q)
  }

  const resetChat = () => {
    setMessages([])
  }

  return (
    <>
      {/* ── FAB BUTTON ── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={`
          group fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center
          rounded-full shadow-lg transition-all duration-300
          ${
            isOpen
              ? "bg-muted text-muted-foreground hover:bg-muted/80"
              : "bg-primary text-primary-foreground hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          }
        `}
        aria-label={isOpen ? "Close chat" : "Chat with us"}
      >
        <MessageCircle
          className={`absolute size-6 transition-all duration-300 ${
            isOpen ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
          }`}
        />
        <X
          className={`absolute size-6 transition-all duration-300 ${
            isOpen ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
          }`}
        />

        {/* pulse ring when closed */}
        {!isOpen && !hasOpened && (
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
        )}
      </button>

      {/* ── CHAT PANEL ── */}
      <div
        className={`
          fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden
          rounded-2xl border bg-background shadow-2xl
          transition-all duration-300 origin-bottom-right
          ${
            isOpen
              ? "scale-100 opacity-100 translate-y-0"
              : "pointer-events-none scale-95 opacity-0 translate-y-4"
          }
        `}
        style={{ height: "min(520px, calc(100vh - 140px))" }}
      >
        {/* ── Header ── */}
        <div className="relative flex items-center gap-3 border-b bg-primary/5 px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold leading-none">TechForUGH AI</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ask anything about us
            </p>
          </div>
          <button
            onClick={resetChat}
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            title="Reset conversation"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>

        {/* ── Messages ── */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
        >
          {/* welcome */}
          {messages.length === 0 && (
            <div className="animate-fade-in space-y-4">
              <div className="flex gap-2.5">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="size-4 text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3 text-sm leading-relaxed">
                  Hi there! 👋 I&apos;m the TechForUGH assistant. I can tell you
                  about our courses, solutions, team, and more. How can I help?
                </div>
              </div>

              {/* suggestion chips */}
              <div className="flex flex-wrap gap-2 pl-9">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSuggestion(q)}
                    className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* message list */}
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2.5 animate-fade-in-up ${
                m.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg ${
                  m.role === "user"
                    ? "bg-foreground/10"
                    : "bg-primary/10"
                }`}
              >
                {m.role === "user" ? (
                  <User className="size-4 text-foreground/70" />
                ) : (
                  <Bot className="size-4 text-primary" />
                )}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "rounded-tr-sm bg-primary text-primary-foreground"
                    : "rounded-tl-sm bg-muted/60 text-foreground"
                }`}
              >
                {getMessageText(m)}
              </div>
            </div>
          ))}

          {/* loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 animate-fade-in">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Bot className="size-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3">
                <div className="flex gap-1">
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                  <span className="size-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Input ── */}
        <form
          id="ai-chat-form"
          onSubmit={(e) => {
            e.preventDefault()
            send(inputValue)
          }}
          className="flex items-center gap-2 border-t px-4 py-3"
        >
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="size-4" />
          </button>
        </form>
      </div>
    </>
  )
}
