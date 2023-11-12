# ``Login``

## Overview

The log in app is a meshing of javascript, swift, and sqlite. I Usesed Node to create all of the fetcch reqests that you see in this project. The swift was used to create the log in app you see. 

## user guide
   the log in button and sign up button allow a user to log in and sign up.
   the admin login allows a admin user to log in.
   
### login  
  ```mermaid

     ---
  title: User logging in
  ---


  flowchart LR


      A[Login] --> |post| B{vilidate}  --> |true| C(next page) 

  B --> |false| D[user message]



  D ----> |reset| A

 ```
 
### sign up  
  ```mermaid
  ---
  title: User signing up
  ---


  flowchart LR


      A[Sign up] --> |post| B{dose user exsist}  --> |false| C(next page) 

  B --> |true| D[user message]



  D ----> |reset| A

  ```
## admin login  
 
  ```mermaid

     ---
  title: Admin user logging in
  ---


  flowchart LR


      A[Login] --> |post| B{vilidate}  --> |true| C(admin page) 

  B --> |false| D[user message]



  D ----> |reset| A

 ```
 
 
 
## Permisions

| Permission           	| Basic 	| Admin 	|
|----------------------	|-------	|-------	|
| Create               	| ✓     	| ✓     	|
| Soft Remove          	| ✓     	| ✓     	|
| Hard Remove          	|       	| ✓     	|
| recover              	|       	| ✓     	|
| vue all accounts     	|       	| ✓     	|
| set account name     	| ✓     	| ✓     	|
| set account username 	| ✓     	| ✓     	|
| set account password 	| ✓     	| ✓     	|

------

## how to

### links


[log in](https://login-api.malcolm69.repl.co/login)
[sign up](https://login-api.malcolm69.repl.co/signup)
[soft remove](https://login-api.malcolm69.repl.co/remove)
[rename Username](https://login-api.malcolm69.repl.co/renameUsername)
[rename Password](https://login-api.malcolm69.repl.co/renamePassword)
[aply name](https://login-api.malcolm69.repl.co/aplyName)
[aply Icon](https://login-api.malcolm69.repl.co/aplyIcon)
[get my Account](https://login-api.malcolm69.repl.co/getmyAccount)

this url woukd look like /user/{a users username} [getting an account](https://replit.com/@malcolm69/login-api#index.js/user/:username) 

https://replit.com/@malcolm69/login-api#index.js


----
[admin log in](https://login-api.malcolm69.repl.co/admin/login)

[admin set first name](https://login-api.malcolm69.repl.co/admin/fname) & [admin set last name](hhttps://login-api.malcolm69.repl.co/admin/lname)

[admin change username](https://login-api.malcolm69.repl.co/admin/username)

[admin soft remove](https://login-api.malcolm69.repl.co/admin/soft/remove)

[admin hard remove](https://login-api.malcolm69.repl.co/admin/hard/remove)

[admin account restoring](https://login-api.malcolm69.repl.co/admin/restore)

[admin accout create](https://login-api.malcolm69.repl.co/admin/create)

#### note 
   admin accounts can not sign up. In order for ther to be a new admin account created a abmin user has to either move a basic account to the admin statise or create a new account. accounts that are boosted are not subjected to reg-exp conditions. 
    
    
## code guide

### basic commands
login 
```shell
curl -X POST https://login-api.malcolm69.repl.co/login -H "Content-Type: application/json" -d "{\"username\": \"a\", \"password\": \"b\"}"
```

signup
```shell
curl -X POST https://login-api.malcolm69.repl.co/signup -H "Content-Type: application/json" -d "{\"username\":\"a\", \"password\": \"a\"}"
```

soft remove
```shell 
curl -X POST https://login-api.malcolm69.repl.co/remove -H "Content-Type: application/json" -d "{\"username\": \"a\", \"password\": \"b\"}"
```

re-setting username
```shell 
curl -X POST https://login-api.malcolm69.repl.co/renameUsername -H "Content-Type: application/json" -d "{\"username\": \"a\", \"new_username\": \"b\"}"
```

re-setting password
```shell 
curl -X POST https://login-api.malcolm69.repl.co/renamePassword -H "Content-Type: application/json" -d "{\"username\": \"a\", \"new_password\": \"b\"}"
```

aplying or changing a name 
```shell 
curl -X POST https://login-api.malcolm69.repl.co/aplyName -H "Content-Type: application/json" -d "{\"username\": \"a\", \"fname\": \"b\", \"lname\": \"b\"}"
```


aplying or changing a icon 
```shell 
# the url and ImageNumber are optinal. you may post a url or a ImageNumber 
curl -X POST https://login-api.malcolm69.repl.co/aplyIcon -H "Content-Type: application/json" -d "{\"username\": \"a\", \"url\": \"b\", \"ImageNumber\": \"b\"}"
```

aplying or changing a icon 
```shell 
# the url and ImageNumber are optinal. you may post a url or a ImageNumber 
curl -X POST https://login-api.malcolm69.repl.co/aplyIcon -H "Content-Type: application/json" -d "{\"username\": \"a\", \"url\": \"b\", \"ImageNumber\": \"b\"}"
```

getting a user by there username
```shell 
curl -X GET https://login-api.malcolm69.repl.co/user/a
```
----
### admin commands

admin login 
```shell
curl -X POST https://login-api.malcolm69.repl.co/admin/login -H "Content-Type: application/json" -d "{\"username\": \"a\", \"password\": \"b\"}"
```

aplying or changing the first name 
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/fname -H "Content-Type: application/json" -d "{\"username\": \"a\", \"fname\": \"b\"}"
```

aplying or changing the last name 
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/lname -H "Content-Type: application/json" -d "{\"username\": \"a\", \"lname\": \"b\"}"
```

re-setting username
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/username -H "Content-Type: application/json" -d "{\"username\": \"a\", \"new_username\": \"b\"}"
```

soft remove
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/soft/remove -H "Content-Type: application/json" -d "{\"your_username\": \"a\", \"your_password\": \"b\", \"other_username\": \"b\"}"
```

hard remove
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/hard/remove -H "Content-Type: application/json" -d "{\"your_username\": \"a\", \"your_password\": \"b\", \"other_username\": \"b\"}"
```

restore 
```shell 
curl -X POST https://login-api.malcolm69.repl.co/admin/restore -H "Content-Type: application/json" -d "{\"your_username\": \"a\", \"your_password\": \"b\", \"other_username\": \"b\"}"
```


admin account creator
```shell
# type should be either basic or admin
curl -X POST https://login-api.malcolm69.repl.co/signup -H "Content-Type: application/json" -d "{\"username\":\"a\", \"password\": \"a\", \"type\": \"a\"}"
```

getting a user by there username for admin
```shell 
curl -X GET https://login-api.malcolm69.repl.co/user_admin/{}/
```


## given images

<img src="images/1.svg" alt="1" width="100" height="100">
<img src="images/2.svg" alt="2" width="100" height="100">
<img src="images/3.svg" alt="3" width="100" height="100">
<img src="images/4.svg" alt="4" width="100" height="100">
<img src="images/5.svg" alt="5" width="100" height="100">
<img src="images/6.svg" alt="6" width="100" height="100">
<img src="images/7.svg" alt="7" width="100" height="100">
<img src="images/8.svg" alt="8" width="100" height="100">
<img src="images/9.svg" alt="9" width="100" height="100">
<img src="images/10.svg" alt="10" width="100" height="100">
<img src="images/11.svg" alt="11" width="100" height="100">
<img src="images/12.svg" alt="12" width="100" height="100">
<img src="images/13.svg" alt="13" width="100" height="100">

