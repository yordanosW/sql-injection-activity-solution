const sqlite3 = require('sqlite3').verbose();
const http = require('http'),
	path = require('path'),
	express = require('express'),
	bodyParser = require('body-parser');


const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())




const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('ss', 'ss', 'ss')");
});




app.get('/', function (req, res) {
	res.sendFile('index.html');
});




app.post('/login', function (req, res) {
	const username = req.body.username;
	const password = req.body.password;


	// Your goal as a white hat hacker is to send a malicious query that will trick the user into thinking they are really logged in when they aren't, all
	// the while "injecting" SQL statements to the database to manipulate it for evil doings. 


	// This is the legitimate query that is run in the backend (how depends on the specific programming language ecosystem and framework being used)
	// when the user enters their username and password in the form, as is normally done with apps using a SQL DBMS:


	const query = "SELECT title FROM user where username = '" + username + "' and password = '" + password + "'";


	// Keep in mind that allowing a string to be passed directly into your database like this as a parameter in a route handler,
	// especially if it's not set up as a prepared statement first, is NOT a good way to make SQL queries for production because it makes your app extremely vulnerable.
	// It's only for coding in development mode, your own non-commercial portfolio projects, or for a demo like this.

	// This is the exact input that will achieve the result when entered in the username field and the correct password is used: unknown' OR '1'='1
	
	// When the user has a successful login even though they've entered these malicious characters rather than the correct username, you'll know your hack has been a success!


	// console.log("username: " + username);
	// console.log("password: " + password);
	// console.log('query: ' + query);

	db.get(query, function (err, row) {
		if (err) {
			console.log('ERROR', err);
			res.redirect("/index.html#error");
			res.send('There\'s been an error')
		} else if (!row) {
			res.redirect("/index.html#unauthorized");
		} else {
			res.send('Login successful');


			// NOTES:
			// 1. To fully experience how SQL Injection works with this awesome Graded Activity, you need to replace the long malicious attack code (shown below) with 'Login successful'(as shown on line 69 above).
			// so that you can see the user log in even with the incorrect input (since as the hacker you'll have entered unknown' OR '1'='1 to freak out the SQL mechanism).


			// This is the code from the activity you're replacing (on line 69):
			// "Hello <b>" +; row.title + '!</b><br /> This file contains all your secret data: <br /><br /> SECRETS <br /><br /> MORE SECRETS <br /><br /> <a href="/index.html">Go back to login</a>'


			// 2. If you run into any weird errors that pop up even if you've had the app run correctly before, try deleting the package-lock.json file and the node_modules folder then run npm install again


		}
	});


});


app.listen(3000, function () {
	console.log("express is listening on port 3000");
}); ``


