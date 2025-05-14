"use client";

import { Anonymous_Pro } from "next/font/google";

import Form from "next/form";
import Image from "next/image";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "../lib/auth-client";


const AnonymousPro = Anonymous_Pro({
    weight: ["400", "700"],
    subsets: ["latin"]
});

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    useEffect(() => {
        const session = document.cookie.split('; ').some(cookie => cookie.startsWith('sessionID='));
        if (session) {
            router.push("/Dashboard");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        })

        data.then(data => data.json())
        .then(data => {
            console.log("data: ", data);
            switch(data.action) {
                case "redirect":
                    router.push("/Dashboard");
                    setError(false);

                    break;

                case "stay":
                    setError(true);
                    setErrorMsg(data.status);
                    break;
            }
        })

        console.log(data);

        console.log(`Submitting: ${email}`)
    }

    const altSignin = async () => {
        console.log("Sign in via github...")
        const data = await authClient.signIn.social({provider: "github", callbackURL: "/Dashboard"});
        console.log(data);
    }

    return (<main className="flex w-screen h-screen justify-center items-center">
        <div className="bg-dark-gray h-112 w-1/4 rounded-md flex flex-col items-center">
            <h1 className={`${AnonymousPro.className} mt-4 mb-8 text-4xl text-center w-full text-white`}>Sign in to <span className="font-bold">Medibeddy</span></h1>
            
            <form className="flex flex-col w-full h-full items-center" 
            onSubmit={handleSubmit} >
                <input 
                    className={` ${AnonymousPro.className}
                    border-2
                    ${error ? "border-error-red" : "border-border-gray"}
                    rounded-sm
                    w-4/5
                    mb-4 
                text-white placeholder-zinc-50 text-2xl`}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    />
                
                <div className="w-4/5">
                <input type="text" className={` ${AnonymousPro.className}
                    border-2
                    ${error ? "border-error-red" : "border-border-gray"}
                    rounded-sm
                    w-full
                     
                    
                text-white placeholder-zinc-50 text-2xl`} 
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />
                { (error ? (<p className="text-error-red">Email or password is incorrect</p>): (<p></p>))}

                </div>

                <input
                type="submit"
                value="Sign in"
                onClick={(e) => console.log("submit")}
                className={`
                ${AnonymousPro.className}
                
                mt-auto mb-8 bg-navy-blue text-white
                w-1/2
                h-1/5
                rounded-xl
                text-4xl
                `}
                />
            </form>
            
            <hr className="w-4/5 h-1 mb-8 bg-border-gray rounded-2xl border-0"/>

            <div 
                className={`${AnonymousPro.className}
                flex items-center justify-evenly
                font-sans text-2xl
                bg-white
                mb-4
                p-1
                rounded-lg
                border-2
                border-gray-400
                `}
                
                onClick={altSignin}
                >
                
                <Image
                    src="/github.svg"
                    alt="Github signin"

                    className="bg-white rounded-full "

                    width={51}
                    height={51}
                />


                <span className="ml-4"
                >Sign in with <span className="font-black">Github</span></span>
            </div>
        
        </div>

    </main> );
}