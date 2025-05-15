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

  const [serverRes, setServerRes] = useState("");
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medFreq, setMedFreq] = useState(0);
  const [medDes, setMedDes] = useState("");

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

    console.log("test");
    const response = await fetch("/api/medication/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "name": medName,
        "dose": medDose,
        "frequency": medFreq,
        "description": (medDes.length > 0)? medDes: ""
      })
    });

    const data = await response.json();
    setServerRes(data.status);
  }

  return (
    <div className={`${AnonymousPro.className} font-bold w-screen h-screen relative`}>
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
            className="
            absolute z-50
          bg-gray-200
            text-text-blue 
            w-1/6 h-4/8 
            -translate-y-80 -translate-x-150 
            top-1/2 left-1/2 
            flex flex-col
            items-center
            justify-around
            rounded-xl
            "
            style={{
              animation: `popupAnimation 0.2s ${popupWindow? "forwards" : "reverse"}`,
            }}
          >
            
            <h1 className='text-2xl mt-2'>Register new medication</h1>

            <form 
              onSubmit={handleSubmit}
              className={`
                flex flex-col 
                items-center
                justify-center
                w-full h-full`} id="MedicationForm">
              
              <label htmlFor="name">*Name</label>
              <input required onChange={(e) => setMedName(e.target.value)} name="name" className="border-2 border-happy-blue rounded-md mb-8" type="text" placeholder="Name..."/>
              
              <label htmlFor="dosage">*Dosage</label>
              <input required onChange={(e) => setMedDose(e.target.value)} name="dosage" className="border-2 border-happy-blue rounded-md mb-8" type="text" placeholder="Dosage..."/>

              <label htmlFor="frequency">*Frequency (hour)</label>
              <input required onChange={(e) => setMedFreq(parseInt(e.target.value))} name="frequency" className="border-2 border-happy-blue rounded-md mb-8" type="number" placeholder="Frequency..."/>

              <label htmlFor="description">Description</label>
              <textarea className="
              border-2 rounded-md
              border-happy-blue
              mb-8
              resize-none
              w-64
              h-20
              "
              form="MedicationForm"
              name="description"
              placeholder="Medication should be swalled with water..."
              onChange={(e) => setMedDes(e.target.value)}></textarea>

              {serverRes.length >= 0 && (
                <h1 className='text-lg text-center text-navy-blue'>{serverRes}</h1>
                )}

              <input className='
              bg-happy-blue 
              hover:bg-navy-blue
              text-white
                
              w-30
              h-12
              rounded-2xl
              text-xl
              '
              
              type="submit"
              value="Register"/>


            </form>
          </div>
        )}
      </NavBar>
    </div>
  );
}
