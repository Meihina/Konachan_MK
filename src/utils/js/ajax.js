function reqTags(name , obj){
    fetch("http://konachan_api.kaza.ink/tags", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tagname : name})
    }).then((res) => {
        res.json().then((res) => {
            let body = JSON.parse(res.body)
            body.sort((a,b) => {
                return b.count - a.count
            })
            obj.setState({tagsData : body , toLoading : false , showMenu : true})
        })
    })
}

function reqPic(tagname , obj , page){
    if(page === 1){
        obj.setState({mainPageLoading : true})
    }else{
        obj.setState({mainPageLoadingMore : true})
    }

    fetch("http://konachan_api.kaza.ink/picList", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            is18X : obj.state.is18X,
            page : page,
            tags : tagname
        })
    }).then((res) => {
        res.json().then((res) => {
            let body = JSON.parse(res.body)
            if(body.length === 0){
                obj.setState({mainPageLoading : false , toShowPicData : true , isScrollLoad : true , mainPageLoadingMore : false , isEmpty : true})
            }else{
                if(page === 1){
                    console.log(body)
                    obj.setState({picData : body , mainPageLoading : false , toShowPicData : true , isScrollLoad : true})
                }else{
                    console.log(obj.state.picData)
                    let newRes = obj.state.picData.concat(body)
                    obj.setState({picData : newRes , toShowPicData : true , isScrollLoad : true , mainPageLoadingMore : false})
                }
            }
        })
    })
}

export default{
    "reqTags" : reqTags,
    "reqPic" : reqPic
}