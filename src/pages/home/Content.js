import React, { useEffect, useState } from 'react'
import { Layout, Button, Carousel } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { NavLink, useHistory } from 'react-router-dom'
import { listHomeData, listTopCollections } from './store/actions'
import CardImg from './CardImg'
import Img from './Img'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import TopList from './TopList'
import ccc from '@/assets/images/ccc.png'
import { useViewport } from '@/components/hooks'
import CarouselComponent from '@/components/carouselComponent'
import { POPULAR_ALONE_CANVAS, POPULAR_COLLECTIBLES, HOME_BANNER_AD } from './store/constants'
import Dialog from '@/components/dialog'
import CreateAll from '@/pages/create/view/create-all'

const { Content } = Layout

export default React.memo(() => {
  const history = useHistory()
  const dispatch = useDispatch()
  useEffect(async () => {
    dispatch(listHomeData(POPULAR_ALONE_CANVAS))
    dispatch(listHomeData(POPULAR_COLLECTIBLES))
    dispatch(listHomeData(HOME_BANNER_AD))
    dispatch(listTopCollections())
  }, [])

  const { headerImg, imgList, result, homeBannner, CollectiblesData } = useSelector((state) => {
    let res = state.allcavans.getIn([POPULAR_ALONE_CANVAS])
    return {
      headerImg: res?.data[0] || {},
      imgList: res?.data.slice(1),
      result: (state.allcavans.getIn(['topCollectibles'])?.results || []).map((item) => {
        return { ...item }
      }),
      homeBannner: state.allcavans.getIn([HOME_BANNER_AD]),
      CollectiblesData: state.allcavans.getIn([POPULAR_COLLECTIBLES])
    }
  }, shallowEqual)

  const jumpToDetail = (item) => {
    if (item.link) history.push(item.link)
    else history.push(`/collection/${item.project}/items`)
  }

  const { width } = useViewport()
  const breakpoint = 1200
  return (
    <Content className="home-content">
      <div className="header" style={{ backgroundImage: `url(${headerImg.image_url})` }}></div>
      <div className="home-mainContent">
        <div className="header-content">
          <div className="left">
            <div className="left-title">
              <>Create, Discover, collect and</>
              <span className="title-sell">sell collectibles in Web3.</span>
            </div>
            <p className="left-text">C3Protocol, a connector between Creators and Web3.</p>
            <div>
              <Button className="ccc-confirm-btn" onClick={() => history.push(`/marketplace`)}>
                Explore
              </Button>
              <Button
                className="ccc-cancel-btn"
                style={{ marginLeft: '40px' }}
                onClick={() => Dialog.createAndShowDialog(<CreateAll />, 0)}
              >
                Create
              </Button>
            </div>
          </div>
          <div className="right">
            <Img item={headerImg} className={'headerImg'} type={'showHeader'} />
          </div>
        </div>
        <div className="content">
          {homeBannner && homeBannner.length > 0 && (
            <div className="banner">
              {
                <Carousel autoplay effect="fade">
                  {homeBannner.map((item, index) => {
                    return (
                      <div key={index} style={{ width: '100%', height: 'fit-content' }}>
                        <img
                          src={item.image_url}
                          onClick={() => jumpToDetail(item)}
                          style={{
                            objectFit: 'cover',
                            width: '100%',
                            height: '100%',
                            borderRadius: '10px'
                          }}
                        ></img>
                      </div>
                    )
                  })}
                </Carousel>
              }
            </div>
          )}
          <div className="art-work">
            {width < breakpoint ? (
              <>
                <h3 className="art-title">Popular Artwork</h3>
                <CarouselComponent
                  wrapClassName="carouse-img"
                  className="ccc-phone-carouse"
                  data={imgList}
                  showDetail={true}
                  type="avatar"
                />
              </>
            ) : (
              <CardImg title="Popular Artwork" data={imgList} type={'showDetail'} />
            )}

            <NavLink className="work-link" to={'marketplace/personal'}>
              View all Artwork
              <span>
                <RightOutlined />
              </span>
            </NavLink>
          </div>
          <div className="art-work">
            <TopList title={'Top collections over'} data={result || []} width={width} />
          </div>
          <div className="art-work">
            {width < breakpoint ? (
              <>
                <h3 className="art-title">Popular Collectibles</h3>
                <CarouselComponent
                  wrapClassName="carouse-img"
                  className="ccc-phone-carouse"
                  data={CollectiblesData}
                  showDetail={true}
                  type="info"
                />
              </>
            ) : (
              <CardImg title="Popular Collectibles" data={CollectiblesData} type={'showInfo'} />
            )}

            <NavLink className="work-link" to={'marketplace/crowd'}>
              View all Artwork
              <span>
                <RightOutlined />
              </span>
            </NavLink>
          </div>
          <div className="ccc-png">
            <p className="title">
              <span>Connector Between Creators & Web3</span>
            </p>
            <div className="img">
              <img src={ccc} />
            </div>
          </div>
        </div>
      </div>
    </Content>
  )
})
