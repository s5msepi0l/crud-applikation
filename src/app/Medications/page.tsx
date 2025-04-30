import React from 'react'
import Header from '../components/header'
import NavBar from '../components/nav'

export default function Medications() {
  return (
    <div className="w-screen h-screen">
        <Header/>
        <NavBar>

          <main>
            <div>  
              <button>Register new medication</button>

              <div>

                <div>
                  <div>
                    Mon
                  </div>

                    1
                </div>

                <div>
                  <div>
                    Tue
                  </div>

                    2
                </div>

                <div>
                  <div>
                    Wed
                  </div>

                    3
                </div>

                <div>
                  <div>
                    Thu
                  </div>

                    4
                </div>

              </div>
            </div>

            <div>
              <h1>Next up</h1>
              <hr/>
            </div>
        
            <div>
              <h1>11:00 AM</h1>
              
              <div>

              </div>


            </div>

          </main>
        
        </NavBar>
      </div>
  )
}