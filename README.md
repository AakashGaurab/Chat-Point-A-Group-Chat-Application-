<h2>CHAT POINT - A REAL TIME CHAT APPLICATION</h2>

<p>Chat Point is a user-friendly platform that allows individuals to communicate with each other in real-time via text-based messaging. It offers various features, such as the ability to create groups. 
  
The application is available across different platforms, including mobile and desktop, and provides a seamless and secure communication experience. With its intuitive interface and robust functionality, your chat application aims to simplify communication and enhance social connectivity.</p>

<h2>Deployment</h2>  
    <p>Front-End: https://incredible-selkie-67b697.netlify.app/signup.html</p>   
    <p>Back-End: https://chatpointbackend2-production-56db.up.railway.app/</p>
    
<h2>Technology we used</h2>
  
 <ul>
     <li>HTML</li>
     <li>CSS</li>
     <li>JavaScript</li>
     <li>MongoDB</li>  
     <li>Node JS</li>
     <li>Express JS</li>
</ul>
    
  <h2>Our Team Members<h2>
     <ul> 
     <li>Aakash Gaurab</li>
     <li>Vipin Kumar</li>
     <li>Shradha Vastrakar</li>
     <li>Parimal Paramanik</li>  
     <li>Rahul Gupta</li>
    </ul>
    
  
<h2>Login and Signup page (fw23_0771)</h2>

![Screenshot (171)](https://user-images.githubusercontent.com/115460277/228595398-e6cd1d59-b4f7-48d1-8043-73b35de01282.png)

![Screenshot (172)](https://user-images.githubusercontent.com/115460277/228595466-af683247-76be-4c7e-8823-07b1f3719fcf.png)

<!-- <h2>Chat Page</h2>

![Screenshot (172)](https://github.com/AakashGaurab/responsible-stomach-8778/blob/main/Chat.png)

![Screenshot (172)](https://github.com/AakashGaurab/responsible-stomach-8778/blob/main/Entry.png) -->


<h2>Admin Page</h2>

![Screenshot (172)](https://github.com/AakashGaurab/responsible-stomach-8778/blob/main/Admin.png)

<!-- Admin Side Routes

Get all users (get Request)
/admin/read

Create New Admin (post Request)
/admin/create (pass in body name, email, password)

update a user from user role to admin (Put Request)
/admin/update (pass in body email of the user)

delete a user (delete Request)
/admin/delete (pass in body email of the user)

User side Routes

To welcome user (Get Request)
/user/

To register or signup (Post Request)
/user/register (pass in body name, email, password)

For login (Post Request)
/user/login (pass in body email, password)

For logout (Get Request)
/user/logout (pass the token in headers)

To generate new token (Get Request)
/user/newtoken (pass the refresh token in headers) -->
    
    Admin Side Routes:

<li>Get all users: GET /admin/read</li>
<li>Create new admin: POST /admin/create (with name, email, and password in the request body)</li>
<li>Update a user from user role to admin: PUT /admin/update (with email of the user in the request body)</li>
<li>Delete a user: DELETE /admin/delete (with email of the user in the request body)</li>

    User Side Routes:

<li>Welcome user: GET /user/</li>
<li>Register or sign up: POST /user/register (with name, email, and password in the request body)</li>
<li>Login: POST /user/login (with email and password in the request body)</li>
<li>Logout: GET /user/logout (with the token in the request headers)</li>
<li>Generate new token: GET /user/newtoken (with the refresh token in the request headers)</li>
    
    
Deployed Backend Link: https://chatpointbackend2-production-56db.up.railway.app/

Deployed Frontend Link: https://incredible-selkie-67b697.netlify.app/signup.html


