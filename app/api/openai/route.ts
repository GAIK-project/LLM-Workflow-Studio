import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

interface Message {
  role: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const {
      apiKey,
      model,
      messages,
      temperature = 0.7,
      format = "text",
    } = (await request.json()) as {
      apiKey: string;
      model?: string;
      messages: Message[];
      temperature?: number;
      format?: string;
    };

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 },
      );
    }

    const systemMessage =
      messages.find((msg) => msg.role === "system")?.content || "";
    const userMessage =
      messages.find((msg) => msg.role === "user")?.content || "";

    if (!userMessage) {
      return NextResponse.json(
        { error: "User message is required" },
        { status: 400 },
      );
    }

    const prompt = systemMessage
      ? `${systemMessage}\n\nUser: ${userMessage}`
      : userMessage;
    const modelString = model || "gpt-4o-mini";

    let response;

    if (format === "json") {
      const result = await generateObject({
        model: openai(modelString),
        prompt,
        temperature,
        output: "no-schema",
      });

      response = {
        choices: [
          {
            message: {
              role: "assistant",
              content: JSON.stringify(result.object, null, 2),
            },
          },
        ],
      };
    } else {
      const result = await generateText({
        model: openai(modelString),
        prompt,
        temperature,
      });

      response = {
        choices: [
          {
            message: {
              role: "assistant",
              content: result.text,
            },
          },
        ],
      };
    }

    return NextResponse.json(response);
  } catch (error: unknown) {
    console.error("AI SDK error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to call AI service";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
