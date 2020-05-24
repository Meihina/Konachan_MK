const express = require('express')
const app = express()
const BodyParser = require('body-parser')
const axios = require('axios')
const request = require('request')

app.use(express.json())
app.use(require('cors')())
var jsonParser = BodyParser.json()

const getFile = function(url){
    return new Promise((resolve, reject) => {
        axios({
            method:'get',
            url,
            responseType: 'arraybuffer'
        }).then(data => {
            console.log(data.data)
            resolve(data.data)
        }).catch(error => {
            console.log(error)
            reject(error.toString())
        })
    })
}

app.post('/download' , jsonParser , async function(req , res){
    console.log(req.body.mp3Url)
    getFile(req.body.mp3Url).then((blob) =>{
        console.log(blob)
        res.send(blob)
    })
})

app.post('/tags' , jsonParser , async function(req , res){
    console.log(req.body.tagname)
    await request('https://konachan.com/tag.json?name=' + req.body.tagname , function(error , body){
        if(!error && res.statusCode == 200){
            res.send(body)
        }else{
            console.log('请求大失败了嗷' + error)
        }
    })
})

app.post('/picList' , jsonParser , async function(req , res){
    new Promise((resolve) => {
        if(req.body.is18X){
            resolve(`https://konachan.com/post.json?tags=${req.body.tags}&page=${req.body.page}`)
        }else{
            resolve(`https://konachan.com/post.json?tags=${req.body.tags}+rating:safe&page=${req.body.page}`)
        }
    }).then((url) => {
        request(url , function(error , body){
            if(!error && res.statusCode == 200){
                res.send(body)
            }else{
                console.log('请求大失败了嗷' + error)
            }
        })
    })
})

// ===== 启动监听 =====
app.listen(9997 , function(){ // 监听在3000端口
    console.log('ok')
})