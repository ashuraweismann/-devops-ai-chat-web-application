import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessage,
  deleteConversation,
} from "../services/chatService";

function Chat() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoadingConversations(true);
      setError("");

      const response = await getConversations();

      setConversations(response.conversations);

      if (response.conversations.length > 0) {
        await openConversation(response.conversations[0]._id);
      }
    } catch (requestError) {
      console.error("Failed to load conversations:", requestError);
      setError("Failed to load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const openConversation = async (conversationId) => {
    try {
      setLoadingMessages(true);
      setError("");

      const response = await getConversationMessages(conversationId);

      setActiveConversation(response.conversation);
      setMessages(response.messages);
    } catch (requestError) {
      console.error("Failed to load messages:", requestError);
      setError("Failed to load messages");
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleNewConversation = async () => {
    try {
      setError("");

      const response = await createConversation();
      const newConversation = response.conversation;

      setConversations((previousConversations) => [
        newConversation,
        ...previousConversations,
      ]);

      setActiveConversation(newConversation);
      setMessages([]);
      setInput("");
    } catch (requestError) {
      console.error("Failed to create conversation:", requestError);
      setError("Failed to create conversation");
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const trimmedInput = input.trim();

    if (!trimmedInput || !activeConversation || sending) {
      return;
    }

    try {
      setSending(true);
      setError("");

      const response = await sendMessage(
        activeConversation._id,
        trimmedInput
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        response.userMessage,
        response.assistantMessage,
      ]);

      setInput("");

      setConversations((previousConversations) =>
        previousConversations.map((conversation) =>
          conversation._id === activeConversation._id
            ? {
                ...conversation,
                updatedAt: new Date().toISOString(),
              }
            : conversation
        )
      );
    } catch (requestError) {
      console.error("Failed to send message:", requestError);

      const message =
        requestError.response?.data?.message ||
        "Failed to generate AI response";

      setError(message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversation) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this conversation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteConversation(activeConversation._id);

      const remainingConversations = conversations.filter(
        (conversation) =>
          conversation._id !== activeConversation._id
      );

      setConversations(remainingConversations);

      if (remainingConversations.length > 0) {
        await openConversation(remainingConversations[0]._id);
      } else {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (requestError) {
      console.error("Failed to delete conversation:", requestError);
      setError("Failed to delete conversation");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (requestError) {
      console.error("Logout failed:", requestError);
      setError("Logout failed");
    }
  };

  return (
    <div className="chat-page">
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2>Conversations</h2>

          <button onClick={handleNewConversation}>
            + New
          </button>
        </div>

        <div className="conversation-list">
          {loadingConversations ? (
            <p>Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <p>No conversations yet.</p>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation._id}
                className={
                  activeConversation?._id === conversation._id
                    ? "conversation-item active"
                    : "conversation-item"
                }
                onClick={() =>
                  openConversation(conversation._id)
                }
              >
                {conversation.title}
              </button>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <p>{user?.name}</p>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="chat-main">
        <header className="chat-header">
          <div>
            <h1>
              {activeConversation?.title || "DevOps AI Chat"}
            </h1>

            <p>AI assistant workspace</p>
          </div>

          {activeConversation && (
            <button onClick={handleDeleteConversation}>
              Delete
            </button>
          )}
        </header>

        <section className="message-area">
          {loadingMessages ? (
            <p>Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="empty-chat">
              <h2>Start a conversation</h2>
              <p>
                Send a message to begin your AI chat session.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message ${message.role}`}
              >
                <strong>
                  {message.role === "user"
                    ? "You"
                    : "Assistant"}
                </strong>

                <p>{message.content}</p>
              </div>
            ))
          )}
        </section>

        {error && <p className="error-message">{error}</p>}

        <form
          className="message-form"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={
              activeConversation
                ? "Type your message..."
                : "Create a conversation first"
            }
            disabled={!activeConversation || sending}
          />

          <button
            type="submit"
            disabled={
              !activeConversation ||
              !input.trim() ||
              sending
            }
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default Chat;