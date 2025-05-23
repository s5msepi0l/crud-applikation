"use client";

import Image from "next/image";
import NavBar from "../components/nav";
import Header from "../components/header";
import { Anonymous_Pro } from "next/font/google";


import { useEffect, useState } from "react";

const AnonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"]
});

export default function notifications() {
    const [notifications, setNotifications] = useState<{date: string, category: string, details: string }[]>([]);

    useEffect(() => {
        (async () => {
            const response = await fetch("/api/notification");
            const data = await response.json();

            setNotifications(data);
        })();

    }, [])

    const refresh = async () => {
        console.log("refresh");
    }


    return (<div className="h-full w-full">
        <Header/>
        <NavBar>
            <main 
            className={`
                ${AnonymousPro.className} w-full h-full
                flex
                flex-col
                items-center
            `}>
                
                {  <div 
                    className="flex items-center w-10/12 h-1/10"
                    onClick={() => refresh()}>

                    <h1 className="text-3xl font-bold text-text-gray hover:text-dark-gray">Notifications</h1>
                    <Image
                    src="refresh.svg"
                    width={25}
                    height={25}
                    alt="Refresh page"
                    className="fill-current text-navy-blue"
                    />

                </div> }

                <div className={`
                    w-10/12 h-10/12
                    border-4
                    border-light-border-gray
                    rounded-sm
                    `}>
                    <table style={{borderRadius: "64px"}} className={`
                        h-fit w-full
                        
                        `}>
                        <thead className="bg-light-border-gray text-dark-gray">
                            <tr>
                                <th className=" text-2xl text-start pl-4">Date</th>
                                <th className=" text-2xl text-start ">Category</th>
                                <th className=" text-2xl text-start ">Details</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-gray font-bold text-xl">
                            {
                                notifications.map((item, index) => (
                                <tr key={index} className="border-b-4 border-light-border-gray">
                                    <td className="pl-4">{item.date}</td>
                                    <td className="">{item.category}</td>
                                    <td className="">{item.details}</td>
                                </tr>
                                ))
                                
                            }
                        </tbody>
                    </table>
                </div>
            </main>
        </NavBar>
    </div>)
}