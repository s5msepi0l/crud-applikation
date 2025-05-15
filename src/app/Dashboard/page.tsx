"use client";

import React, { useEffect } from 'react'
import Header from '../components/header'
import NavBar from '../components/nav'


import { Anonymous_Pro } from "next/font/google";
const AnonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"]
});


export default function Dashboard() {
  const didFetch = React.useRef(false);

  useEffect( () => {(async () => {
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

  })() }, []);


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
          <main className='w-full h-2/5 flex'>
            <div className='
            bg-happy-blue
            w-7/12
            h-full
            rounded-xl
            '> 
              Streak counter
            
            </div>

            <div className='
            h-full
            w-2/7
            bg-boring-blue
            ml-24
            rounded-xl
            '>
              Coming up
            </div>
          </main>
          
          <div className='
            flex
            gap-14
            pt-16
            h-3/5
          '>
            <div className='w-2/7 h-2/5 rounded-xl bg-navy-blue'>
              Missed doses
            </div>

            <div className='w-2/7 h-2/5 rounded-xl bg-navy-blue'>
              Adherance rate
            </div>
          
            <div className='w-2/7 h-2/5 rounded-xl bg-navy-blue'>
              Running out
            </div>
          </div>
        </div>
      </NavBar>
    </div>
  )
}
