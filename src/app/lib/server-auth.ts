import sqlite3  from "sqlite3";
import { init }  from "@paralleldrive/cuid2";
import { LRUCache } from "lru-cache";
import { promise } from "better-auth";
import { dateCmp } from "./util";

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

export async function userExists(email: string) {
    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE email = "${email}";"`, (err, row) => {
            if (err) reject (err);
            else resolve(row);
        });
    });

    return row !== undefined;
}

export async function getUserId(sessionID: string) {
    console.log("sessionID: ", sessionID);
    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT userID FROM sessions WHERE ID = "${sessionID}";`, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        })
    });

    return row.userID;
}

const congratsMessages = [
  "Awesome job! You're keeping your streak strong 💪",
  "Nice work! Every dose counts — and you're on fire 🔥",
  "You're doing amazing! Keep up the great consistency 💊",
  "Your dedication is paying off. Keep it going! 🌟",
  "Proud of you! You're crushing your routine 🏆",
  "That’s another step toward better health — well done! 🧠💖",
  "You remembered again! Your streak is alive and well 🎉",
  "Every time you stick to it, you build momentum — great job 🚀",
  "Streak strong! Your future self will thank you 🙌",
  "You're building a healthy habit — and it shows 🌱"
];

const streakResetMessages = [
  "No worries — one missed dose doesn't define your progress ❤️",
  "It happens! Just pick it back up. You're still doing great 💪",
  "Don’t be hard on yourself — tomorrow’s another chance 🌅",
  "Streaks reset, but your commitment doesn’t 💊 Keep going!",
  "One slip isn’t failure. It’s part of the journey. You’ve got this 🌱",
  "Even the best miss a day — consistency over perfection 🚶‍♂️➡️🏃‍♀️",
  "Hey, missing one doesn’t erase your progress. You’re still ahead 🙌",
  "You're human! Reset and restart — we're with you 💖",
  "Streak lost? No big deal. You’re still building something strong 🧱",
  "It's not about the streak. It’s about showing up again — and you will 💫"
];


// get random message for holding streak
export function getMessage(streak: number) {
    if (streak == 0) {
        return streakResetMessages[Math.floor(Math.random() * streakResetMessages.length)];
    }
    return congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
}

export type Medication = {
    id: number,

    name: string,
    dosage: string,
    
    frequency: number,
    frequencyOffset: number,

    description: string,
    remaining: number,
    streak: number
}

/* Time in place when user took medicin, time and so on
*/
export type Dose = {
    time: string,
    medicationID: number
}

export class Profile {
    id: number;

    streak: number

    medications: Array<Medication>;
    doseLog: Array<Dose>;

    constructor(id: number) {
        this.id = id;
        
        this.streak = 0;

        this.medications = new Array<Medication>;
        this.doseLog = new Array<Dose>;
    }

    //check db if doseLog or medication lists has any new data and set the overall streak
    async update() {
        //get list of medications
        const data = await new Promise<any>((resolve, reject) => {
            db.all(`SELECT * FROM medication WHERE user_id = ${this.id};`, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });

        let low = 0;

        for (let i = 0; i < data.length; i++) {
            const element: Medication = {
                id: data[i].id,
                
                name: data[i].name,
                dosage: data[i].dosage,

                frequency: data[i].frequency_h,
                frequencyOffset: data[i].frequency_h_offset,

                remaining: data[i].remaining,
                streak: data[i].streak,

                description: data[i].description,
            };

            this.medications.push(element)
        }
    }

    async logout() {
        return await new Promise<any>((resolve, reject) => {
            db.prepare("DELETE FROM sessions WHERE userID = ?;").get(this.id, (err) => {
                if (err) reject(false);
                else resolve(true);
            })
        })
    }

    //true/false depending on if there's any errors
    async use(medicationID: number) {
        console.log("use: ", medicationID);
        
        const decrement = await new Promise<any>((resolve, reject) => {
            db.prepare("UPDATE medication SET remaining = remaining - 1 WHERE id = ?;").run(medicationID, (err) => {
                if (err) reject(false);
                else resolve(true);
            })
        });

        const log = await new Promise<any>((resolve, reject) => {            
            db.run(`INSERT INTO medication_log (user_id, medication_id) VALUES (${this.id}, ${medicationID});`, (err) => {
                if (err) reject(false);
                else resolve(true);
            });
        });

        return (decrement && log);
    }

    // medicine newal set medication(remaining) to remaining_s
    async refill(id: number) {
        const data = await new Promise<any>((resolve, reject) => {
            console.log("id: ", id);
            db.prepare("UPDATE medication SET remaining = remaining_s WHERE id = ?;").run(id, (err: any) => {
                if (err) reject(false);
                else resolve(true);
            })
        })
        console.log("refill status: ", data);
        return data;
    }

    // do some weird server side logic to flag medication should to taken now
    async comingUp() {
       const data = await new Promise<any>((resolve, reject) => {
            db.prepare(`
            SELECT
                m.id AS medication_id,
                m.name,
                m.dosage,
                m.frequency_h,
                m.description,
                m.remaining,
                m.streak,
                m.frequency_h_offset,
                MAX(ml.taken_at) AS last_taken_at
            FROM medication m
            LEFT JOIN medication_log ml ON m.id = ml.medication_id
            WHERE m.user_id = ?
            GROUP BY m.id;
            `).all(this.id, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });

        for (let i = 0; i < data.length; i++) {
            if (dateCmp(data[i].last_taken_at)) { // dont take meds
                data[i].useNow = false;
            } else { //take meds now, 
                data[i].useNow = true;
            }   

        }


        return data;
    }

    async runningOut() {
        const data = await new Promise<any>((resolve, reject) => {
            db.prepare("SELECT * FROM medication WHERE user_id = ? ORDER BY remaining ASC").all(this.id, (err, rows) => {
                if (err) reject (err);
                else resolve(rows);
            });
        });

        return data;
    }

    // calculate a rough adherance rate
    async adheranceRate () {
        return 0;
    }

    //get missed doses from the last X amount of days
    async missedDoses (n: number) {
        return 0;
    }
}


/* Imma be real ts shi straight buns but it works ig
*/

/* By default will set remaining and streak to 0
 * user must "renew" to enter the amount remaining and to start the streak */
export const MedicationHandler = {
    /* Probably A better way to do it but I'm in too deep to make something better  */
    cache: new LRUCache<number, Profile>({
        max: 100, //Maximum of 100 cached profiles
        ttl: 1000 * 60 * 5 // 5 minute time-to-live
    }),


    register: async (name: string, dose: string, frequency: number, description: string) => {
        return await new Promise<any>((resolve, reject) => {
            db.run(`
                INSERT INTO medication (user_id, name, dosage, frequency_h, description, remaining, streak)
                VALUES (1, "${name}", "${dose}", ${frequency}, "${description}", 0, 0);
            `, (err) => {
                if (err) reject(false);
                else resolve(true);
            });
        });
    },
    
    // get a quick overview of a users upcoming dosages, missed dosages and so on
    // check first cahce
    profile: async (ID: number): Promise<Profile> => {

        // we cookin w this one
        const cached = MedicationHandler.cache.get(ID);
        if (cached !== undefined) {
            console.log(`Fetching user profile "${ID}" from cache`);
            return cached;
        }

        console.log(`Fetching user profile "${ID}" from database`);
        const profile = new Profile(ID);
        await profile.update();

        MedicationHandler.cacheProfile(profile);

        return profile;
    },


    // After getting user data in /api/dashboard/get cache the processed data incase the user wants to renew something
    cacheProfile: (profile: Profile) => {
        MedicationHandler.cache.set(profile.id, profile);
    }   
}