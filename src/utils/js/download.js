
import { message } from 'antd'

function downLoad(url , filename , mainOBJ , obj){
    if(!obj.state.isDownloaded){
        obj.setState({isDownloaded : true})
        mainOBJ.setState({DownloadCount : mainOBJ.state.DownloadCount + 1 , DownloadList : (() => {
            let arr = mainOBJ.state.DownloadList
            arr.push('id' + filename)
            return arr
        })()})
        message.success(`id${filename} is downloading. There're ${mainOBJ.state.DownloadCount} download processes now.`)
        fetch("http://konachan_api.kaza.ink/download", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'responseType': 'blob'
            },
            body: JSON.stringify({mp3Url : url})
        }).then((res) => {
            return res.blob()
        }).then((blob) => {
            console.log(blob)
            message.success(`id${filename} download successful!`)
            mainOBJ.setState({DownloadCount : mainOBJ.state.DownloadCount - 1 , DownloadList : (() => {
                let arr = mainOBJ.state.DownloadList , index = arr.indexOf('id' + filename)
                arr.splice(index , 1)
                return arr
            })()})
            saveAS(blob , filename + '.png')
        })
    }
}

// message.success('This is a success message')

function saveAS(blob , filename){
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
    } else {
        const link = document.querySelector('.toDownload')
        link.href = window.URL.createObjectURL(blob) // 创建对象url
        link.download = filename
        link.style.display = 'none'
        link.click()
        window.URL.revokeObjectURL(link.href) // 通过调用 URL.createObjectURL() 创建的 URL 对象
    }
}

export default{
    "downLoad" : downLoad,
    "saveAS" : saveAS
}