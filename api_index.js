// npm install sqlite3 bcrypt ejs express express-session sequelize

const parts = {
	Basic_Account,
	Admin_Account
} = require("./databace.js")

const fs = require('fs')



var express = require("express"),
	session = require("express-session"),
	ejs = require('ejs'),
	app = express(),

	sessionMiddleware = session({
		secret: 'mysecret',
		resave: true,
		saveUninitialized: true
	});


app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);


const Admin = new Admin_Account()
const Basic = new Basic_Account()


app.get('/', (req, res) => {
   let {username, loged_in} = req.session
	res.render("homePage", {
		error: {
			message: ""
		},
		username: username,
		loged_in: loged_in
	})

})


app.post("/login", async (req, res) => {
	var { username, password } = req.body //|| //JSON.parse(Object.keys(req.body)[0])

	if (username == undefined || password == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 password =  JSON.parse(Object.keys(req.body)[0]).password
	}
	
	if (username == undefined || password == undefined) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}


	let bool = await Basic.validate(username, password)

	let del = await Basic.isDeleted(username)

	if (bool) {
		res.json([{
			valid: true,
			message: "you have logged in",
		}])
	} else {
		//if( bool && ! )
		if (del) {
			res.json([{
				valid: false,
				message: "this account has been removed"

			}])
		} else {
			res.json([{
				valid: false,
				message: "this account does not exist or the password was incorect"
			}])
		}
	}

})



app.post("/signup", async (req, res) => {
	var { username, password } =  req.body 

	if (username == undefined || password == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 password =  JSON.parse(Object.keys(req.body)[0]).password
	}

	
	if (username == undefined || password == undefined && (username.length > 0 || password.length > 0)) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}


	let bool = await Basic.account(username)
	let del = await Basic.isDeleted(username)

	if (del) {
		res.json([{
			valid: false,
			message: "this account has been removed"

		}])
	} else if (bool) {
		res.json([{

			valid: false,
			message: "this account already exists or the password was incorect"

		}])
	} else {
		let i = await Basic.create(username, password)

		res.json([{
			valid: true,
			message: "this account has been secsesfull created"
		}])
	}
})

app.post("/remove", async (req, res) => {
	var { username, password } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

	if (username == undefined || password == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 password =  JSON.parse(Object.keys(req.body)[0]).password
	}

	
	if (username == undefined || password == undefined) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}

	let bool = await Basic.account(username)
	let del = await Basic.isDeleted(username)

	if (bool) {
		let i = await Basic.remove(username, password)


		if (!i) {
			res.json([{
				valid: true,
				message: "This account was unable to be removed"
			}])
		} else if (i) {
			res.json([{
				valid: true,
				message: "This account has been successfully removed. You may recover it whenever."
			}])
		} else if (del) {
			res.json([{
				valid: false,
				message: `the account has been deleted`

			}])
		} else {
			res.json([{
				valid: true,
				message: "This account was unable to be removed"
			}])
		}
	}else{
		res.json([{
				valid: true,
				message: "This account dose not exsist"
			}])
	}
})


app.post('/renameUsername', async (req, res) => {
	var { username, new_username } =  req.body// || JSON.parse(Object.keys(req.body)[0])

	if (username == undefined || new_username == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 new_username =  JSON.parse(Object.keys(req.body)[0]).new_username
	}

	
	if (username == undefined || new_username == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}

	if (username.trim() == new_username.trim()) {
		res.json([{
			valid: false,
			message: "you can not set your username to your current username"
		}])

		return;
	}

	let bool = await Basic.account(new_username)

	let del = await Basic.isDeleted(username)

	if (bool) {
		res.json([{
			valid: false,
			message: "an account with that username alredy exists."
		}])
	} else if (del) {
		res.json([{
			valid: false,
			message: "this account has been removed"

		}])
	} else {
		let ans = await Basic.update_username(username, new_username)

		if (!ans) {
			res.json([{
				valid: false,
				message: "this account was unable to be changed, try again later"
			}])
		} else {
			res.json([{
				valid: true,
				message: `your account was named from ${username} to ${new_username}`
			}])
		}
	}

})


app.post('/renamePassword', async (req, res) => {
	var { username, new_password } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

		if (username == undefined || new_password == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 new_password =  JSON.parse(Object.keys(req.body)[0]).new_password
	}

	
	if (username == undefined || new_password == undefined) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}



	let bool = await Basic.account(username)

	let del = await Basic.isDeleted(username)


	if (bool) {
		let ans = await Basic.update_password(username, new_password)

		if (!ans) {
			res.json([{
				valid: false,
				message: "this account was unable to be changed, try again later"
			}])
		} else {
			res.json([{
				valid: true,
				message: "your accounts password has been changed"
			}])
		}
	} else if (del) {
		res.json([{
			valid: false,
			message: "the account you are trying to rename has been deleted"

		}])
	} else {
		res.json([{
			valid: false,
			message: "the account you are trying to rename dose not exist"
		}])
	}

})

app.post('/aplyName', async (req, res) => {
	var { username, fname, lname } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

			if (username == undefined || fname == undefined || lname == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 fname =  JSON.parse(Object.keys(req.body)[0]).fname
				lname =  JSON.parse(Object.keys(req.body)[0]).lname
	}
	
	if (username == undefined || fname == undefined || lname == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}



	let bool = await Basic.account(username)

	let del = await Basic.isDeleted(username)

	if (bool) {
		let x = Basic.name(username, fname, lname)

		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${username}`

			}])
		} else {
			res.json([{
				valid: true,
				message: `the account ${username} now has the name ${fname} ${lname} applyed to it.`

			}])
		}

	} else {
		if (del) {
			res.json([{
				valid: false,
				message: `the account you are trying to rename has been deleted`

			}])
		} else if (!bool) {
			res.json([{
				valid: false,
				message: `the account you are trying to rename dose not exist`

			}])
		}
	}
})



app.post('/aplyIcon', async (req, res) => {
	var { username, url, ImageNumber } =  req.body //|| JSON.parse(Object.keys(req.body)[0])


			if(username == undefined || url == undefined || ImageNumber == undefined ){
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 url =  JSON.parse(Object.keys(req.body)[0]).url
				ImageNumber =  JSON.parse(Object.keys(req.body)[0]).ImageNumber
	}
	
	let bool = await Basic.account(username)

	let del = await Basic.isDeleted(username)

	if (ImageNumber != undefined) {

		let buf = fs.readFileSync(`./images/${ImageNumber}.svg`)



		url = 'http://data:image/svg+xml;base64,' + buf.toString('base64');



	}

	if (bool) {
		let x = await Basic.icon(username, url, ImageNumber || null)
		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${username}`

			}])
		} else {
			res.json([{
				valid: true,
				message: `the account ${username} now has an icon.`

			}])
		}

	} else {
		if (del) {
			res.json([{
				valid: false,
				message: `the account you are trying to rename has been deleted`

			}])
		} else {
			res.json([{
				valid: false,
				message: `the account you are trying to rename dose not exist`

			}])
		}
	}

})



//Request URL: http://localhost:3000/user/34/books/8989
app.get('/user/:username', async (req, res) => {
	let { username } = req.params

	let bool = await Basic.account(username)

	let del = await Basic.isDeleted(username)



	if (bool) {
		let a = await Basic.getAccount(username)

		let { id, firstName, lastName, email, iconid, type, createdAt, updatedAt } = a

		if (a == null) { } else {
			res.json([{
				valid: true,

				id: id,
				firstName: firstName || "",
				lastName: lastName || "",
				email: email || "",
				username: username || "",
				icon: iconid || 0,
				type: type || "",
				createdAt: createdAt.toString() || "",
				updatedAt: updatedAt.toString() || ""


			}])

		}

	} else if (del) {

	} else {

	}

})

app.get('/user_admin/:username/', async (req, res) => {
	let { username } = req.params

	
	let bool = await Admin.account(username)

	let del = await Admin.isDeleted(username, "admin")


	if (bool) {
		let all = await Admin.getAll()




		if (all == null) { } else {
			let arr = []
			all.forEach((a, i) => {
				let { id, firstName, lastName, email, username, iconid, type, createdAt, updatedAt, deletedAt } = a

				arr.push({
					userId: 1,
					id: id,
					valid: true,

					firstName: firstName == null ? "" : firstName,
					lastName: lastName == null ? "" : lastName,
					email: email == null ? "" : email,
					username: username == null ? "" : username,

					icon: iconid || "",

					type: type || "",

					createdAt: createdAt ? createdAt.toString() : "",
					updatedAt: updatedAt ? updatedAt.toString() : "",
					deletetAt: deletedAt ? deletedAt.toString() : ""


				})
			})


			res.json(arr)

		}

	} else if (del) {

	} else {

	}

})






app.post("/admin/login", async (req, res) => {
	var { username, password } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

	if (username == undefined || password == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 password =  JSON.parse(Object.keys(req.body)[0]).password
	}

	
	if (username == undefined || password == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}


	let bool = await Admin.validate(username, password)

	let del = await Admin.isDeleted(username, "admin")

	if (bool) {
		res.json([{
			valid: true,
			message: "you have logged in",
		}])
	} else {
		//if( bool && ! )
		if (del) {
			res.json([{
				valid: false,
				message: "this account has been removed"

			}])
		} else {
			res.json([{
				valid: false,
				message: "this account does not exist"
			}])
		}
	}

})

app.post('/admin/fname', async (req, res) => {
	var { username, fname, type } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

if (username == undefined || fname == undefined || type == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 fname =  JSON.parse(Object.keys(req.body)[0]).fname
	type =  JSON.parse(Object.keys(req.body)[0]).type
	}
	
	if (username == undefined || fname == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}



	let bool = await Basic.account(username)

	if (bool) {
		let x = await Admin.name(username, fname, false, type)


		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${username}`

			}])
		} else {
			let all = await Admin.getAll()

			res.json([{
				valid: true,
				message: `the account ${username} now has the name ${fname} applyed to it.`

			}])
		}






	} else {
		res.json([{
			valid: false,
			message: `that username is invalid`

		}])
	}




})

app.post('/admin/lname', async (req, res) => {
	var { username, lname, type } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

if (username == undefined || lname == undefined || type == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 lname =  JSON.parse(Object.keys(req.body)[0]).lname
	type =  JSON.parse(Object.keys(req.body)[0]).type
	}
	
	if (username == undefined || lname == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}



	let bool = await Basic.account(username)

	if (bool) {
		let x = await Admin.name(username, false, lname, type)


		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${username}`

			}])
		} else {
			let all = await Admin.getAll()

			res.json([{
				valid: true,
				message: `the account ${username} now has the last name ${lname} applyed to it.`

			}])
		}






	} else {
		res.json([{
			valid: false,
			message: `that username is invalid`

		}])
	}




})

app.post('/admin/username', async (req, res) => {
	var { username, new_username } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

if (username == undefined || new_username == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
		 new_username =  JSON.parse(Object.keys(req.body)[0]).new_username
	}
	
	if (username == undefined || new_username == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}



	let bool = await Basic.account(username)

	if (bool) {
		let x = await Admin.update_username(username, new_username)


		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${username}`

			}])
		} else {

			res.json([{
				valid: true,
				message: `the account ${username} now has the username of ${new_username} `

			}])
		}






	} else {
		res.json([{
			valid: false,
			message: `that username is invalid`

		}])
	}




})



app.post('/admin/soft/remove', async (req, res) => {
	var { your_username, your_password, other_username } =  req.body || JSON.parse(Object.keys(req.body)[0])

	if (your_username == undefined || your_password == undefined || other_username == undefined)  {
	 your_username =  JSON.parse(Object.keys(req.body)[0]).your_username
	your_password =  JSON.parse(Object.keys(req.body)[0]).your_password
	other_username =  JSON.parse(Object.keys(req.body)[0]).other_username

	}

	if (your_username == undefined || your_password == undefined || other_username == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}

	let del = await Admin.isDeleted(other_username, "basic")


	if (!del) {
		let x = await Admin.soft_remove(your_username, your_password, other_username)


		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${other_username}`

			}])
		} else {

			res.json([{
				valid: true,
				message: "this account has been softly removed"

			}])
		}

	} else {
		res.json([{
			valid: false,
			message: `that username is invalid`

		}])
	}




})

app.post('/admin/hard/remove', async (req, res) => {
	var { your_username, your_password, other_username } =  req.body || JSON.parse(Object.keys(req.body)[0])

	if (your_username == undefined || your_password == undefined || other_username == undefined)  {
	 your_username =  JSON.parse(Object.keys(req.body)[0]).your_username
	your_password =  JSON.parse(Object.keys(req.body)[0]).your_password
	other_username =  JSON.parse(Object.keys(req.body)[0]).other_username

	}
	

	if (your_username == undefined || your_password == undefined || other_username == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}



	let x = await Admin.hard_remove(your_username, your_password, other_username)


	if (!x) {
		res.json([{
			valid: false,
			message: `something went wrong with the account ${username}`

		}])
	} else {

		res.json([{
			valid: true,
			message: "this account has been permenitly removed"

		}])
	}
})

app.post('/admin/restore', async (req, res) => {
	var { your_username, your_password, other_username } =  req.body || JSON.parse(Object.keys(req.body)[0])

	if (your_username == undefined || your_password == undefined || other_username == undefined)  {
	 your_username =  JSON.parse(Object.keys(req.body)[0]).your_username
	your_password =  JSON.parse(Object.keys(req.body)[0]).your_password
	other_username =  JSON.parse(Object.keys(req.body)[0]).other_username

	}
	

	if (your_username == undefined || your_password == undefined || other_username == undefined) {
		res.json([{
			valid: false,
			username: "you must input peramaters for this to work"
		}])

		return;
	}

	let del = await Admin.isDeleted(other_username, "basic")


	if (del) {
		let x = await Admin.restore(other_username, your_username, your_password)


		if (!x) {
			res.json([{
				valid: false,
				message: `something went wrong with the account ${other_username}`

			}])
		} else {

			res.json([{
				valid: true,
				message: "this account has been softly removed"

			}])
		}

	} else {
		res.json([{
			valid: false,
			message: `this account can not be restored because it has not been deleted`

		}])
	}




})


app.post("/admin/create", async (req, res) => {
	var { username, password, type } =  req.body //|| JSON.parse(Object.keys(req.body)[0])

		if (username == undefined || password == undefined || type == undefined) {
	 username =  JSON.parse(Object.keys(req.body)[0]).username
	password =  JSON.parse(Object.keys(req.body)[0]).password
	type =  JSON.parse(Object.keys(req.body)[0]).type

	}

	
	if (username == undefined || password == undefined) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}

	let a = await Admin.validate(username, password)
	let b = await Basic.validate(username, password)

	let reg = (/[a-zA-Z0-9!@#$%^&*]{6,16}$/)

	if (!reg.test(password) && type == "admin") {
		res.json([{
			valid: false,
			message: "the given password dose not match the given values"
		}])

		return;
	}

	if (!a && !b) {
		let del = await Admin.isDeleted(username, type)

		if (del) {
			res.json([{
				valid: false,
				message: "this account has been removed"

			}])
		} else {
			let i = await Admin.create(username, password, type)


			res.json([{
				valid: true,
				message: "this account has been secsesfull created"
			}])
		}

	} else {
		res.json([{
			valid: false,
			message: "this account already exists"

		}])
	}

})





/*
app.post("/admin/restore", async (req, res) => {
	var { username, you_username, you_password } = JSON.parse(Object.keys(req.body)[0])


	if (username == undefined || you_username == undefined || you_password == undefined) {
		res.json([{
			valid: false,
			message: "you must input peramaters for this to work"
		}])

		return;
	}

	let bool = await Admin.account(you_username)
	let del = await Admin.isDeleted(you_username, "basic")

	if (bool) {
		let i = await Admin.restore(username, you_username, you_password)


		if (!i) {
			res.json([{
				valid: false,
				message: "This account was unable to be restored"
			}])
		} else if (i) {
			res.json([{
				valid: true,
				message: "This account has been successfully restored"
			}])
		} else if (!del) {
			res.json([{
				valid: false,
				message: `the account has not been restored`

			}])
		} else {
			res.json([{
				valid: false,
				message: "This account was unable to be restored"
			}])
		}
	}

})
*/

app.listen(3000, () => {
	console.log('Server started on port 3000');
});
