
let form =document.getElementById("signup")
let button=document.getElementById("signup-login-button")

//signup data
button.addEventListener("click",(e)=>{
e.preventDefault();

let formdata={
    name:form.name.value,
    email:form.email.value,
    password:form.password.value,
    // role:form.role.value
}
console.log(formdata)
fetch("http://localhost:3656/user/register",{
    method:"POST",
   headers:{
    'Content-type':'Application/json'
   },
   body:
    JSON.stringify(formdata)
}).then((res)=>res.json()).then((res)=>{console.log(res),window.location.href="./login.html"})
.catch((err)=>console.log(err))
 

})
//login data

