import { NextRequest, NextResponse } from "next/server";

import { getUserId, MedicationHandler } from "@/app/lib/server-auth";

export async function POST(req: NextRequest) {
    // validate session first then get profile
    if (req.cookies.has("sessionID")) {

        let sessionID = String(req.cookies.get("sessionID")?.value);
        let userID = await getUserId(sessionID);

        if (userID) { //session is valid get profile 
            let profile = MedicationHandler.profile(userID);
            return NextResponse.json({Status: "Allowed", data: JSON.stringify((await profile).medications)})
        }
    }
    return NextResponse.json({status: "Unathorized"});
}