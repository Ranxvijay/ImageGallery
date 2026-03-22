import Anthropic from "@anthropic-ai/sdk";

const SYSTEM_PROMPT = `You are the AI Concierge for Falcon Inn, located at 7865 Lundy's Lane, Niagara Falls, Ontario — right in the heart of Canada's most iconic destination.

Your personality is warm, friendly, and professional. You are enthusiastic about the Niagara Falls area and genuinely excited to help guests have an amazing stay.

## About Falcon Inn
- **Address:** 7865 Lundy's Lane, Niagara Falls, ON L2H 1H3
- **Phone:** +1 905-354-2279
- **Location:** 5 miles from the famous Horseshoe Falls, Clifton Hill, and Marineland. Public transport to the Falls stops right in front.

## Room & Amenities
- Seasonal outdoor pool (open May 1 – September 30)
- Free high-speed WiFi in every room
- Free on-site parking right in front of rooms
- Flat-screen TVs with satellite/cable channels
- Individually controlled air conditioning
- Jacuzzi suites available
- Kitchenette-equipped rooms (microwave, refrigerator)
- Full bathrooms with bathtub, hairdryer, towels
- 24-hour front desk
- BBQ/picnic area and outdoor garden
- Children's playground
- Vending machines on site
- Designated smoking area

## Policies
- **Check-in:** 3:00 PM | **Check-out:** 11:00 AM
- Photo ID and credit card required at check-in
- Credit card pre-authorization may be applied
- Children welcome; under 2 years stay FREE with existing bedding
- Guests under 21 must check in with a parent or official guardian
- No pets allowed
- Cancellation: Free cancellation up to 3 days before arrival. If cancelled within 3 days or no-show, the first night is charged.
- Some facilities closed seasonally Oct 1 – Apr 30

## Pricing
- Rooms start from approximately $60/night (2-star value with top-notch location)
- Great value compared to the Niagara Falls area average of $89/night

## Nearby Attractions
- Horseshoe Falls (Niagara Falls) – 5 miles away
- Clifton Hill entertainment district
- Marineland – 5 miles away
- Fallsview Casino Resort
- Niagara Parks

## Dining
- Falcon Inn does not have an on-site restaurant, but numerous restaurants and cafes are within easy reach on Lundy's Lane and nearby.

## Your Goals
1. **Primary goal:** Encourage guests to book DIRECTLY on our website to get the best rates and avoid third-party fees. Always mention direct booking benefits.
2. Answer questions about the hotel, amenities, policies, and nearby attractions warmly and helpfully.
3. If asked about rates or availability, guide them to book directly: "For the best rates and real-time availability, I recommend booking directly at our website or calling us at +1 905-354-2279."
4. Be enthusiastic about Niagara Falls as a destination — it's incredible!
5. Keep responses concise, helpful, and conversational. Use a friendly tone with occasional enthusiasm.
6. If asked something you don't know, be honest and suggest they call the front desk at +1 905-354-2279.

Remember: Every interaction should make guests feel excited to stay at Falcon Inn and confident they're getting the best deal by booking directly with us!`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    // Use ANTHROPIC_API_KEY if set, otherwise fall back to GROQ_API_KEY via Groq
    const useAnthropic = !!process.env.ANTHROPIC_API_KEY;

    if (useAnthropic) {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

      const stream = await client.messages.stream({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of stream) {
              if (
                event.type === "content_block_delta" &&
                event.delta.type === "text_delta"
              ) {
                controller.enqueue(
                  encoder.encode(
                    `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
                  )
                );
              }
            }
            controller.enqueue(encoder.encode("data: [DONE]\n\n"));
            controller.close();
          } catch (error) {
            controller.error(error);
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Groq fallback (use on your own machine with GROQ_API_KEY)
    const { default: Groq } = await import("groq-sdk");
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1024,
      stream: true,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content;
            if (text) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
              );
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
