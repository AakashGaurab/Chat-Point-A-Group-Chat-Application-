
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

fetch("https://chatpointbackend2-production.up.railway.app/user/register",{
    method:"POST",
   headers:{
    'Content-type':'Application/json'
   },
   body:
    JSON.stringify(formdata)
}).then((res)=>res.json()).then((res)=>{alert(res.msg),window.location.href="./login.html"})
.catch((err)=>alert(err))
 

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
    
    let res = await fetch("https://chatpointbackend2-production.up.railway.app/admin/read");
    let data = await res.json();
    console.log(data);
    let flag = false;
    for (let i=0;i<data.length;i++){
        if(data[i].email==formdata.email && data[i].role=="Admin"){
            flag=true;
            break;
        }
    }

    if(flag){
        window.location.href = "./admin.html";
        sessionStorage.setItem("role","Admin");
    }
    else {
        alert("Wrong Credentials");
    }
})
