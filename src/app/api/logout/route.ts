import { NextRequest, NextResponse } from "next/server";

import { db } from '@/app/lib/server-auth';

export async function POST(req: NextRequest) {
    console.log(req.cookies.get("sessionID"));

    return NextResponse.json({status: "Success"});
}