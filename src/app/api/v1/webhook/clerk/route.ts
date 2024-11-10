import { NextRequest, NextResponse } from "next/server";

async function POST(req: NextRequest) {
  try {
  } catch (error) {
    return NextResponse.json(
      {
        msg: "Todo found successfully",
      },
      { status: 200 }
    );
  }
}
