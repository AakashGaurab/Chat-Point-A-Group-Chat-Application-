let res_data ;


async function get_all_user(){
    let data = await fetch("http://localhost:3656/admin/read").then(response => response.json())
    .then(data => {
      // Handle the data
      return data;
    });
    //console.log(data);
    res_data = data;
    display(data);
}

get_all_user();

/* ************************display Function ************************* */

function display(data){
  document.querySelector(".main_body").innerHTML=`<div>
  <div class="name">Name</div>
  <div class="role">User Role</div>
  <div class="actions">Actions</div>
 </div>`;

  data.forEach(element => {
    let div1 = document.createElement("div");
    let p2 = document.createElement("p");
    p2.innerText = element.name;
    div1.append(p2);
    let div2 = document.createElement("div");
    let p = document.createElement("p");
    p.innerText = element.role;
    div2.append(p);
    let div3 = document.createElement("div");

    let del = document.createElement("button");
    del.innerText = "Delete User";
    del.addEventListener("click",()=>{
      delete_user(element.email);
    })
    let add = document.createElement("button");
    add.innerText = "Update To Admin";
    add.addEventListener("click",()=>{
      add_admin(element);
    })

    div3.append(add,del);
    let div = document.createElement("div");
    div.append(div1,div2,div3);
    document.querySelector(".main_body").append(div);
  });

}

/* *************************Search Functionality******************************** */

document.querySelector(".search").addEventListener("click",()=>{
  let value = document.querySelector(".search_text").value;
  if(value == ""){
    display(res_data);
  }
  else {
    find(value);
  }
  
  document.querySelector(".search_text").value = "";
})

function find(name){
  let filtered_data = res_data.filter((el) => el.name.toLowerCase().includes(name.toLowerCase()));
  display(filtered_data);
}


/* *************************************************************************** */


async function delete_user(email){
  let obj = {};
  obj.email = email;
  console.log(email);
  let data = await fetch("http://localhost:3656/admin/delete",{
    method:"Delete",
    headers:{
      'Content-type':'Application/json'
    },
    body:JSON.stringify(obj)
  })
  .then(response => response.json())
  .then(data => {return data;});

if(data == "User Removed from Data Base"){
  get_all_user();
}
else {
  alert(data)
}

}



/* ****************Role Update ****************************** */

async function add_admin(element){
  let obj = {};
  obj.email = element.email;
  let response = await fetch("http://localhost:3656/admin/update",{
    method:"PUT",
    headers:{
      'Content-type':'Application/json'
    },
    body:JSON.stringify(obj),
  });

  let data = await response.json();

  if(data == "User Updated To admin"){
      get_all_user();
  }
  else {
      alert(data);
  }
}



/* **************************************************************** */


document.querySelector(".add_user").addEventListener("click",()=>{
  window.location.href = "admin_add.html";
})
