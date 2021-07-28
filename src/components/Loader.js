import React from 'react'
import { MainWrapper, LoadingWrapper, Header } from '../utils/wrappers'
import ContentLoader from 'react-content-loader'

const Loader = () => {
  return (
    <MainWrapper>
      <LoadingWrapper>
        <Header>Loading...</Header>
        <ContentLoader 
          speed={3}
          width={700}
          height={360}
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        ></ContentLoader>
      </LoadingWrapper>
    </MainWrapper>
  )
}

export default Loader