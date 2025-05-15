import sqlite3  from "sqlite3";
import { init }  from "@paralleldrive/cuid2";
import { LRUCache } from "lru-cache";


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
    const row = await new Promise<any>((resolve, reject) => {
        db.get(`SELECT userID FROM sessions WHERE ID = "${sessionID}";`, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        })
    });

    return row.userID;
}

export type Medication = {
    id: number,

    name: string,
    dosage: string,
    frequency: number,
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

        console.log("data: ", data);
    }

    // medicine newal set medication(remaining) to remaining
    async renew(id: number, remaining: number) {
        return true;
    }

    async comingUp() {
        return [];
    }

    async runningOut() {
        return [];
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
        const cached: Profile = MedicationHandler.cache.get(ID);
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