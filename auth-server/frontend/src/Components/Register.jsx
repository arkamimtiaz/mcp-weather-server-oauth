import { useState } from "react";
import { toast } from "react-toastify";
function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <>
    <div className="w-50 mx-auto p-4">
        <h1 className="font-serif text-lg">Name</h1>
        <input onChange={(change) => setName(change.target.value)} className="mt-2 m-1 border border-lg rounded w-70 p-1 shadow-lg hover:scale-105 duration-300" value = {name} type="text" placeholder="Enter name" />
        <h1 className="font-serif text-lg mt-5">Email</h1>
        <input onChange={(change) => setEmail(change.target.value)} className="mt-2 m-1 border border-lg rounded w-70 p-1 shadow-lg hover:scale-105 duration-300" value = {email} type="email" placeholder="Enter Email" />
        <h1 className="font-serif text-lg mt-5">Password</h1>
        <input onChange={(change) => setPassword(change.target.value)} className="mt-2 m-1 border border-lg rounded w-70 p-1 shadow-lg hover:scale-105 duration-300" value = {password} type="password" placeholder="Enter Password" />
    </div>         
    <div className="flex justify-center mt-3 ml-30">
        <button className="bg-green-700 hover:bg-green-500 border rounded text-white text-xl font-serif p-1 w-70" onClick = {async () => {
            try {
                const response = await fetch("http://localhost:3000/api/register", {
                    method : "POST",
                    headers : {"Content-Type" : "application/json"},
                    body: JSON.stringify({
                        name : name,
                        email : email,
                        password : password
                    })
            });
                const data = await response.json()
                if(response.ok){
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            }
            catch(error) {
                toast.error("Network Error")
                
            }
        }}>Create Account</button>
      </div>
    
   </>
    )
}



export default Register