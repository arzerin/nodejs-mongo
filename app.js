const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

//init app & middleware
const app = express()

// Middleware to parse JSON body
//In Express, to parse JSON data in the request body, you must use the express.json() middleware. Without this middleware, req.body will be undefined.
app.use(express.json());  // <-- Add this line

//db connection
let db 

connectToDb((err) => {
    if (!err) {

        app.listen(3100, () => {
            console.log('app listening on port 3100')
        })

        db = getDb()
    } else {
        console.log('app could not listen on port 3100')
    }
})

/*
app.listen(3100, () => {
    console.log('app listening on port 3100')
})
*/

//routes

app.get('/', (req, res) => {
    //res.json({msg: "Welcome to API"})
    res.send('Hello, World!');
})


app.get('/books', (req, res) => {

    let books = [] 

    db.collection('books')
    .find()
    .sort({title: 1})
    .forEach(book => books.push(book))
    .then( () => {
        console.log('connected to mongodb')
        res.status(200).json(books)
    })
    .catch( () => {
        console.log('failed')
        res.status(500).json({error: "Could not feth documents"})
    })


    //res.json({msg: "Welcome to API"})
})

app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then( doc => {
            console.log('connected to mongodb')
            res.status(200).json(doc)
        })
        .catch( () => {
            console.log('failed')
            res.status(500).json({error: "Could not feth documents"})
        })
    } else {
        res.status(500).json({error: "Not a vaid doc id"})
    }
})

app.post('/books', (req, res) => {
    const book = req.body

    /*
    console.log('My Request Data:', JSON.stringify({
        body: req.body,
        query: req.query,
        params: req.params,
    }, null, 2)); 
    */
    console.log("Got Params")
    console.log('Request Body:', req.body); 
    console.log(book)
    


    db.collection('books')
    .insertOne(book)
    .then( result => {
        res.status(200).json(result)
    })
    .catch( err => {
        console.error(err)  // Log the error for more details
        res.status(500).json({error: "Could not create a new document"})
    })
    

})
