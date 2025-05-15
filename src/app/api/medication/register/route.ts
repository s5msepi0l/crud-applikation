import { NextRequest, NextResponse } from "next/server";
import { authClientDB, db, getUserId, MedicationHandler } from "@/app/lib/server-auth";

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { name, dose, frequency, description } = data;   

    if (req.cookies.has("sessionID")) {
        const id = req.cookies.get("sessionID")?.value;

        if (await authClientDB(id)) { // valid session
            const userID = await getUserId(String(id));
            
            if (!await MedicationHandler.register(name, dose, frequency, description)) {
                return NextResponse.json({status: "Error registering medication"});
            }
            return NextResponse.json({status: "Medication registered to your account"});
        }
    }

    return NextResponse.json({status: "Unauthorized"});
}