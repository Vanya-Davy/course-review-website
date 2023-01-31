const http = require('http')
const fs = require('fs')

//http.cresteServer(callbackFnction(2 parameters of object))
const server = http.createServer((res,res)=>{
    res.writeHead(200,{'content-Type':'text/html; charset=utf-8'})
    //console.log(req.url) // 顯示網址 => localhost:3000/
    if(req.url=='/'){  // 透過更改 url 可以到網頁的不同地方
        res.write('歡迎來到我的網頁')
        res.end()
    }else if(req.url=='/anotherPage'){
        res.write('這是另一個頁面')
        res.end()
    }else if (req.url='myFile'){
        res.readFile('myFile.html',(e,data)=>{
            if(e){
                res.write('html存取錯誤')
                res.end()
            }else{
                res.write(data)
                res.end()
            }
        })
    }else{
        res.write('不存在的頁面')
        res.end()
    }
})

//24小時不斷監聽client的請求
//server.listen(port number, callbackFunction)
server.listen(3000,()=>{
    console.log('伺服器正在運行')
})
