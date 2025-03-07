import { connect } from "@/dbConfig/dbConfig";
import { prisma } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    const orderId = params.orderId;
    
    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }
    
    try {
      const order = await prisma.order.findUnique({
        where: { order_id: orderId },
        include: { items: true },
      });
      
      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }
      
      return NextResponse.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      return NextResponse.json({ error: "Error fetching order details" }, { status: 500 });
    }
    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}