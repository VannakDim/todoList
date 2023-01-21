//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);
//const url = 'mongodb://127.0.0.1:27017/todolistDB';
const url = "mongodb+srv://adminIT:akkZJljhqyqyAa3T@todolist.ilxe1fk.mongodb.net/todoListDB?retryWrites=true&w=majority";
mongoose.connect(url, {useNewUrlParser: true});

const mySchema = new mongoose.Schema({
    
  title: {
      type: String,
      required: [true, 'What is your name?']
  }
})
const doList = mongoose.model('doList', mySchema);


const morning = new doList({
  title: "Take care baby"
})
const evening = new doList({
  title: "Cooking"
})

const dailyWork = [morning,evening];
// todo.save();

const List = {
  name: String,
  items: [mySchema]
};

const customList = mongoose.model("List", List);

const day = date.getDate();

app.get("/", function(req, res) {

  

  doList.find({},function(err, doList){
    if(err){
      console.log(err);
    }else{
      // console.log(doList);
      res.render("list", {listTitle: day, newListItems: doList});
    }
  })
});

app.post("/", function(req, res){

  const item = req.body.newItem;
  const listName = req.body.list;
  //list is listName where send from list.ejs

  const todo = new doList({
    title: item
  });

  if(listName === day){
    todo.save();
    res.redirect("/");
  }else{
    customList.findOne({name: listName}, function(err,foundList){
      
      foundList.items.push(todo);
      foundList.save();

      res.redirect("/"+ listName)
    })
  }

});

app.get("/:customListName", function(req,res){

  const customListName = req.params.customListName;

  customList.findOne({name: customListName}, function(err,foundList){
    if(!err){
      if(!foundList){
        const l = new customList({
          name: customListName ,
          items: dailyWork
        });
        l.save();
        res.redirect("/" + customListName);
      }else{
        res.render("list",{
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  })
  
});


app.post("/delete", function(req,res){
  const delItem = req.body.checkbox;
  doList.deleteOne({_id: delItem},function(err, doList){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  })
  });

app.get("/about", function(req, res){
  res.render("about");
});

let port = process.env.PORT;
if (port === null || port === ""){
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started successfully!");
});
