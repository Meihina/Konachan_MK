import React , { Component } from 'react'
import { Modal , Card , Col , Tag , Button } from 'antd'
import './card.css'
import { EllipsisOutlined, DownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import utils_download from '../../utils/js/download.js'

class KonachanCard extends Component{
    constructor(props){
        super(props)
        this.state = {
            isLoaded : false,
            visible : false,
            isDownloaded : false
        }
    }

    handleImageLoaded() {
        this.setState({isLoaded : true})
    }

    componentDidMount(){
        console.log(this.props.data)
    }

    showModal = () => {
        this.setState({
            visible: true,
        })
    }

    handleOk = e => {
        console.log(e)
        this.setState({
            visible: false,
        })
        utils_download.downLoad(this.props.data.file_url , this.props.data.id , this.props.mainOBJ , this)
    }

    handleCancel = e => {
        console.log(e)
        this.setState({
            visible: false,
        })
    }

    render(){
        return(
            <Col span={12} md={8} xl={6}>
                <Card className='card'
                    cover={
                        <div onClick={this.showModal} style={{overflow : 'hidden' , cursor : 'pointer'}}>
                            <img
                                alt="example"
                                src={this.props.src}
                                onLoad={this.handleImageLoaded.bind(this)}
                                style={
                                    this.state.isLoaded ? {width : '100%'} : {width : '0%'}
                                }
                            ></img>
                            {
                                this.state.isLoaded ? '' : <div style={{width : '100%' , height : '0' , paddingBottom : '70%' , display : 'flex' , justifyContent : 'center'}}>
                                    <LoadingOutlined style={{position : 'absolute' , top : '35%' , transform : 'scale(2.5)' , color : 'rgb(86, 86, 255)'}} />
                                </div>
                            }
                        </div>
                    }
                    actions={[
                        <div>
                            <div onClick={this.showModal}>
                                <EllipsisOutlined key="ellipsis" />
                            </div>
                            <Modal
                                mask={true}
                                width={800}
                                title="Detail"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                                footer={[
                                    <Button key="back" onClick={this.handleCancel}>
                                        cancel
                                    </Button>,
                                    <Button key="submit" type="primary" onClick={this.handleOk}>
                                        download
                                    </Button>,
                                ]}
                            >
                                <img style={{width : '100%'}} src={this.props.data.sample_url}></img>
                                <div style={{fontFamily : 'fantasy' , fontSize : '18px' , marginTop : '10px'}}>tags : <span style={{fontFamily : 'sans-serif' , fontSize : '16px'}}>{
                                    this.props.data.tags.split(" ").map((item , index) => {
                                        return <Tag>{item}</Tag>
                                    })
                                }</span></div>
                                <div style={{fontFamily : 'fantasy' , fontSize : '18px' , marginTop : '10px'}}>author : <span style={{fontFamily : 'sans-serif' , fontSize : '16px'}}>{this.props.data.author}</span></div>
                                <div style={{fontFamily : 'fantasy' , fontSize : '18px' , marginTop : '10px'}}>id : <span style={{fontFamily : 'sans-serif' , fontSize : '16px'}}>{this.props.data.id}</span></div>
                                <div style={{fontFamily : 'fantasy' , fontSize : '18px' , marginTop : '10px'}}>resolution : <span style={{fontFamily : 'sans-serif' , fontSize : '16px'}}>{this.props.data.width} x {this.props.data.height}</span></div>
                                <div style={{fontFamily : 'fantasy' , fontSize : '18px' , marginTop : '10px'}}>source : <a onClick={() => {window.open(this.props.data.source)}} style={{fontFamily : 'sans-serif' , fontSize : '16px'}}>{this.props.data.source}</a></div>
                            </Modal>
                        </div>,
                        <div>
                            <div onClick={() => {utils_download.downLoad(this.props.data.file_url , this.props.data.id , this.props.mainOBJ , this)}}>
                                <DownloadOutlined key="download" />
                            </div>
                        </div>
                    ]}
                >
                </Card>
            </Col>
        )
    }
}

export default KonachanCard