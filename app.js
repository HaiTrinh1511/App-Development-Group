const express = require("express");
const engines = require("consolidate");
const { body } = require("express-validator");
const app = express();
var fs = require("fs");
var session = require("express-session");
// run library session
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

var bodyParser = require("body-parser");
const { finished } = require("stream");
const { ObjectID } = require("mongodb");
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));

// npm i handlebars consolidate --save
app.engine("hbs", engines.handlebars);
app.set("views", "./views");
app.set("view engine", "hbs");

app.set("trust proxy", 1);

// ------------------------------------- KET NOI DATABASE  ----------------------------
var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://huyphansy226:huyphansy226@cluster0.es2eh.mongodb.net/test";

async function getMongoClient() {
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  return dbo;
}

// ------------------------------- ADMIN PAGE  ---------------------------

//-------------------------------- HOMEPAGE -----------------------------
app.get("/", async function (req, res) {
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("admin").find({}).toArray(); // print product in product table
  res.render("index", { model: result });
});

// -------------------------------- DELETE ACCOUNT ----------------------------

// trainer
app.get("/removetrainer", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("trainer").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewtrainer");
});

// staff
app.get("/removestaff", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("staff").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewtrainingstaff");
});

//  ----------------------------- ADMIN  -------------------------
app.get("/admin", function (req, res) {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  } else {
    res.render("admin", { user: userInfo });
  }
});

//home
app.get("/home", function (req, res) {
  res.render("home");
});

// -------------------------------- ADD ACCOUNT ----------------------------

//addtrainer(admin)
app.get("/addtrainer", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  } else {
    res.render("addtrainer", { user: userInfo });
  }
});

// trainer
app.post("/doAddTrainer", async (req, res) => {
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  if (inputPhone.length < 8) {
    let errorModel = {
      phoneError: "Phone number must contain at least 8 characters !",
    };
    res.render("addtrainer", { model: errorModel });
  } else {
    let newData = {
      firstname: inputfirstName,
      lastname: inputlastName,
      phone: inputPhone,
      email: inputEmail,
      password: inputPassword,
    };

    let client = await MongoClient.connect(url);
    let dbo = client.db("Training");
    await dbo.collection("trainer").insertOne(newData);
    res.redirect("/viewtrainer");
  }
});

//addtraningstaff(admin)
app.get("/addtrainingstaff", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  res.render("addtrainingstaff");
});

// DO INSERT TRAINING STAFF
app.post("/doAddStaff", async (req, res) => {
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  if (inputPhone.length < 8) {
    let errorModel = {
      phoneError: "Phone number must contain at least 8 characters !",
    };
    res.render("addtrainer", { model: errorModel });
  } else {
    let newData = {
      firstname: inputfirstName,
      lastname: inputlastName,
      phone: inputPhone,
      email: inputEmail,
      password: inputPassword,
    };
    let client = await MongoClient.connect(url);
    let dbo = client.db("Training");
    await dbo.collection("staff").insertOne(newData);
    res.redirect("/viewtrainingstaff");
  }
});

// ---------------------------------- DELETE ACCOUNT ------------------------------

// trainer
app.get("/removetrainer", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("trainer").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewtrainer");
});

// staff
app.get("/removestaff", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("staff").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewstaff");
});

// ---------------------------------  SEARCH ---------------------------

// Search staff
app.get("/doSearchStaff", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("staff")
    .find({ firstname: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewtrainingstaff", { model: result });
});

// Search trainer
app.get("/doSearchTrainer", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("trainer")
    .find({ firstname: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewtrainer", { model: result });
});

// -------------------------- VIEW ------------------------

//viewtrainer(admin)

app.get("/viewtrainer", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }

  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("trainer").find({}).toArray(); // print product in product table
  res.render("viewtrainer", { model: result });
});

//viewtrainingstaff(admin)
app.get("/viewtrainingstaff", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("staff").find({}).toArray();
  res.render("viewtrainingstaff", { model: result });
});

// -------------------------- UPDATE FUNCTION --------------------------------

// Get form update trainer by ID
app.get("/updatetrainer/:id", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo.collection("trainer").findOne({ _id: ObjectID(id) });
  res.render("update_trainer", { model: result });
});

// Do update trainer
app.post("/doUpdateTrainer", async (req, res) => {
  let id = req.body.id;
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  let newData = {
    firstname: inputfirstName,
    lastname: inputlastName,
    phone: inputPhone,
    email: inputEmail,
    password: inputPassword,
  };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("trainer")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });
  res.redirect("/viewtrainer");
});

// ---------------------- Update Staff ---------------------
// Get form update staff by ID
app.get("/updatestaff/:id", async (req, res) => {
  const userInfo = req.session.userInfo;
  if (!userInfo) {
    res.redirect("/adminlogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo.collection("staff").findOne({ _id: ObjectID(id) });
  res.render("update_staff", { model: result });
});

// Do update trainer
app.post("/doUpdateStaff", async (req, res) => {
  let id = req.body.id;
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  let newData = {
    firstname: inputfirstName,
    lastname: inputlastName,
    phone: inputPhone,
    email: inputEmail,
    password: inputPassword,
  };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("staff")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });

  res.redirect("/viewtrainingstaff");
});

// ------------------------------------------------------------------------

// --------------------------------------------  ADMIN LOGIN ---------------------------------------
//admin login page
app.get("/adminlogin", function (req, res) {
  res.render("adminlogin");
});

app.post("/adminlogin", async (req, res) => {
  let email = req.body.username;
  let password = req.body.password;

  const mongo = await getMongoClient();
  const loggedInAccount = await mongo
    .collection("adminaccount")
    .findOne({ email, password });

  if (loggedInAccount) {
    req.session.userInfo = loggedInAccount;
    res.redirect("admin");
  } else {
    res.render("adminlogin", {
      errorMessage: "Username or Password is not correct!",
    });
  }
});

app.get("/adminlogout", function (req, res) {
  delete req.session.userInfo;
  res.redirect("/adminlogin");
});

// -------------------------------- KET THUC LOGIN PAGE --------------------

// -------------------------------- STAFF PAGE -----------------------------
app.get("/trainingstaff", function (req, res) {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  } else {
    res.render("trainingstaff", { staff: staffInfo });
  }
});

// ------------------------------- STAFF LOGIN -----------------------------

//staff login page
app.get("/stafflogin", function (req, res) {
  res.render("stafflogin");
});

app.post("/stafflogin", async (req, res) => {
  let email = req.body.username;
  let password = req.body.password;

  const mongo = await getMongoClient();
  const loggedInAccount = await mongo
    .collection("staff")
    .findOne({ email, password });

  if (loggedInAccount) {
    req.session.staffInfo = loggedInAccount;
    res.redirect("trainingstaff");
  } else {
    res.render("stafflogin", {
      errorMessage: "Username or Password is not correct!",
    });
  }
});

app.get("/stafflogout", function (req, res) {
  delete req.session.userInfo;
  res.redirect("/adminlogin");
});

// --------------------------- MANAGE TRAINEE ACCOUNT ---------------------

// --------------------------- add account  -----------------------

//addtrainee(staff)
app.get("/addtrainee", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  res.render("addtrainee");
});

// trainer
app.post("/doAddTrainee", async (req, res) => {
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  let newData = {
    firstname: inputfirstName,
    lastname: inputlastName,
    phone: inputPhone,
    email: inputEmail,
    password: inputPassword,
  };

  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("trainee").insertOne(newData);
  res.redirect("/viewtrainee");
});
// --------------------------- view account -------------------------------

//view trainee
app.get("/viewtrainee", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("trainee").find({}).toArray(); // print product in product table
  res.render("viewtrainee", { model: result });
});
// --------------------------- search account -----------------------------

app.get("/doSearchTrainee", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("trainee")
    .find({ firstname: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewtrainee", { model: result });
});
// --------------------------- update account -----------------------------

// Get form update trainee by ID
app.get("/updatetrainee/:id", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo.collection("trainee").findOne({ _id: ObjectID(id) });
  res.render("update_trainee", { model: result });
});

// Do update trainee
app.post("/doUpdateTrainee", async (req, res) => {
  let id = req.body.id;
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  let newData = {
    firstname: inputfirstName,
    lastname: inputlastName,
    phone: inputPhone,
    email: inputEmail,
    password: inputPassword,
  };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("trainee")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });

  res.redirect("/viewtrainee");
});
// --------------------------- delete account -----------------------------

// trainer
app.get("/removetrainee", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("trainee").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewtrainee");
});

// --------------------------- MANAGE CATEGORY ----------------------------

// app.get("/coursecategories", function (req, res) {
//   res.render("coursecategories");
// });

// --------------------------- add category -------------------------------
app.get("/addcategory", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  res.render("addcategory");
});

// trainer
app.post("/doAddCategory", async (req, res) => {
  let inputName = req.body.txtCategoryName;
  let inputDescription = req.body.txtDescription;
  let newData = {
    name: inputName,
    description: inputDescription,
  };

  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("category").insertOne(newData);
  res.redirect("/viewcategory");
});
// --------------------------- view category -------------------------------

app.get("/viewcategory", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("category").find({}).toArray(); // print product in product table
  res.render("viewcategory", { model: result });
});

// --------------------------- search category ----------------------------
app.get("/doSearchCategory", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("category")
    .find({ name: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewcategory", { model: result });
});

// --------------------------- update category ----------------------------
// Get form update trainee by ID
app.get("/updatecategory/:id", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo
    .collection("category")
    .findOne({ _id: ObjectID(id) });
  res.render("update_category", { model: result });
});

// Do update trainee
app.post("/doUpdateCategory", async (req, res) => {
  let id = req.body.id;
  let inputName = req.body.txtName;
  let inputDescription = req.body.txtDescription;
  let newData = { name: inputName, description: inputDescription };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("category")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });

  res.redirect("/viewcategory");
});
// --------------------------- delete category ----------------------------
// category
app.get("/removecategory", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("category").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewcategory");
});

// -----------------------------------------------------------------------

// --------------------------- MANAGE COURSE ----------------------------

app.get("/course", function (req, res) {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  res.render("course");
});
// --------------------------- add course -------------------------------
app.get("/addcourse", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  res.render("addcourse");
});

// trainer
app.post("/doAddCourse", async (req, res) => {
  let inputName = req.body.txtCategoryName;
  let inputDescription = req.body.txtDescription;
  let newData = {
    name: inputName,
    description: inputDescription,
  };

  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("course").insertOne(newData);
  res.redirect("/viewcourse");
});
// --------------------------- view course ------------------------------
app.get("/viewcourse", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("course").find({}).toArray(); // print product in product table
  res.render("viewcourse", { model: result });
});

app.get("/viewtrainerforstaff", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("trainer").find({}).toArray(); // print product in product table
  res.render("viewtrainer", { model: result });
});

// --------------------------- search course ----------------------------
app.get("/doSearchCourse", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("course")
    .find({ name: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewcourse", { model: result });
});
// --------------------------- update course ----------------------------

// Get form update trainee by ID
app.get("/updatecourse/:id", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo.collection("course").findOne({ _id: ObjectID(id) });
  res.render("update_course", { model: result });
});

// Do update trainee
app.post("/doUpdateCourse", async (req, res) => {
  let id = req.body.id;
  let inputName = req.body.txtName;
  let inputDescription = req.body.txtDescription;
  let newData = { name: inputName, description: inputDescription };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("course")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });
  res.redirect("/viewcourse");
});
// --------------------------- delete course ----------------------------
// category
app.get("/removecourse", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("course").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewcourse");
});
// -----------------------------------------------------------------

// ------------------------- MANAGE TOPIC --------------------------

// ------------------------ view topic --------------------
app.get("/viewtopic", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const id = req.params.id;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("topic").find({}).toArray();

  const trainers = result.filter((e) => e.trainerId);
  // console.log(trainers);
  res.render("viewtopic", { model: result });
});

// ------------------------ delete topic -------------------
app.get("/removetopic", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  let id = req.query.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("topic").deleteOne({ _id: ObjectID(id) });
  res.redirect("/viewtopic");
});

// ------------------------- update topic --------------------
// Get form update topic by ID
app.get("/updatetopic/:id", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const id = req.params.id;
  var ObjectID = require("mongodb").ObjectID;
  let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  let dbo = client.db("Training");
  const result = await dbo.collection("topic").findOne({ _id: ObjectID(id) });
  res.render("update_topic", { model: result });
});

// Do update trainee
app.post("/doUpdateTopic", async (req, res) => {
  let id = req.body.id;
  let inputName = req.body.txtName;
  let inputDescription = req.body.txtDescription;
  let newData = { name: inputName, description: inputDescription };

  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("topic")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });

  res.redirect("/viewtopic");
});

// --------------------------- search -------------------------
app.get("/doSearchTopic", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  // const id = req.params.id;
  let name_search = req.query.txtSearch;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo
    .collection("topic")
    .find({ name: new RegExp(name_search, "i") })
    .toArray();
  res.render("viewtopic", { model: result });
});

// -------------------------- add topic ---------------------------
app.get("/addtopic", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  res.render("addtopic");
});

// ------------------------ View list of trainer to assign topic -----------------------

// trainer
app.post("/doAddTopic", async (req, res) => {
  let inputName = req.body.txtCategoryName;
  let inputDescription = req.body.txtDescription;
  let newData = {
    name: inputName,
    description: inputDescription,
  };
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  await dbo.collection("topic").insertOne(newData);
  res.redirect("/viewtopic");
});

// ----------------------- Assign trainer to topic --------------

app.get("/assigntopic", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const { topicId } = req.query;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("trainer").find({}).toArray(); // print product in product table
  res.render("assigntopic", { model: result, topicId });
});

// do Assign Topic
app.post("/doAssignTopic", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  const { topicId, trainerId } = req.body;

  let trainerInfo = await dbo
    .collection("trainer")
    .findOne({ _id: ObjectID(trainerId) });
  let newData = {
    trainer: {
      id: trainerId,
      fullName: `${trainerInfo.firstname} ${trainerInfo.lastname}`,
    },
  };
  await dbo
    .collection("topic")
    .updateOne({ _id: ObjectID(topicId) }, { $set: newData });

  res.redirect("/viewtopic");
});

// --------------------------- Assign trainee to course ----------------------------

app.get("/assigncourse", async (req, res) => {
  const staffInfo = req.session.staffInfo;
  if (!staffInfo) {
    res.redirect("/stafflogin");
  }
  const { courseId } = req.query;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("trainee").find({}).toArray(); 
  res.render("assigncourse", { model: result, courseId });
});

// assign trainee to course
app.post("/doAssignCourse", async (req, res) => {
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  const { courseId, traineeId } = req.body;

  let traineeInfo = await dbo
    .collection("trainee")
    .findOne({ _id: ObjectID(traineeId) });
  let newData = {
    trainee: {
      id: traineeId,
      fullName: `${traineeInfo.firstname} ${traineeInfo.lastname}`,
    },
  };
  await dbo
    .collection("course")
    .updateOne({ _id: ObjectID(courseId) }, { $set: newData });

  res.redirect("/viewcourse");
});


// --------------------------- TRAINER  ----------------------------

app.get("/trainer", function (req, res) {
  const trainerInfo = req.session.trainerInfo;
  if (!trainerInfo) {
    res.redirect("/trainerlogin");
  } else {
    res.render("trainer", { trainer: trainerInfo });
  }
});
// --------------------------- login  ----------------------------

//trainer login page
app.get("/trainerlogin", function (req, res) {
  res.render("trainerlogin");
});

app.post("/trainerlogin", async (req, res) => {
  let email = req.body.username;
  let password = req.body.password;

  const mongo = await getMongoClient();
  const loggedInAccount = await mongo
    .collection("trainer")
    .findOne({ email, password });

  if (loggedInAccount) {
    req.session.trainerInfo = loggedInAccount;
    res.redirect("trainer");
  } else {
    res.render("trainerlogin", {
      errorMessage: "Username or Password is not correct!",
    });
  }
});

app.get("/trainerlogout", function (req, res) {
  delete req.session.trainerInfo;
  res.redirect("/trainerlogin");
});

// --------------------------- view profile -----------------------

app.get("/viewtrainerprofile", async (req, res) => {
  const trainerInfo = req.session.trainerInfo;
  if (!trainerInfo) {
    res.redirect("/trainerlogin");
  }
  // const { userInfo } = req.session;
  res.render("viewtrainerprofile", { trainerInfo });
});

// --------------------------- update profile ---------------------

// Get form update trainer by ID
app.get("/updatetrainerprofile/:id", async (req, res) => {
  const trainerInfo = req.session.trainerInfo;
  if (!trainerInfo) {
    res.redirect("/trainerlogin");
  }
  // const id = req.params.id;
  // const id = req.session.trainerInfo.id;
  // var ObjectID = require("mongodb").ObjectID;
  // let client = await MongoClient.connect(url, { useUnifiedTopology: true });
  // let dbo = client.db("Training");
  // const result = await dbo.collection("trainer").findOne({ _id: ObjectID(id) });
  // res.render("updatetrainerprofile", { trainerInfo: result });
  res.render("updatetrainerprofile", { trainerInfo });
});

// Do update trainer
app.post("/doUpdateTrainerProfile", async (req, res) => {
  let id = req.body.id;
  let inputfirstName = req.body.txtfirstName;
  let inputlastName = req.body.txtlastName;
  let inputPhone = req.body.txtPhone;
  let inputEmail = req.body.txtEmail;
  let inputPassword = req.body.txtPassword;
  let newData = {
    firstname: inputfirstName,
    lastname: inputlastName,
    phone: inputPhone,
    email: inputEmail,
    password: inputPassword,
  };
  console.log(newData);
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  var ObjectID = require("mongodb").ObjectID;
  await dbo
    .collection("trainer")
    .updateOne({ _id: ObjectID(id) }, { $set: newData });
  res.redirect("/viewtrainerprofile");
});

// ---------------------- View topic that the trainer is assigned to ------------------
app.get("/viewtopicassign", async (req, res) => {
  const trainerInfo = req.session.trainerInfo;
  if (!trainerInfo) {
    res.redirect("/trainerlogin");
  }
  const id = req.session.trainerInfo.id;
  let client = await MongoClient.connect(url);
  let dbo = client.db("Training");
  let result = await dbo.collection("topic").findOne({id: id});
 // const trainers = result.filter((e) => e.trainerId);
  // console.log(trainers);
  res.render("viewtopicassign", { model: result });
});

// ----------------------------------------------------------



// login page
app.get("/redirect", function (req, res) {
  res.render("redirect");
});

const port = 5000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
