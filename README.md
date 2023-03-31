<h1>CHAT POINT - A REAL TIME CHAT APPLICATION</h1>

<h2>Chat point allow users to communicate with each other in real time through text.<h2>

<h2>Login and signup page (fw23_0771)</h2>

![Screenshot (171)](https://user-images.githubusercontent.com/115460277/228595398-e6cd1d59-b4f7-48d1-8043-73b35de01282.png)

![Screenshot (172)](https://user-images.githubusercontent.com/115460277/228595466-af683247-76be-4c7e-8823-07b1f3719fcf.png)

Admin Side Routes

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
/user/register (pass in body name,email,password)

For login (Post Request)
/user/login (pass in body email,password)

For logout (Get Request)
/user/logout (pass the token in headers)

To generate new token (Get Request)
/user/newtoken (pass the refresh token in headers)
