document.querySelector(".add_user").addEventListener("click",(e)=>{
   let obj = {};
   obj.name = document.querySelector("#name").value;
   obj.email = document.querySelector("#email").value;
   obj.password = document.querySelector("#password").value;
   document.querySelector("#name").value = "";
   document.querySelector("#email").value = "";
   document.querySelector("#password").value = "";
   post_user(obj);
})


async function post_user(obj){
    let role = sessionStorage.getItem("role");
    if(role==!"Admin"){
        alert("You are not authorised");
        return;
    }
    let res = await fetch("https://chatpointbackend2-production.up.railway.app/admin/create",{
        method:"POST",
       headers:{
        'Content-type':'Application/json'
       },
       body:
        JSON.stringify(obj)
    });

    let data = await res.json();

    if(data == "Admin Added Succesfully"){
        alert("User Added");
        window.location.href = "admin.html";
    }
    else {
        alert(data);
    }

}