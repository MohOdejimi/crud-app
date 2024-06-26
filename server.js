const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient

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

app.put('/addOneLike', (request, response) => {
    db.collection('rappers').updateOne({
        stageName: request.body.stageNameS, 
        birthName: request.body.birthNameS,
        likes: request.body.likesS},{
        $set: {
            likes:request.body.likesS + 1
          }
    },{
        sort: {_id: -1},
        upsert: true
    })
    .then(result => {
        console.log('Added One Like')
        response.json('Like Added')
    })
    .catch(error => console.error(error))

})

app.put('/removeOneLike', (request, response) => {
    const newLikes = Math.max(0, request.body.likesS - 1);

    db.collection('rappers').updateOne({
        stageName: request.body.stageNameS, 
        birthName: request.body.birthNameS,
        likes: request.body.likesS
    }, {
        $set: {
            likes: newLikes
        }
    }, {
        sort: {_id: -1},
        upsert: true
    }).then(result => {
        console.log('removed like')
        response.json('Like removed')
    }).catch(error => console.log(error))
})

app.listen(PORT, () => {
    console.log('Server is running, you better go catch it at port 21 on localhost.')

})