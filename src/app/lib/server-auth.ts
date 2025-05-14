import sqlite3  from "sqlite3";
import { init }  from "@paralleldrive/cuid2";

export const createID = init({
    length: 16
});

export const db = new sqlite3.Database("./users.db", (err) => {
    if (err) {
        console.log("Unable to open database: ", err.message);
    } else {
        console.log("DB OPEN!");
    }
});

// returns userID from db
export async function authClientDB(sessionID: any) {
    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT userID FROM sessions WHERE ID = "${sessionID}";`, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });

    console.log(`authClientDB("${sessionID}") =>`, row);
    
    return row;
}