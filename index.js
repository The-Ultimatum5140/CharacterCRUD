const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const usermodel = require('./models/user');
const user = require('./models/user');

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/test-app", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render("index");
});
//read
app.get('/read', async (req, res) => {
  try {
    const allusers = await usermodel.find();
    res.render('read', { allusers });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});
//create
app.post('/create', async (req, res) => {
  try {
    const { name, email, url } = req.body;
    await usermodel.create({ name, email, url });
    res.redirect('/read');
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Failed to create user");
  }
});
//edit
app.get('/edit/:id',async(req,res)=>{
     try{
        const user=await usermodel.findById(req.params.id)
        if(!user){
            res.status(404).send("User Not found")
        }
        res.render("edit",{user})
     }catch(err){
        console.error("Error while loading the edit page:",err)
        res.status(500).send("Something went wrong")
     }
})
//update
app.post("/update/:userid", async (req, res) => {
  let { name, email, url } = req.body;
  try {
    await usermodel.findOneAndUpdate(
      { _id: req.params.userid },
      { name, email, url },
      { new: true }
    );
    res.redirect("/read");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Failed to update");
  }
});

//delete
app.get('/delete/:id', async (req, res) => {
  try {
    await usermodel.findByIdAndDelete(req.params.id);
    res.redirect('/read');
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Failed to delete user");
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
