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

export const sessions: {[key: string]: {userID: string}} = {};