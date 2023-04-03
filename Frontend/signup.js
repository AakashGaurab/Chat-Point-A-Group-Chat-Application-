
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
fetch("https://chatpointbackend2-production.up.railway.app/user/register",{
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


/* *****************************google login part ****************************** */


document.querySelector("#login-with-google").addEventListener("click",async()=>{
    let data = await fetch("https://chatpointbackend2-production.up.railway.app/auth/google")
})


/* ***********************************Login as Admin********************************* */



document.querySelector("#admin-login-button").addEventListener("click",async(event)=>{
    event.preventDefault()
    let formdata={
        email:form.email.value,
        password:form.password.value,
        // role:form.role.value 
    }
    console.log(formdata);
    let res = await fetch("https://chatpointbackend2-production.up.railway.app/admin/read");
    let data = await res.json();
    console.log(data);
    let flag = false;
    for (let i=0;i<data.length;i++){
        if(data[i].email==formdata.email){
            flag=true;
            break;
        }
    }

    if(flag){
        window.location.href = "./admin.html";
    }
    else {
        alert("Wrong Credentials");
    }
})
