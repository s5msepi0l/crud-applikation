'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import NavBar from '../components/nav';
import { Anonymous_Pro } from 'next/font/google';

const AnonymousPro = Anonymous_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export default function Medications() {
  const [days, setDays] = useState<{ date: number; weekday: string }[]>([]);
  const [popupWindow, setPopupWindow] = useState(false);

  useEffect(() => {
    const upcoming: { date: number; weekday: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 4; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);

      const date = nextDay.getDate();
      const weekday = nextDay.toLocaleDateString(undefined, { weekday: 'long' });

      upcoming.push({ date, weekday });
    }

    setDays(upcoming);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }

  return (
    <div className="w-screen h-screen relative">
      <Header />
      <NavBar>
        <main className={`${AnonymousPro.className} w-full h-full`}>
          <div className="flex flex-row w-full h-2/5">
            <button
              className="ml-16 mt-8 mr-24 bg-happy-blue text-white rounded-md w-40 h-20 font-bold text-xl"
              onClick={() => { setPopupWindow(!popupWindow); }}
            >
              Register new <br />
              medication
            </button>

            <div className="flex flex-row justify-around items-center mt-8 w-3/5 h-10/12 bg-navy-blue rounded-3xl text-white font-bold text-xl">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`h-4/5 w-1/6 rounded-full ${
                    index === 0 ? 'bg-error-red' : 'bg-happy-blue'
                  } flex flex-col items-center justify-center`}
                >
                  <div className="h-32 w-32 bg-white text-text-blue text-4xl mb-8 flex justify-center items-center rounded-full">
                    {day.weekday.substring(0, 3)}
                  </div>

                  <span className="text-7xl">{day.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h1>Next up</h1>
            <hr />
          </div>

          <div>
            <h1>11:00 AM</h1>
          </div>
        </main>

        {/* Popup Window */}
        {popupWindow && (
          <div
            className="absolute z-50 bg-gray-200 text-text-blue w-3/5 h-3/5 -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 rounded-xl"
            style={{
              animation: `popupAnimation 0.2s ${popupWindow? "forwards" : "reverse"}`,
            }}
          >
            
            <form 
              onClick={handleSubmit}
              className={`
                flex flex-col 
                items-center
                justify-center
                w-full h-full`}
            >
              
              <label htmlFor="name">Medication name</label>
              <input name="name" className="border-1 rounded-md mb-8" type="text" placeholder="Name"/>
              
              <label htmlFor="dosage">Medication do</label>
              <input name="dosage" className="border-1 rounded-md mb-8" type="text" placeholder="Name"/>
              
              <label htmlFor="name">Medication name</label>
              <input name="name" className="border-1 rounded-md mb-8" type="text" placeholder="Name"/>
            </form>
          </div>
        )}
      </NavBar>
    </div>
  );
}
