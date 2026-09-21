import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
  createConversation,
  getConversations,
  getConversationMessages,
  sendMessage,
  deleteConversation,
} from "../controllers/chatController.js";

const router = express.Router();

// All chat routes require authentication
router.use(protect);

// Conversation endpoints
router.post("/conversations", createConversation);

router.get("/conversations", getConversations);

router.get(
  "/conversations/:conversationId/messages",
  getConversationMessages
);

router.post(
  "/conversations/:conversationId/messages",
  sendMessage
);

router.delete(
  "/conversations/:conversationId",
  deleteConversation
);

export default router;