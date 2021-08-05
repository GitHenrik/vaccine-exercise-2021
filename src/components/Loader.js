import React from 'react'
import { MainContentWrapper, LoadingWrapper, Header } from '../utils/wrappers'
import ContentLoader from 'react-content-loader'

const Loader = () => {
  return (
    <MainContentWrapper>
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
    </MainContentWrapper>
  )
}

export default Loader