import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

import { db, createID } from '@/app/lib/server-auth';
import { authClientDB } from '@/app/lib/server-auth';

export async function POST(req: NextRequest) {
    const data = await req.json();
    const { email, password } = data;

    if (req.cookies.has("sessionID")) {
        let id = req.cookies.get("sessionID")?.value;
        if (await authClientDB(id)) {
            return NextResponse.json({status: "Already logged in", action: "redirect"})
        }
    }

    let res = NextResponse.json({ status: "Invalid Email or Password", action: "stay"});

    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = ? AND password = ?;`, [email, password], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
    console.log("row; ", row);
    if (row) {
        const sessionID = createID();
        
        const err = await new Promise<any>((resolve, reject) => {
            db.run(`INSERT INTO sessions (id, userID) VALUES ("${sessionID}", ${row.id});`, (err) => {
                if (err) reject(err);
                else resolve(null)
            });
        })

        if (err) {
            console.log("error occured");
        }

        console.log("Logged in");
        res = NextResponse.json({ status: "Success", action: "redirect"});
        res.cookies.set("sessionID", sessionID);
    }

    return res;
}