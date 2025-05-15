import { db, userExists } from "@/app/lib/server-auth";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    console.log("REGISTER ROUTE");
    const data = await req.json();
    const { email, password } = data;
/*
    if (req.cookies.has("sessionID")) {
        let id = req.cookies.get("sessionID")?.value;
        if (await authClientDB(id)) {
            return NextResponse.json({status: "Already logged in", action: "redirect"});
        }
    }*/

    if (await userExists(email)) {
        return NextResponse.json({status: "Email is already in use", action: "stay"});
    }


    return await new Promise<any>((resolve, reject) => {
        db.run(`INSERT INTO users (email, password) VALUES ("${email}", "${password}");`, (err) => {
            if (err) reject(NextResponse.json({status: "Database error occured", action: "stay"}));
            else resolve(NextResponse.json({status: "Account succesfully created", action: "redirect"}));
        });
    })
}