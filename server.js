const express = require('express');
const mysql = require('mysql');
const app = express();
let cors = require('cors');
app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbsmschool' 
});


connection.connect((err) => {
  if (err) {
    console.error(err);
  }
  console.log('Connected to the database.');
});

app.use(express.json());
app.post("/two", (req, res) => {
  const formData = req.body;
  console.log('Received form data:', formData);

  const { name, password, gender, country } = formData;

  const sql = 'INSERT INTO student (email, password, gender, country) VALUES (?, ?, ?, ?)';
  const values = [name, password, gender, country];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.error('Error saving form data:', error);
      res.status(500).send({ message: 'Error saving form data' });
    } else {
      console.log('Form data saved successfully');
      res.send({ message: 'Form data received and processed successfully' });
    }
  });
});

app.get("/one/:id", (req, res) => {
  let sql = "select * from student where id=?"
  let values = [req.params.id]
    // return res.send(sql);
       connection.query(sql, values, (err, result)=>{
        if(err){
          return res.status(404).send({message: err.message})
        }else{
          return res.status(200).send({data: result[0]})
        }
      })
})

app.get("/one", (req, res) => {
  let sql = "SELECT * FROM student";
  connection.query(sql, function (error, result) {
    if (error) {
      console.log("Error Connecting to DB");
    } else {
      res.send({ status: true, data: result });
    }
  });
});


app.put("/one/:id", (req, res) => {
  let sql =
    "UPDATE student SET email=?, password=?, gender=?, country=? WHERE id=?";
  
  let values = [
    req.body.name,
    req.body.password,
    req.body.gender,
    req.body.country,
    req.params.id
  ];

  connection.query(sql, values, (error, result) => {
    if (error) {
      res.send({ status: false, message: "Student Update Failed" });
    } else {
      res.send({ status: true, message: "Student Updated successfully" });
    }
  });
});


app.delete("/one/:id", (req, res) => {
  let sql = "DELETE FROM student WHERE id = ?";
  
  connection.query(sql, [req.params.id], (error, result) => {
    if (error) {
      res.send({ status: false, message: "Student Deletion Failed" });
    } else {
      res.send({ status: true, message: "Student Deleted successfully" });
    }
  });
});


// Listen on port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000.');
});
