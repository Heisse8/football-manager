import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {

const navigate = useNavigate();

const [username,setUsername] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [confirmPassword,setConfirmPassword] = useState("");

const [showPassword,setShowPassword] = useState(false);
const [message,setMessage] = useState("");
const [loading,setLoading] = useState(false);
const [fadeIn,setFadeIn] = useState(false);

/* =====================================================
AUTO REDIRECT IF LOGGED IN
===================================================== */

useEffect(()=>{

setFadeIn(true);

const token = localStorage.getItem("token");

if(token){
navigate("/");
}

},[navigate]);

/* =====================================================
REGISTER
===================================================== */

const handleRegister = async (e)=>{

e.preventDefault();

if(loading) return;

if(password !== confirmPassword){

setMessage("Passwörter stimmen nicht überein");
return;

}

setLoading(true);
setMessage("");

try{

const res = await fetch("/api/auth/register",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username:username.trim(),
email:email.trim(),
password
})
});

const data = await res.json();

if(!res.ok){

setMessage(data.message || "Registrierung fehlgeschlagen");
setLoading(false);
return;

}

setMessage("Account erstellt. Weiterleitung zum Login...");

setTimeout(()=>{
navigate("/login");
},2000);

}catch(err){

console.error("Register Fehler:",err);
setMessage("Serverfehler");

}

setLoading(false);

};

/* =====================================================
RENDER
===================================================== */

return(

<div
className="min-h-screen flex items-center justify-center bg-cover bg-center"
style={{ backgroundImage:"url('/stadium.jpg')" }}
>

<div
className={`bg-black/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-white transition-all duration-700 ${
fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
}`}
>

<h2 className="text-3xl font-bold text-center mb-6">
Registrieren ⚽
</h2>

<form onSubmit={handleRegister} className="space-y-4">

{/* USERNAME */}

<input
type="text"
required
placeholder="Username"
className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
value={username}
onChange={(e)=>setUsername(e.target.value)}
/>

{/* EMAIL */}

<input
type="email"
required
placeholder="Email"
className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
value={email}
onChange={(e)=>setEmail(e.target.value)}
/>

{/* PASSWORD */}

<div className="relative">

<input
type={showPassword ? "text" : "password"}
required
placeholder="Passwort"
className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none pr-12"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<span
className="absolute right-3 top-3 cursor-pointer text-gray-400"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈" : "👁"}
</span>

</div>

{/* CONFIRM PASSWORD */}

<input
type={showPassword ? "text" : "password"}
required
placeholder="Passwort bestätigen"
className="w-full p-3 rounded-lg bg-gray-800 focus:ring-2 focus:ring-green-500 outline-none"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
/>

{/* BUTTON */}

<button
type="submit"
disabled={loading}
className="w-full bg-green-600 hover:bg-green-500 transition p-3 rounded-lg font-semibold"
>

{loading ? "Registriere..." : "Registrieren"}

</button>

{/* MESSAGE */}

{message && (

<div className="text-center text-sm mt-3 text-yellow-400">
{message}
</div>

)}

{/* LOGIN LINK */}

<div className="text-center text-sm mt-4 text-gray-400">

Bereits einen Account?{" "}

<Link
to="/login"
className="text-green-400 hover:underline"
>
Jetzt einloggen
</Link>

</div>

</form>

</div>

</div>

);

}