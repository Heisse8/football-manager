import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifySuccess() {

const navigate = useNavigate();
const [searchParams] = useSearchParams();

useEffect(() => {

const token = searchParams.get("token");

if(!token){

setTimeout(()=>{
navigate("/login");
},2000);

return;

}

/* Token speichern */

localStorage.setItem("token", token);

/* Redirect */

const timer = setTimeout(()=>{
navigate("/");
},2000);

return () => clearTimeout(timer);

},[navigate,searchParams]);

return (

<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">

<div className="bg-black/50 p-10 rounded-xl text-center">

<h2 className="text-2xl font-bold mb-4">
✅ Account erfolgreich bestätigt!
</h2>

<p className="text-gray-300">
Du wirst automatisch zum Dashboard weitergeleitet...
</p>

</div>

</div>

);

}