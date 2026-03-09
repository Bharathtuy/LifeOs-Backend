const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express()

app.use(cors())
app.use(bodyParser.json())

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Bharath@zoho_18",
    database: "lifeos"
})

db.connect(err => {
    if (err) {
        console.log("Database connection failed")
    } else {
        console.log("Connected to MySQL")
    }
})

/* ---------------- USERS ---------------- */

// Register
app.post("/register", (req, res) => {

    const {username, password} = req.body

    const sql = "INSERT INTO users (username,password) VALUES (?,?)"

    db.query(sql,[username,password],(err,result)=>{
        if(err){
            res.send(err)
        }else{
            res.send("User created")
        }
    })
})

// Login
app.post("/login",(req,res)=>{

    const {username,password} = req.body

    const sql = "SELECT * FROM users WHERE username=? AND password=?"

    db.query(sql,[username,password],(err,result)=>{
        if(result.length>0){
            res.send({status:"success"})
        }else{
            res.send({status:"fail"})
        }
    })

})

/* ---------------- TIMETABLE ---------------- */

app.get("/timetable",(req,res)=>{

    db.query("SELECT * FROM timetable",(err,result)=>{
        res.send(result)
    })

})

app.post("/timetable",(req,res)=>{

    const {time,activity}=req.body

    db.query(
        "INSERT INTO timetable (time,activity) VALUES (?,?)",
        [time,activity],
        ()=>{
            res.send("Schedule added")
        }
    )

})

app.put("/timetable/:id",(req,res)=>{

    const id=req.params.id
    const {time,activity}=req.body

    db.query(
        "UPDATE timetable SET time=?,activity=? WHERE id=?",
        [time,activity,id],
        ()=>{
            res.send("Schedule updated")
        }
    )

})

app.delete("/timetable/:id",(req,res)=>{

    const id=req.params.id

    db.query(
        "DELETE FROM timetable WHERE id=?",
        [id],
        ()=>{
            res.send("Deleted")
        }
    )

})
/* ---------------- JOURNAL ---------------- */

app.get("/journal",(req,res)=>{
    db.query("SELECT * FROM journal",(err,result)=>{
        res.send(result)
    })
})

app.post("/journal",(req,res)=>{

    const {content} = req.body

    db.query("INSERT INTO journal (content) VALUES (?)",[content],()=>{
        res.send("Added")
    })

})

app.put("/journal/:id",(req,res)=>{

    const id=req.params.id
    const {content}=req.body

    db.query("UPDATE journal SET content=? WHERE id=?",[content,id],()=>{
        res.send("Updated")
    })

})

app.delete("/journal/:id",(req,res)=>{

    const id=req.params.id

    db.query("DELETE FROM journal WHERE id=?",[id],()=>{
        res.send("Deleted")
    })

})


/* ---------------- HABITS ---------------- */

app.get("/habits",(req,res)=>{
    db.query("SELECT * FROM habits",(err,result)=>{
        res.send(result)
    })
})

app.post("/habits",(req,res)=>{

    const {habit}=req.body

    db.query("INSERT INTO habits (habit) VALUES (?)",[habit],()=>{
        res.send("Habit added")
    })

})

app.put("/habits/:id",(req,res)=>{

    const id=req.params.id
    const {habit}=req.body

    db.query("UPDATE habits SET name=? WHERE id=?",[habit,id],()=>{
        res.send("Habit updated")
    })

})

app.delete("/habits/:id",(req,res)=>{

    const id=req.params.id

    db.query("DELETE FROM habits WHERE id=?",[id],()=>{
        res.send("Habit deleted")
    })

})


/* ---------------- LEARNING ---------------- */

app.get("/learning",(req,res)=>{
    db.query("SELECT * FROM learning",(err,result)=>{
        res.send(result)
    })
})

app.post("/learning",(req,res)=>{

    const {topic}=req.body

    db.query("INSERT INTO learning (topic) VALUES (?)",[topic],()=>{
        res.send("Added")
    })

})

app.put("/learning/:id",(req,res)=>{

    const id=req.params.id
    const {topic}=req.body

    db.query("UPDATE learning SET topic=? WHERE id=?",[topic,id],()=>{
        res.send("Updated")
    })

})

app.delete("/learning/:id",(req,res)=>{

    const id=req.params.id

    db.query("DELETE FROM learning WHERE id=?",[id],()=>{
        res.send("Deleted")
    })

})


/* ---------------- ANALYTICS ---------------- */

app.get("/analytics",(req,res)=>{

    const data={}

    db.query("SELECT COUNT(*) as count FROM journal",(err,result)=>{
        data.journal=result[0].count

        db.query("SELECT COUNT(*) as count FROM habits",(err,result)=>{
            data.habits=result[0].count

            db.query("SELECT COUNT(*) as count FROM learning",(err,result)=>{
                data.learning=result[0].count

                res.send(data)
                console.log(data);
            })
        })
    })

})


app.listen(3000,()=>{
    console.log("Server running on port 3000")
})