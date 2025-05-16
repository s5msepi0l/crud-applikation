'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";

import Header from '../components/header';
import NavBar from '../components/nav';

import { Anonymous_Pro } from 'next/font/google';


const AnonymousPro = Anonymous_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
});

const happyColors = [
  {
    bg: '#FFD54F',
    border: '#FFB300' 
  },
  {
    bg: '#81D4FA',  
    border: '#0288D1' 
  },
  {
    bg: '#AED581',   
    border: '#689F38' 
  }
];

function fetchIcon() {
  return `/api/medication/icon/${Math.floor(Math.random() *4 ) + 1}`;
}

export default function Medications() {
  const [days, setDays] = useState<{ date: number; weekday: string }[]>([]);
  const [popupWindow, setPopupWindow] = useState(false);

  const [serverRes, setServerRes] = useState("");
  const [medName, setMedName] = useState("");
  const [medDose, setMedDose] = useState("");
  const [medFreq, setMedFreq] = useState(0);
  const [medDes, setMedDes] = useState("");

  const [medArr, setMedArr] = useState<{ frequencyOffset: number, id: number, name: string, description: string, dosage: string }[]>([]);


  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
      (async () => {
        const response = await fetch("/api/medication/use", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({

        })
      });
      const data = await response.json();
      let tmp = JSON.parse(data.data);

      tmp.sort((a: any, b: any) => a.frequencyOffset - b.frequencyOffset);
      console.log("tmp: ", tmp);
      setMedArr(tmp);

      setLoaded(true);
    })();


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

  const medicationClick = async (index: number) => {
    const newArr = [...medArr];    // copy to avoid mutating original state directly
    newArr.splice(index, 1);       // remove one element at index
    setMedArr(newArr);             // update state with the new array

    const medicationIndex = medArr[index].id;

    console.log(`Submitting /api/medication/use, body: {id: ${medicationIndex}}`);
  };

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

  function formatTime(targetHour: number): string {
    if (targetHour < 0 || targetHour > 23) {
      return "00:00";
  }

  const now = new Date()
  const target = new Date()

  target.setHours(targetHour, 0, 0, 0) // set to target hour, 0 minutes

  // If target is in the past for today, move to tomorrow
  if (target <= now) {
    target.setDate(target.getDate() + 1)
  }

  const diffMs = target.getTime() - now.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  if (hours === 0 && minutes === 0) return "Now"
  if (hours === 0) return `${minutes} minute${minutes === 1 ? '' : 's'}`
  if (minutes === 0) return `${hours} hour${hours === 1 ? '' : 's'}`

  return `${hours} hour${hours === 1 ? '' : 's'}`;
}


  console.log(medArr);
  if (!loaded) return <div> Loading medications... </div>

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

          
          <h1 className='text-navy-blue ml-20 text-5xl'>Next up</h1>
          <div className='flex flex-col items-center w-full h-3/6'>
            <hr className="border-2 border-dark-gray rounded-xl w-11/12"/>

            <div className=' w-11/12 h-full flex flex-row'>
              {medArr.map((med: {frequencyOffset: number, name: string}, index) => (
                
                
              /* Dynamically generated by site
                 When clicked item should make a api call to /medications/use
                 and Play a small animation removing the focused element
              */  
              
              
              <div key={index} className='w-full h-full flex flex-col items-center'> 
                <h1 className='text-4xl'>{formatTime(med.frequencyOffset)}</h1>

{ /* Each element should have a randomized "light and colorfull" color with a foreground appropriate border color 
  * Can only show a maximum of 3 elements the rest are just saved */}
                <div className={`
                  w-3/5
                  h-11/12

                  rounded-[60px]
                  
                  
                  border-16
                  flex flex-col
                  items-center
                  justify-around
                `}
                style={{
                  backgroundColor: happyColors[index].bg,
                  borderColor: happyColors[index].border
                  
                }}
                onClick={() => medicationClick(index)}
                >

                  <div className='flex flex-col'>
                    
                    <div className='bg-white rounded-full w-[175px] h-[175px] flex flex-col items-center justify-center'>
                      <img
                        width={125}
                        height={125}
                        alt="medication"
                        src={fetchIcon()} />
                    </div>
                  </div>
                  
                    <h1 className='bg-navy-blue p-2 rounded-2xl text-white text-4xl'>{med.name}</h1>

                </div>
              </div>

              
              ))}
            </div>
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
