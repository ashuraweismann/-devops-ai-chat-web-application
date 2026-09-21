import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { generateAIResponse } from "../services/aiService.js";

// Create a new conversation
export const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({
      user: req.user._id,
      title: "New conversation",
    });

    return res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error("Create conversation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create conversation",
    });
  }
};

// Get all conversations belonging to the authenticated user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      user: req.user._id,
    }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("Get conversations error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve conversations",
    });
  }
};

// Get one conversation and its messages
export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const messages = await Message.find({
      conversation: conversation._id,
    }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    console.error(
      "Get conversation messages error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve messages",
    });
  }
};

// Add a user message to a conversation
// Save a user message and generate an AI response
export const sendMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const userMessage = await Message.create({
      conversation: conversation._id,
      role: "user",
      content: content.trim(),
    });

    const conversationMessages = await Message.find({
      conversation: conversation._id,
    })
      .sort({
        createdAt: 1,
      })
      .limit(20);

    const aiMessages = conversationMessages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    const assistantContent = await generateAIResponse(aiMessages);

    const assistantMessage = await Message.create({
      conversation: conversation._id,
      role: "assistant",
      content: assistantContent,
    });

    conversation.updatedAt = new Date();

    await conversation.save();

    return res.status(201).json({
      success: true,
      userMessage,
      assistantMessage,
    });
  } catch (error) {
    console.error("Send message error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI response",
    });
  }
};

// Delete a conversation and its messages
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    await Message.deleteMany({
      conversation: conversation._id,
    });

    await Conversation.deleteOne({
      _id: conversation._id,
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("Delete conversation error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
    });
  }
};