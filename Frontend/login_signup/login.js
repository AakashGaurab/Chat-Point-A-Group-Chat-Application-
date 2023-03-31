
let form =document.getElementById("login")

let button=document.getElementById("login-login-button");

button.addEventListener("click",(event)=>{
    event.preventDefault()
    let formdata={
        email:form.email.value,
        password:form.password.value,
        // role:form.role.value 
    }
    console.log(formdata)
    fetch("http://localhost:3656/user/login",{
        method:"POST",
       headers:{
        'Content-type':'Application/json'
       },
       body:
        JSON.stringify(formdata)
    }).then((res)=>res.json()).then((res)=>{console.log(res);
    location.href="./signup.html"}).catch((err)=>console.log(err))
    
    })