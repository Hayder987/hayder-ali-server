require('dotenv').config()
const express = require("express")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors  = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use (express.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.7ya1e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const projectCollection = client.db("myProfile").collection("project")
    const messageCollection = client.db("myProfile").collection("message")

    app.post('/project', async(req, res)=>{
        const project = req.body
        const result = await projectCollection.insertOne(project)
        res.send(result)
    })

    app.get('/recentProject', async(req, res)=>{
        const result = await projectCollection.find().sort({postDate: -1}).limit(3).toArray()
        res.send(result)
    })

    app.get('/allProject', async(req, res)=>{
        const result = await projectCollection.find().toArray()
        res.send(result)
    })

    app.get('/post/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await projectCollection.findOne(query)
        res.send(result)
    })

    app.post('/message', async(req, res)=>{
        const message = req.body
        const result = await messageCollection.insertOne(message)
        res.send(result)
    })
   
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
   
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send(`hello Server is Running `)
})

app.listen(port, ()=>{
    console.log(`Server Running At PORT:${port}`)
})

