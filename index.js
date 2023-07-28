var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const path = require("path");
const { request } = require("http");
const { time } = require("console");


const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// connectivity with db
mongoose.connect('mongodb://127.0.0.1:27017/alumniportal', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));
// below code is for navigating the pages
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));


app.use('/public', express.static('public'));
// app.use('/images', express.static('images'));
console.log(__dirname);

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Create a schema for the form data
const FormDataSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String,
    coursename: String,
    yearenrolled: String,
    inprofileurl: String,
    password: String,
    username: String,
});

// Create a model for the form data
const FormData = mongoose.model("FormData", FormDataSchema);

// ------------------------------------------------------------------------------------------------------------------

// Route for displaying the form
app.get("/", (req, res) => {
    console.log('requested home.hbs')
    res.render("home.hbs");
});

app.get("/home", (req, res) => {
    console.log("requested home.hbs")
    res.render("home.hbs");
});

app.get("/login", (req, res) => {
    console.log("requested login_signup.hbs")
    res.render("login");
});

app.get("/signup", (req, res) => {
    console.log("requested signup.hbs")
    res.render("signup");
});

app.get("/thankyou_page", (req, res) => {
    console.log("requested thankyou_page.hbs")
    res.render("thankyou_page");
});
app.get("/profile", (req, res) => {
    console.log("requested profile.hbs")
    res.render("profile");
});
// app.get("/login_after_signup", (req, res) => {
//     console.log("requested login_after_signup.hbs")
//     res.render("login_after_signup");
// });


// Route for submitting the form data
app.post("/submit", async (req, res) => {
    try {
        // Create a new FormData instance with the submitted data
        const formData = new FormData({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            coursename: req.body.coursename,
            yearenrolled: req.body.yearenrolled,
            inprofileurl: req.body.inprofileurl,
            password: req.body.password,
            username: req.body.username,
        });

        // Save the form data to MongoDB using async/await
        await formData.save();
        res.redirect("/table");
    } catch (error) {
        console.error(error);
        res.send("An error occurred while saving the form data.");
    }
});

// Route for displaying the table with the form data
app.get("/table", async (req, res) => {
    try {
        // Retrieve all form data from MongoDB using async/await
        const formData = await FormData.find({});
        res.render("table", { formData });
    } catch (error) {
        console.error(error);
        res.send("An error occurred while retrieving the form data.");
    }
});

// Start the server
const port = 3001;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


// below code is for login and signup
app.post("/sign_up", (req, res) => {
    console.log(req.body);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var coursename = req.body.coursename;
    var yearenrolled = req.body.yearenrolled;
    var inprofileurl = req.body.inprofileurl;
    var password = req.body.password;
    var username = req.body.username;

    // console.log(name);

    var data = {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "inprofileurl": inprofileurl,
        "password": password,
        "coursename": coursename,
        "yearenrolled": yearenrolled,
        "username": username
    };

    db.collection('formdatas').insertOne(data, (err, collection) => {
        if (err) {
            throw err;
        }
        console.log("Record Inserted Successfully");
    });

    return res.redirect('/login');

});

app.post('/login', async (req, res) => {
    try {
        const check = await db.collection('signup').findOne({ username: req.body.username });
        if (check && check.password === req.body.password) {

            res.redirect("/profile");
        } else {
            res.send("Incorrect password.");
        }
    } catch (error) {
        console.log(error);
        res.send("Wrong details.");
    }
});
// app.get("/",(req,res)=>{
//     res.set({
//         "Allow-access-Allow-Origin": '*'
//     });
//     return res.redirect('/home.hbs');
// }).listen(3000);
app.listen(3000)
console.log("Listening on PORT 3000");
