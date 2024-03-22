const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

/* const mongoose = require('mongoose')

const uri = process.env.DB_STRING

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
}); */


require('dotenv').config()

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'rap'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    }).catch((e) => {
        console.log(e);
        console.log("Error Connecting to DB");
    })
const PORT = 2525

app.get('/', (request, response) => {
    db?.collection('rappers').find().sort({ likes: -1 }).toArray()
        .then(data => {
            response.render('index.ejs', { info: data })
        })
        .catch(error => console.error(error))
})

app.post('/addRapper', (request, response) => {
    console.log(request.body)
    db.collection('rappers').insertOne({ stageName: request.body.stageName, birthName: request.body.birthName, likes: 0 })
        .then(result => {
            console.log('Rapper Added')
            console.log(result);
            response.redirect('/')
        })
        .catch(error => console.error(error))
})

app.delete('/deleteRapper', (request, response) => {
    console.log(request.body)
    db.collection('rappers').deleteOne({ stageName: request.body.stageNameS })
        .then(result => {
            console.log('succesfully deleted')
            response.json('Rapper Deleted')
        })
        .catch(error => console.error(error))
})

app.put('/')

app.listen(PORT, () => {
    console.log('Server is running, you better go catch it at port 21 on localhost.')

})