import { getUserId, MedicationHandler } from "@/app/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    if (req.cookies.has("sessionID")) {
        const sessionID = String(req.cookies.get("sessionID")?.value);
        const id = await getUserId(sessionID);
        if (id) { //valid session
            const profile = await MedicationHandler.profile(id);

            return NextResponse.json({data: {
                streakCounter: profile.streak,
                comingUp: await profile.comingUp(),
                runningOut: await profile.runningOut(),
            }});
        }
    }
    return NextResponse.json({status: "Unathorized"});
}