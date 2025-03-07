import { connect } from "@/dbConfig/dbConfig";
import { prisma } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    // console.log(userId);
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    else
    {
        try {
            const orders = await prisma.order.findMany({
              where: { user_id: userId },
              include: { items: true }, 
            });
        
            if (orders.length === 0) {
              
              return NextResponse.json({message:"No orders found for this user"})
            }
        
            
            
            return NextResponse.json(orders);
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
    }
    return NextResponse.json({message:"Success"});

  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
