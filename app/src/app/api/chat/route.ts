import { compassAgent } from "@/mastra/agents/compass";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: ChatMessage[] };
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "At least one message is required." }, { status: 400 });
    }

    const validMessages = messages.filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0,
    );

    if (validMessages.length === 0) {
      return Response.json({ error: "Messages must include text." }, { status: 400 });
    }

    const result = await compassAgent.stream(
      validMessages as Parameters<typeof compassAgent.stream>[0],
    );
    const encodedStream = new ReadableStream<Uint8Array>({
      start(controller) {
        void (async () => {
          try {
            const textStream = result.textStream as unknown as AsyncIterable<string>;
            for await (const chunk of textStream) {
              controller.enqueue(new TextEncoder().encode(chunk));
            }
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        })();
      },
    });

    return new Response(encodedStream as unknown as BodyInit, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Compass chat request failed", error);
    return Response.json(
      { error: "Compass could not respond. Check your model provider configuration." },
      { status: 500 },
    );
  }
}
