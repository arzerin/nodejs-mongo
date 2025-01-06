const { MongoClient }  = require('mongodb')

let dbConnection

module.exports = {
    //connectToDb: () => {},
    connectToDb: (cb) => {
        MongoClient.connect('mongodb://localhost:27017/bookstore')
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch( err => {
            console.log(err)
            return cb(err)
        })
    },
    //getDb: () => {}
    getDb: () => dbConnection   
}

//tutorial "Complete MongoDB Tutorial #16 - Connecting to MongoDB" from https://www.youtube.com/watch?v=gGNquGHqpNI&list=PL4cUxeGkcC9h77dJ-QJlwGlZlTd4ecZOA&index=16