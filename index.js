const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mongodb
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@cluster0.v2v9b72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    client.connect();

    const blogsCollection = client.db("blogging_DB").collection("blogs");
    const usersCollection = client.db("blogging_DB").collection("users");
    const saveBlogCollection = client.db("blogging_DB").collection("save");
    const favoriteBlogCollection = client.db("blogging_DB").collection("favorite");
    const BlogCommentCollection = client.db("blogging_DB").collection("comment");
    const BlogLikeCollection = client.db("blogging_DB").collection("like");



    /*==================================================
              Blog api
      ================================================== */
    app.get('/blogs', async (req,res)=>{
       const result = await blogsCollection.find().toArray();
       res.send(result);
    })

    app.get('/blog/:id', async (req,res)=>{
       const id = req.params.id;
       const filter = { _id : new ObjectId(id)};
       const blog = await blogsCollection.findOne(filter);
       res.send(blog);
    })

    /*==================================================
              All User api
      ================================================== */
    app.get('/users', async (req,res)=>{
        const users = await usersCollection.find().toArray();
        res.send(users);
    })
    
    app.post('/user', async (req,res)=>{
       const user = req.body;
       const query = { email: user.email};
       const existingUser = await usersCollection.findOne(query);
       if(existingUser){
        return res.send({message:"User already existes"});
       }
       const result = await usersCollection.insertOne({...user,role:"User"});
       res.send(result);
    })
    /*==================================================
            Save blog api
    ================================================== */
    app.post('/save',async (req,res)=>{
      const blog = req.body;
      const result = await saveBlogCollection.insertOne(blog);
      res.send(result);
    })

    app.get('/save',async (req,res)=>{
      const result = await saveBlogCollection.find().toArray();
      res.send(result);
    })

    app.get('/save-blog', async (req,res)=>{
        const email = req.query.email;
        if(!email){
          res.send([]);
        }
        const query = { user_email: email};
        const result = await saveBlogCollection.find(query).toArray();
        res.send(result);
      })

    app.delete('/save-blog/:id', async (req, res) => {
      const id = req.params.id;
      const blog_id = id;
      const filter = { blog_id };
      const result = await saveBlogCollection.deleteOne(filter);
      res.send(result);
    })

    /*==================================================
            Favorite blog api
    ================================================== */
    app.post('/favorite',async (req,res)=>{
        const blog = req.body;
        const result = await favoriteBlogCollection.insertOne(blog);
        res.send(result);
    })

    app.get('/favorite',async (req,res)=>{
      const result = await favoriteBlogCollection.find().toArray();
      res.send(result);
    })

    app.get('/favorite-blog', async (req,res)=>{
        const email = req.query.email;
        if(!email){
          res.send([]);
        }
        const query = { user_email: email};
        const result = await favoriteBlogCollection.find(query).toArray();
        res.send(result);
    })

    app.delete('/favorite-blog/:id', async (req,res)=>{
      const id = req.params.id;
      const blog_id = id;
      const filter = { blog_id };
      const result = await favoriteBlogCollection.deleteOne(filter);
      res.send(result);
    })

    /*==================================================
            comment api
    ================================================== */ 
    app.post('/comment',async (req,res)=>{
      const comment = req.body;
      const result = await BlogCommentCollection.insertOne(comment);
      res.send(result);
    })
    
    app.get('/comment',async (req,res)=>{
      const result = await BlogCommentCollection.find().toArray();
      res.send(result);
    })

    /*==================================================
            Like api
    ================================================== */ 
    app.post('/like',async (req,res)=>{
      const comment = req.body;
      const result = await BlogLikeCollection.insertOne(comment);
      res.send(result);
    })

    app.get('/like',async (req,res)=>{
      const result = await BlogLikeCollection.find().toArray();
      res.send(result);
    })




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);












app.get('/',async (req,res)=>{
    res.send('Blogging server is running');
})
app.listen(port,()=>{
    console.log('Blogging server is running');
})