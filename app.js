const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb')

//init app & middleware
const app = express()

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
    res.send('<h1> Hello, World! </h1>');
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