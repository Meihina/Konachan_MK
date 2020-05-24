import React , { Component } from 'react'
import { Switch , Layout , Menu , Drawer , Button , Row , Col , Input , Dropdown , BackTop , Popover } from 'antd'
import './Main.css'
import utils_ajax from '../../utils/js/ajax.js'
import utils_scroll from '../../utils/js/scroll.js'
import KonachanCard from '../Card/card.js'
import {
    AlignRightOutlined,
    LoadingOutlined,
    SyncOutlined,
    DownloadOutlined
} from '@ant-design/icons'
const { Header, Footer, Content } = Layout
const { Search } = Input


class Main extends Component{
    constructor(props){
        super(props)
        this.state = {
            visible: false,
            visibleDrop: false,
            placement: 'right',
            searchValue: '',
            timer: null,
            showMenu : false,

            mainPageLoading : true,
            mainPageLoadingMore : false,
            tagsData : null,
            picData : [],
            currentPage : 1,
            toLoading : false,
            toShowPicData : false,

            isRandom : false,
            isSearch : true,
            is18X : false,
            isScrollLoad : true,

            isEmpty : false,
            DownloadCount : 1,
            DownloadList : []
        }
        this.onChange = this.onChange.bind(this)
        this.onClick = this.onClick.bind(this)
        utils_ajax.reqPic('' , this , this.state.currentPage)
    }

    componentDidMount(){
        window.onscroll = () => {
            console.log(this.state.isScrollLoad)
            if(utils_scroll.getScrollTop() + utils_scroll.getClientHeight() + 200 > utils_scroll.getScrollHeight()) {
                if(this.state.isScrollLoad && !this.state.isEmpty){
                    console.log('下拉刷新了')
                    this.setState({isScrollLoad : false , currentPage : this.state.currentPage + 1} , () => {
                        utils_ajax.reqPic(this.state.searchValue , this , this.state.currentPage)
                    })
                }
            }
        }
    }

    handleVisibleChange = flag => {
        this.setState({ visibleDrop: flag })
    }

    showDrawer = () => {
        this.setState({visible: true})
    }

    onClose = () => {
        this.setState({visible: false})
    }

    onChange18X() {
        this.state.is18X = !this.state.is18X
        this.setState({currentPage : 1 , mainPageLoadingMore : false , isEmpty : false , picData : []} , () => {
            utils_ajax.reqPic(this.state.searchValue , this , this.state.currentPage)
        })
    }

    onChangeRandom(){
        this.setState({isRandom : true , isSearch : false})
    }

    onChangeSearch(){
        this.setState({isRandom : false , isSearch : true})
    }

    onChange(event) {
        clearTimeout(this.state.timer)
        this.setState({showMenu : false , toLoading : false})
        this.setState({searchValue: event.target.value}, () => {
            this.setState({
                timer : setTimeout(() => {
                    this.setState({toLoading : true})
                    utils_ajax.reqTags(this.state.searchValue , this)
                    console.log(this.state.searchValue)
                }, 500)
            })
        })
    }

    onClick(event) {
        event.preventDefault()
    }

    onTag(tagname){
        this.setState({searchValue : tagname , visibleDrop : false , toShowPicData : false})
        this.setState({currentPage : 1 , mainPageLoadingMore : false , isEmpty : false , picData : []} , () => {
            utils_ajax.reqPic(tagname , this , this.state.currentPage)
        })
    }

    render(){
        return(
            <div>
                <a className="toDownload"></a>
                <BackTop style={{height: '60' , width: '60'}} />
                <Drawer
                    className="drawer"
                    title="Option"
                    placement={this.state.placement}
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    key={this.state.placement}
                >
                    <div>
                        <div><Switch onChange={() => {this.onChange18X()}} /> 18X mode</div>
                        {/* <div style={{marginTop : '10px'}}><Switch checked={this.state.isRandom} onChange={() => {this.onChangeRandom()}} /> Random mode</div>
                        <div style={{marginTop : '10px'}}><Switch checked={this.state.isSearch} onChange={() => {this.onChangeSearch()}} /> Search mode</div> */}
                    </div>
                </Drawer>

                <Layout>
                    <Header style={{position: 'fixed' , zIndex : '10' , width: '100%' , backgroundColor:'rgb(86, 86, 255)' , boxShadow:'0px 2px 5px #888888'}}>
                        <div className="logo" >Konachan_MK</div>
                        <Button className="btn" type="primary" onClick={this.showDrawer}>
                            <AlignRightOutlined style={{transform:'scale(2)'}} />
                        </Button>
                        <Popover placement="bottomRight" title={<span>download list</span>} content={
                            <div>
                                {
                                    this.state.DownloadList.length === 0 ? <p>no any processes.</p> :
                                    this.state.DownloadList.map((item) => {
                                        return <p>{item} is downloading……</p>
                                    })
                                }
                            </div>
                        } trigger="click">
                            <Button type="primary" className="btn">
                                <DownloadOutlined style={{transform:'scale(2)'}} />
                            </Button>
                        </Popover>
                        <Menu style={{ backgroundColor:'rgb(86, 86, 255)'}} theme="dark" mode="horizontal" defaultSelectedKeys={['2']}></Menu>
                    </Header>
                    <Row justify="center">
                        <Col span={24} md={22}>
                            <Content className="site-layout" style={{ padding: '10px 10px', marginTop: 64 }}>
                                <div className="site-layout-background" style={{ padding: 16}}>
                                    <Row>
                                        <Col span={24} md={8}>
                                            <Dropdown overlay={
                                                <div>
                                                    {
                                                        this.state.showMenu ?
                                                        (
                                                            <Menu className='menu'>
                                                            {
                                                                this.state.tagsData.length !== 0 ?
                                                                    this.state.tagsData.map((item , index) => {
                                                                        return <Menu.Item onClick={() => {this.onTag(item.name)}} key={index}>{item.name} - {item.count}条结果</Menu.Item>
                                                                    })
                                                                : <Menu.Item key='1' style={{display : 'flex' , justifyContent : 'center'}}>关键词没有结果</Menu.Item>
                                                            }
                                                            </Menu>
                                                        ) : this.state.toLoading ? (
                                                            <Menu className='menu2'>
                                                                <LoadingOutlined style={{cursor : 'default'}} className='loading' />
                                                            </Menu>
                                                        ) : ''
                                                    }
                                                </div>
                                            }
                                            onVisibleChange={this.handleVisibleChange}
                                            visible={this.state.visibleDrop}>
                                                <Search
                                                    onClick={this.onClick}
                                                    value={this.state.searchValue}
                                                    onChange={this.onChange}
                                                    style={{marginBottom : '5px' , borderRadius : '30px'}}
                                                    placeholder="Input tags"
                                                    onSearch={() => {
                                                        this.setState({currentPage : 1 , mainPageLoadingMore : false , isEmpty : false , picData : []} , () => {
                                                            utils_ajax.reqPic(this.state.searchValue , this , this.state.currentPage)
                                                        })
                                                    }}
                                                />
                                            </Dropdown>
                                        </Col>
                                    </Row>
                                        {
                                            this.state.mainPageLoading ? (
                                                <div className='loadingPage'>
                                                    <div className='loading_div loading_div_icon'>
                                                        <SyncOutlined className='loading' spin></SyncOutlined>
                                                    </div>
                                                    <div className='loading_div'>Now Loading…</div>
                                                </div>
                                            ) : this.state.toShowPicData ? (
                                                <div className="site-card-wrapper">
                                                    <Row gutter={16} align='middle'>
                                                        {
                                                            this.state.picData.map((item , index) => {
                                                                return <KonachanCard mainOBJ={this} src={item.preview_url} data={item}></KonachanCard>
                                                            })
                                                        }
                                                    </Row>
                                                </div>
                                            ) : ''
                                        }

                                        {
                                            this.state.isEmpty ? (
                                                <Row style={{marginTop : '60px' , marginBottom : '60px'}} justify='center'>
                                                    <div className='loading_div'>没有更多了</div>
                                                </Row>
                                            ) : this.state.mainPageLoadingMore && !this.state.mainPageLoading ? (
                                                <Row style={{marginTop : '120px'}} justify='center'>
                                                    <SyncOutlined className='loadingMore' spin></SyncOutlined>
                                                </Row>
                                            ) : ''
                                        }
                                </div>
                            </Content>
                        </Col>
                    </Row>
                    <Footer style={{ textAlign: 'center' , backgroundColor : 'rgb(86, 86, 255)' , color : 'white'}}>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </div>
        )
    }
}

export default Main