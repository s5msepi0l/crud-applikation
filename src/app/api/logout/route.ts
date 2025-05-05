import { NextRequest, NextResponse } from "next/server";

import {sessions} from '@/app/lib/server-auth';

export async function GET(req: NextRequest) {
    //const data = await req.json();
    console.log(req.cookies.get("sessionID"));

    return NextResponse.json({status: "Success"});
}