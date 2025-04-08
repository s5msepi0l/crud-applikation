import { Anonymous_Pro } from "next/font/google";

import Form from "next/form";

const AnonymousPro = Anonymous_Pro({
    weight: ["400", "700"],
    subsets: ["latin"]
    });
export default function Login() {
    

    return (<main className="flex w-screen h-screen justify-center items-center">
        <div className="bg-dark-gray w-1/3">
            <h1 className={`${AnonymousPro.className} text-7xl text-white`}>Sign in to <span className="font-bold">Medibeddy</span></h1>
            <Form action="/">
                <input/>
                <input/>    
            </Form>
        
        </div>

    </main> );
}