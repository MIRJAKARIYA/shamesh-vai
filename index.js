const express = require('express');
require('dotenv').config()
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;



const uri = `mongodb+srv://technologyandElectronicsDB:1s3dApnL0KLrzo5D@technologydb.cn01oew.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)


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
    const productCollection = client.db('productDB').collection('product');
    const cartCollection = client.db('productDB').collection('cart');


    // product api
    app.get('/product', async (req, res) => {
      const cursor = productCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

 // product api
    app.get('/product/:id', async (req, res) => {
      try {
          const query = { _id: new ObjectId(req.params.id) };
          const result = await productCollection.findOne(query);
  
          if (result) {
              res.send(result);
          } else {
              res.status(404).send({ message: 'Product not found' });
          }
      } catch (error) {
          res.status(500).send({ message: 'Internal Server Error' });
      }
  });
  
 // product api

    app.post('/product', async (req, res) => {
      const newProduct = req.body;
      console.log(newProduct);
      const result = await productCollection.insertOne(newProduct)
      res.send(result)

    })
     // product api
    app.put('/product/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) }
        const options = { upsert: true };
        const updateProduct = req.body;
        const product = {
          $set: {
            name: updateProduct.name,
            brandName: updateProduct.brandName,
            type: updateProduct.type,
            description: updateProduct.description,
            price: updateProduct.price,
            rating: updateProduct.rating,
            imageUrl: updateProduct.imageUrl
          }
        }
        const result = await productCollection.updateOne(filter, product, options);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    })


    // cart api

    app.get('/cart', async (req, res) => {
      const cursor = cartCollection.find()
      const cart = await cursor.toArray();
      res.send(cart);
    })


    app.post('/cart', async (req, res) => {
      const cart = req.body;
      console.log(cart);
      const result = await cartCollection.insertOne(cart)
      res.send(result)

    })
    app.get('/cart/id', async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await cartCollectionCollection.findOne(query);
      res.send(result);
    })
    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: id }
      const result = await cartCollection.deleteOne(query)
      res.send(result);

    })

   




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



// meddleware




app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('server is running');
})



app.listen(port, () => {
  console.log(`Product is running on port : ${port}`)
})