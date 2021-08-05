import styled from 'styled-components'

export const MainContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background: linear-gradient(#93C6D6, #A7ACD9);
  height: 100%;
`

export const SidebarWrapper = styled.div`
  font-family: "Open Sans";
  font-style: normal;
  color: #f2f2f2;
  display: flex;
  flex-direction: column;
  padding: 0 1rem 1rem 1rem;
  width: 40%;
  border-right: 2px solid #444444;
  min-width: 260px;
`

export const DisplayWrapper = styled.div`
  padding-bottom: 5rem;
  padding-left: 1rem;
  font-family: "Open Sans";
  font-style: normal;
  line-height: 1.25rem;
  display: flex;
  flex-direction: column;
  width: 100%;
`

export const BannerWrapper = styled.div`
margin: 0;
border: 0;
min-width: 768px;
background: radial-gradient(#aaaaaa, #666666);
display: flex;
justify-content: space-around;
align-items: center;
border-bottom: 2px solid #444444;
`

export const FooterWrapper = styled.div`
min-width: 768px;
height: 4rem;
background: radial-gradient(#aaaaaa, #666666);
display: flex;
flex-direction: row-reverse;
align-items: center;
a {
  background: rgba(255, 255, 255, 0.5);
  padding: 0.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  margin-right: 1rem;
}
`

export const ContentWrapper = styled.div`
width: 90%;
align-items: left;
padding-bottom: 1rem;
padding-top: 1rem;
`

export const InfoWrapper = styled.div`
padding: 0.5rem 0 0.5rem 1rem;
`

export const BackgroundWrapper = styled.div`
background-color: rgba(255, 255, 255, 0.5);
border-radius: 0.75rem;
padding: 0.5rem;
`

export const ChartWrapper = styled.div`
width: 80%;
max-width: 550px;
min-width: 350px;
padding: 0.5rem;
background-color: #eeeeee;
border: 1px solid #777777;
border-radius: 0.75rem;
margin: 0.5rem;
`

export const LoadingWrapper = styled.div`
padding: 3rem;
`

export const Header = styled.h1`
font-size: 1.5rem;
margin: 0;
color: #000000;
padding: 1.5rem 0;
`

export const SubHeader = styled.h2`
font-size: 1.25rem;
margin: 0;
padding: 0.5rem 0;
`