import { getUserId, MedicationHandler } from "@/app/lib/server-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    if (req.cookies.has("sessionID")) {
        const sessioID = String(req.cookies.get("sessionID")?.value);
        const id = await getUserId(sessioID);
        if (id) { //valid session
            const profile = await MedicationHandler.profile(id);
            if (await profile.logout()) {
                return Response.json({status: "sucess"});
            }
            return Response.json({status: "Internal server error"});
        }
    }
    return NextResponse.json({status: "Unathorized"});
}