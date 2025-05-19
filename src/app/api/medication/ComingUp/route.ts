import { NextRequest, NextResponse } from "next/server";

import { getUserId, MedicationHandler } from "@/app/lib/server-auth";

export async function POST(req: NextRequest) {
    const data = await req.json();
console.log("here");
    // validate session first then get profile
    if (req.cookies.has("sessionID")) {
        let sessionID = String(req.cookies.get("sessionID")?.value);
        let userID = await getUserId(sessionID);

        if (userID) { //session is valid get profile
            let profile = await MedicationHandler.profile(userID);
            const meds = await profile.comingUp();
            
            console.log("coming up: ", meds);

            return NextResponse.json({Status: "Allowed", data: JSON.stringify(meds)});
        }
    }
    return NextResponse.json({status: "Unathorized"});
}