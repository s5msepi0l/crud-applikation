import { getUserId, MedicationHandler } from "@/app/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.cookies.has("sessionID")) {
        const sessioID = String(req.cookies.get("sessionID")?.value);
        const id = await getUserId(sessioID);
        if (id) { //valid session
            const profile = await MedicationHandler.profile(id);

            return NextResponse.json({data: {
                streakCounter: profile.streak,
                comingUp: profile.comingUp(),
                runningOut: profile.runningOut(),
            }});
        }
    }
    return NextResponse.json({status: "Unathorized"});
}