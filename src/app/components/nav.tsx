"use client";

import Link from "next/link";
import Image from 'next/image'
import { useEffect } from "react";
import { Anonymous_Pro } from "next/font/google";
import { usePathname } from "next/navigation";

import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

const AnonymousPro = Anonymous_Pro({
  weight: ["400", "700"],
  subsets: ["latin"]
});

export default function NavBar({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    console.log("logout");
    await authClient.signOut();
    router.push("/login");
  }

  useEffect(() => {
    // Select the div that holds the links and iterate through its children
    const container = document.querySelector('div.mt-8.flex.flex-col');
    if (container) {
      const links = container.querySelectorAll('a, div'); // Select all <a> (links) and <div> elements

      links.forEach((link) => {

        if (pathname.substring(1, pathname.length) === link.textContent) {
            link.classList.add("font-bold");
        }
        
        console.log(link); // Log the text content of each link or div
      });
    }
  }, []); // Run once when the component mounts

  return (
    <div className="flex h-14/15 w-full">
    <nav
      className={`
        h-full w-1/5 bg-midnight-blue
        text-3xl font-medium text-left
        flex flex-col items-center
      `}
    >
      <div className="mt-8 flex flex-col justify-between h-2/7 w-5/7">
      
        <div className="flex">
          <Image
            src="/dashboard.svg"
            width={25}
            height={25}
            alt="Dashboard"

            className="invert mr-4"
          />
          <Link href="/Dashboard" className={`${AnonymousPro.className} text-white hover:font-bold`}>Dashboard</Link>
        </div>

        <div className="flex">
          <Image
            src="/pill.svg"
            width={25}
            height={25}
            alt="Dashboard"

            className="invert mr-4"
          />

          <Link href="/Medications" className={`${AnonymousPro.className} text-white hover:font-bold`}>Medications</Link>
        </div>
       
        <div className="flex">
          <Image
              src="/alert.svg"
              width={25}
              height={25}
              alt="Dashboard"

              className="invert mr-4"
            />
              
          <Link href="/Notifications" className={`${AnonymousPro.className} text-white hover:font-bold`}>Notifications</Link>
        
        </div>
       
       <div className="flex">
        <Image
          src="/logout.svg"
          width={25}
          height={25}
          alt="Dashboard"

          className="invert mr-4"
        />

          <div className={`${AnonymousPro.className} text-white hover:font-bold`} onClick={() => logout()}>Logout</div>
        </div>
      </div>
    </nav>
      <div className="w-full h-full">
        {children}    
      </div>
    </div>
  );
}
