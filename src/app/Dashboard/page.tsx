"use client";

import React, { useEffect, useState } from 'react'
import Header from '../components/header'
import NavBar from '../components/nav'


import { Anonymous_Pro } from "next/font/google";
const AnonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"]
});


export default function Dashboard() {
  const didFetch = React.useRef(false);

  const [streak, setStreak] = useState(0);
  const [runningOut, setRunningOut] = useState<{ frequency_h_offset: number, id: number, name: string, remaining: number, remaining_s: number, description: string, dosage: string, useNow: boolean}[]>([]);
  const [comingUp, setComingUp] = useState<{ frequency_h_offset: number, id: number, name: string, remaining: number, remaining_s: number, description: string, dosage: string, useNow: boolean}[]>([]);

  const [streakUrl, setStreaUrl] = useState("");

  useEffect( () => {
  setStreaUrl(fetchstreakIcon());  
    
  (async () => {
    if (didFetch.current) return;
    didFetch.current = true;

    const response = await fetch("/api/dashboard/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    console.log(data);
    setStreak(data.data.streakCounter);
    setRunningOut(data.data.runningOut);
    setComingUp(data.data.comingUp);


  })() }, []);

  const fetchMedicationIcon = () => {
    return `/api/medication/icon/${Math.floor(Math.random() *4 ) + 1}`;
  }

  const fetchstreakIcon = () => {
    return `/api/dashboard/streakIcon/${Math.floor(Math.random() *4 ) + 1}/${streak}`;
  }

  const streakMsg = () => {
    if (streak === 0) {
      const msg = [
        "Oops, streak reset. 😢 Tomorrow’s a new chance.",
        "The flame flickered out… but you can reignite it. 🔥",
        "No shame — even legends rest. Back at day 1!",
        "That streak? Gone. But the comeback? Legendary.",
        "Life happens. The streak resets. You’re still awesome."
        ];
      return msg[Math.floor(Math.random() * msg.length)]
    }
    const msg = [
      `You're on fire! 🔥 That’s a  ${streak}-day streak!`,
      `Look at you go! ${streak} days strong — unstoppable!`,
      `Your streak just leveled up! ${streak} days of awesomeness. 🎉`,
      `Habit unlocked: ${streak} days. Keep dominating!`
    ];
    return msg[Math.floor(Math.random() * msg.length)];
  }

  // Refill Medication
  const refill = async(id: number) => {
    const response = await fetch("/api/medication/refill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: id
      })
    });

    const data = await response.json();
  }

  if (streakUrl === "") return <h1>Loading...</h1>

  return (
    <div className='w-screen h-screen'>
      <Header/>
      <NavBar>
        <div className={`
          ${AnonymousPro.className}
          pl-16
          pt-32
          w-full h-full
          `}>
          <main className='w-full h-3/4 flex'>
            <div className='
            bg-happy-blue
            w-7/12
            h-full
            rounded-xl
            flex
            flex-row

            items-center
            justify-around
            shadow-md
            '>
              <img
              className='rounded-full ml-8'
              width={320}
              src={streakUrl}
              />
              
              <div className='text-center'>
                <h1 className='text-gray-50 text-8xl font-bold'>{streak}</h1>
                <p className='text-gray-50 font-bold text-2xl'>{streakMsg()}</p>
              </div>
            </div>

            <div className='w-2/7 h-full flex flex-col items-center justify-between'>
              <div className='
              h-3/6
              w-full
              bg-boring-blue
              ml-24
              rounded-xl
              flex flex-col items-center
              shadow-md
              '>
                <h1 className='text-gray-50 font-bold text-4xl'>Coming up </h1>
                <ul className="h-full flex flex-col w-4/5 items-center justify-around">
                  {
                    comingUp.map((item, index) => (
                      index !== 3 &&
                      <li className="flex items-center w-full justify-around bg-navy-blue p-2 shadow-md rounded-xl" key={index}>
                        <img className= "bg-white rounded-full p-1 shadow-md" width={68} src={fetchMedicationIcon()}></img>
                        <h1 className='text-gray-50 font-bold text-4xl'>{item.name}</h1>
                      </li>
                    ))

                  }
                </ul>


              </div>

              <div className='w-full h-2/5 ml-24 rounded-xl bg-navy-blue flex flex-col items-center shadow-md'>
                <h1 className="text-gray-50 font-bold mt-1 text-3xl">Running out</h1>

                <ul className='flex flex-col w-full items-center'>
                  {
                    runningOut.map((item, index) => (
                    index !== 3 &&
                    <li key={index} className='text-gray-800 shadow-md bg-gray-50 w-5/6 pt-1 pb-1 rounded-lg mt-4 font-bold text-2xl flex justify-around'>  
                      <h1 className='select-none'>{item.name}</h1>
                      <h1 style={{color: 
                      `rgb(${256 - Math.floor((item.remaining / item.remaining_s) * 255)}, ${Math.floor((item.remaining / item.remaining_s) * 256)}, ${Math.floor((item.remaining / item.remaining_s) * 128)})`
                    }}

                      >{item.remaining}</h1>
                      <button
                        className="bg-happy-blue hover:bg-boring-blue text-gray-50 p-1 pl-3 pr-3 rounded-full"
                        onClick={() => refill(item.id)}>Refill</button>
                    </li>
                  ))
                  
                  }

                </ul>
              </div>
            </div>
          </main>
          

        </div>
      </NavBar>
    </div>
  )
}
