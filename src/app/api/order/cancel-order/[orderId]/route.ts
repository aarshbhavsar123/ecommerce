import { prisma } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const urlParts = req.nextUrl.pathname.split("/");
    const orderId = urlParts[urlParts.length - 1];
    const order = await prisma.order.findUnique({
      where: { order_id: orderId },
    });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    await prisma.orderItem.deleteMany({
      where: { order_id: orderId },
    });
    await prisma.order.delete({
      where: { order_id: orderId },
    });

    return NextResponse.json({ message: "Order canceled successfully" });
  } catch (error: any) {
    console.error("Error canceling order:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}