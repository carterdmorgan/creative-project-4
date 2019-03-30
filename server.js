const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/pantry', {
  useNewUrlParser: true
});


app.listen(3030, () => console.log('Server listening on port 3030!'));


// Create a scheme for items in the museum: a title and a path to an image.
const foodSchema = new mongoose.Schema({
  barcode: String,
  title: String,
  amount: Number,
});

// Create a model for items in the museum.
const Food = mongoose.model('Food', foodSchema);

// Create a new item in the museum: takes a title and a path to an image.
app.post('/api/foods', async (req, res) => {
  const food = new Food({
    barcode: req.body.barcode,
    title: req.body.title,
    amount: req.body.amount
  });
  console.log(food)
  try {
    await food.save();
    res.send(food);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the food in the pantry.
app.get('/api/foods', async (req, res) => {
  try {
    let items = await Food.find();
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.delete('/api/foods/:id', async (req, res) => {
  try {
    let id = req.params.id
    let query = { _id: id }
    Food.deleteOne(query, function (err, obj) {
      if (err) throw err;
    });
    res.send({status: 'Food with id ' + id + ' successfully deleted.'})
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.put('/api/foods/:id', async (req, res) => {
  try {
    console.log(req.body)
    let id = req.params.id
    let query = { _id: id }
    var newValues = { $set: { 
      title: req.body.title, 
      barcode: req.body.barcode,
      amount: req.body.amount
    } };
    console.log(newValues)
    Food.updateOne(query, newValues, function (err, result) { 
      if (err) throw err;
      res.send(result)
    })
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});