import { createOrder } from "@/services/order.service";
import { orderSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = orderSchema.parse(await request.json());
    const order = createOrder(payload);
    return Response.json({ orderId: order.id, reference: order.reference }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === "ZodError") {
      return Response.json({ error: "Please check your details and try again." }, { status: 400 });
    }
    console.error("Order creation failed", error);
    return Response.json({ error: "We couldn’t place that order. Please try again." }, { status: 500 });
  }
}
