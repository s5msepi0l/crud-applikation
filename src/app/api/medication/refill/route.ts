import { NextRequest, NextResponse } from "next/server";
import { authClientDB, getUserId, MedicationHandler } from "@/app/lib/server-auth";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const medicationID = data.hasOwnProperty("id")? data.id: null;

    if (medicationID !== null && req.cookies.has("sessionID")) {
        const id = req.cookies.get("sessionID")?.value;

        if (await authClientDB(id)) {
            const userID = await getUserId(String(id));
            const profile = await MedicationHandler.profile(userID);
            
            if (await profile.refill(medicationID)) {
                return Response.json({status: "successfull"});
            }

            return Response.json({status: "Internal server error"});
        }
    }

    return Response.json({status: "Unathorized"});
}