import { GoogleGenerativeAI } from "@google/generative-ai";
import User from "../models/UserModel.js";
import Profile from "../models/ProfileModel.js";
import HRPolicy from "../models/HRPolicyModel.js";
import {
  getUserLeaveBalance,
  getUserAttendanceSummary,
  getUserPayrollInfo,
  getCompanyHRPolicies,
  getUserProfileInfo,
  getApplicationInfo,
  searchHRPolicy,
} from "../utils/hrTools.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Custom system prompt for the HR Assistant
const HR_ASSISTANT_SYSTEM_PROMPT = `You are an expert HR Assistant for IMPLOYEE, an employee management system. Your role is to help employees with HR-related queries, company policies, payroll information, attendance records, and application-related questions.

**Key Responsibilities:**
1. Answer questions about leave policies, balances, and application procedures
2. Provide attendance statistics and records
3. Explain salary structures, deductions, and payroll information
4. Share company HR policies and guidelines
5. Help with general HR queries and employee benefits
6. Explain how to use IMPLOYEE platform features

**Important Guidelines:**
- Always be professional and helpful
- Provide accurate information from the tools you have access to
- When a user asks about their personal data (leaves, attendance, salary), use the appropriate tool to fetch actual data
- For policy questions, search through available policies
- If you don't have access to information, politely explain and suggest contacting HR at hr@imployee.com
- Format responses clearly with bullet points where appropriate
- Use emojis occasionally to make responses friendly and engaging
- Be precise with numbers and dates
- Always clarify that for critical decisions, they should consult official HR documentation

**Available Tools:**
You have access to tools that can fetch:
- User's leave balance and history
- User's attendance summary and records
- User's payroll information and deductions
- Company HR policies and guidelines
- User's profile information
- Application information and features
- Search through HR policies by topic

**Tone:**
- Professional yet friendly
- Helpful and empathetic
- Clear and concise
- Respectful of privacy`;

/**
 * Chat with HR Assistant powered by Gemini AI
 */
export const chatWithHRAssistant = async (req, res) => {
  try {
    const { message, userId, conversationHistory } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key not configured",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // Build tool definitions for Gemini - correct format for generateContent
    const toolDefinitions = [
      {
        name: "get_leave_balance",
        description: "Get the user's current leave balance including casual, sick, and earned leaves",
        parameters: {
          type: "object",
          properties: {
            employeeId: {
              type: "string",
              description: "The employee ID",
            },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "get_attendance_summary",
        description: "Get the user's attendance statistics for current month and year-to-date",
        parameters: {
          type: "object",
          properties: {
            employeeId: {
              type: "string",
              description: "The employee ID",
            },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "get_payroll_info",
        description: "Get the user's salary, payroll deductions, and earning information",
        parameters: {
          type: "object",
          properties: {
            employeeId: {
              type: "string",
              description: "The employee ID",
            },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "get_hr_policies",
        description: "Get the company HR policies including leave, benefits, working hours, and salary information",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "get_profile_info",
        description: "Get the user's profile information including personal and professional details",
        parameters: {
          type: "object",
          properties: {
            employeeId: {
              type: "string",
              description: "The employee ID",
            },
          },
          required: ["employeeId"],
        },
      },
      {
        name: "get_application_info",
        description: "Get information about IMPLOYEE application, its features, and support information",
        parameters: {
          type: "object",
          properties: {},
          required: [],
        },
      },
      {
        name: "search_policy",
        description: "Search through HR policies based on a topic or keyword",
        parameters: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "The topic to search for (e.g., 'leave', 'salary', 'benefits')",
            },
          },
          required: ["topic"],
        },
      },
    ];

    // Initialize Gemini model with tools using generateContent API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: HR_ASSISTANT_SYSTEM_PROMPT,
    });

    let fullResponse = "";
    let toolResults = {};
    
    // Fetch user to get employeeId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    const employeeId = user.employeeId;
    
    // Build contents with conversation history
    const contents = conversationHistory && conversationHistory.length > 0
      ? [...conversationHistory, { role: "user", parts: [{ text: message }] }]
      : [{ role: "user", parts: [{ text: message }] }];

    // First turn: Send user message with full context and tools
    const firstRequest = await model.generateContent({
      contents: contents,
      tools: [{ functionDeclarations: toolDefinitions }],
    });

    const firstResponse = firstRequest.response;
    const firstCandidate = firstResponse.candidates[0];
    
    // Prepare history for next turn
    const updatedHistory = [...contents, { role: "model", parts: firstCandidate.content.parts }];

    // Check if model made function calls
    const toolCalls = firstResponse.functionCalls();

    if (toolCalls && toolCalls.length > 0) {
      // Execute each tool
      const toolResultParts = [];

      for (const toolCall of toolCalls) {
        try {
          const toolName = toolCall.name;
          const toolArgs = toolCall.args || {};

          console.log(`Executing tool: ${toolName}`, toolArgs);

          let toolResult;
          switch (toolName) {
            case "get_leave_balance":
              toolResult = await getUserLeaveBalance(toolArgs.employeeId || employeeId);
              break;
            case "get_attendance_summary":
              toolResult = await getUserAttendanceSummary(toolArgs.employeeId || employeeId);
              break;
            case "get_payroll_info":
              toolResult = await getUserPayrollInfo(toolArgs.employeeId || employeeId);
              break;
            case "get_hr_policies":
              toolResult = await getCompanyHRPolicies();
              break;
            case "get_profile_info":
              toolResult = await getUserProfileInfo(toolArgs.employeeId || employeeId);
              break;
            case "get_application_info":
              toolResult = await getApplicationInfo();
              break;
            case "search_policy":
              toolResult = await searchHRPolicy(toolArgs.topic);
              break;
            default:
              toolResult = { error: `Unknown tool: ${toolName}` };
          }

          toolResults[toolName] = toolResult;

          // Add tool result to parts
          toolResultParts.push({
            functionResponse: {
              name: toolName,
              response: toolResult,
            },
          });
        } catch (error) {
          console.error(`Error executing tool ${toolCall.name}:`, error);
          toolResults[toolCall.name] = { error: error.message };
          toolResultParts.push({
            functionResponse: {
              name: toolCall.name,
              response: { error: error.message },
            },
          });
        }
      }

      // Second turn: Send tool results back to Gemini with full context
      const secondRequest = await model.generateContent({
        contents: [...updatedHistory, { role: "user", parts: toolResultParts }],
        tools: [{ functionDeclarations: toolDefinitions }],
      });

      const secondResponse = secondRequest.response;
      fullResponse = secondResponse.text() || "I'm unable to process your request at the moment. Please try again.";
    } else {
      // No tool calls, just get text response
      fullResponse = firstResponse.text() || "I'm unable to process your request at the moment. Please try again.";
    }

    // Return response
    res.json({
      success: true,
      response: fullResponse,
      toolsUsed: Object.keys(toolResults),
      data: toolResults,
    });
  } catch (error) {
    console.error("HR Assistant Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process request",
      error: error.message,
    });
  }
};

// Upload HR Policy
export const uploadPolicy = async (req, res) => {
  try {
    const { policyText, companyId } = req.body;

    await HRPolicy.findOneAndUpdate(
      { companyId: companyId || "default" },
      { policyText, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: "HR Policy updated successfully"
    });
  } catch (error) {
    console.error("Policy upload error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload policy"
    });
  }
};

// Get HR Policy
export const getPolicy = async (req, res) => {
  try {
    const policy = await HRPolicy.findOne({ companyId: "default" });
    
    res.json({
      success: true,
      policy: policy || { policyText: "No policies uploaded yet." }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch policy"
    });
  }
};