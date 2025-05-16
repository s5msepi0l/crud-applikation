
import { NextApiRequest } from "next";
import { NextRequest, NextResponse } from "next/server";
import fs  from "fs";
import path from "path";

const imageN = 4;

//return one of four random pill svg's
export async function GET(req: NextRequest, {params}: {params: Promise<string>}){
    const parsedParams = await params;
    
    console.log("ID::::", parsedParams);

    console.log(process.cwd());
    const imgPath = path.resolve(`${process.cwd()}/public/pill/${Math.floor(Math.random() * imageN) + 1}.svg`);
    const imgBuffer = fs.readFileSync(imgPath, "utf-8");


    console.log("find pill icon");
    return new NextResponse(imgBuffer, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "no-store", // prevent caching
        }
    });
}