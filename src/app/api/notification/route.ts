import { NextRequest, NextResponse } from "next/server";
import { authClientDB, getUserId, MedicationHandler } from "@/app/lib/server-auth";

export async function GET(req: NextRequest) {
    if (req.cookies.has("sessionID")) {
        const id = req.cookies.get("sessionID")?.value;

        if (await authClientDB(id)) {
            const userID = await getUserId(String(id));
            const profile = await MedicationHandler.profile(userID);

            let low = await profile.runningOut();
            
            let buffer = [];

            for (let i = 0; i < low.length; i++) {
                if (low[i].remaining <= 3) {
                    const now = new Date();
                    
                    const day = now.getDate();
                    const month = now.getMonth();
                    const year = now.getFullYear();
                    
                    buffer.push({date: `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`, category: "Medication", details: `${low[i].name} is running out! renew it ASAP`});
                }
            }

            return Response.json(buffer);
        }
    }

    return Response.json({status: "Unathorized"});
}