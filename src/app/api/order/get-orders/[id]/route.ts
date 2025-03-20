import { connect } from "@/dbConfig/dbConfig";
import { prisma } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { subDays, subMonths, startOfYear } from "date-fns";

connect();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = params.id;
    const { searchParams } = new URL(req.url);
    const timePeriod = searchParams.get("timePeriod");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let startDate: Date | null = null;
    const today = new Date();

    if (timePeriod === "this week") {
      startDate = subDays(today, 7);
    } else if (timePeriod === "this month") {
      startDate = subMonths(today, 1);
    } else if (timePeriod === "last 3 months") {
      startDate = subMonths(today, 3);
    } else if (timePeriod === "last 6 months") {
      startDate = subMonths(today, 6);
    } else if (timePeriod === "this year") {
      startDate = startOfYear(today);
    }

    console.log("Filtering orders from:", startDate);

    const orders = await prisma.order.findMany({
      where: {
        user_id: userId,
        createdAt: startDate ? { gte: startDate.toISOString() } : undefined,
      },
      include: {
        items: true, 
      },
    });

    console.log("Fetched orders:", orders);

    return NextResponse.json(orders); 
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
