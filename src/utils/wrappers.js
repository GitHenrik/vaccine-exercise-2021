import styled from 'styled-components'

export const MainWrapper = styled.div`
margin: 0;
border: 0;
min-width: 768px;
background: linear-gradient(#F3F2C9, #c4c488);
padding-bottom: 5rem;
font-family: "Open Sans";
font-style: normal;
line-height: 1.25rem;
display: flex;
flex-direction: row;
`

export const Banner = styled.div`
margin: 0;
border: 0;
min-width: 768px;
background: linear-gradient(#c4c488, #F3F2C9);
display: flex;
justify-content: center;
`

export const Divider = styled.div`
display: flex;
padding-left: 1rem;
width: 50%;
flex-direction: column;
`

export const ContentWrapper = styled.div`
width: 90%;
align-items: left;
padding-bottom: 1rem;
`

export const InfoWrapper = styled.div`
padding: 0.5rem 0 0.5rem 1rem;
`

export const BackgroundWrapper = styled.div`
background-color: rgba(128, 128, 128, 0.25);
border-radius: 0.75rem;
padding: 0.5rem;
`

export const ChartWrapper = styled.div`
max-width: 80%;
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
padding: 1.5rem 0;
`

export const SubHeader = styled.h2`
font-size: 1.25rem;
margin: 0;
padding: 0.5rem 0;
`

export const Button = styled.button`
background: ${props => props.working ? 'lightgreen' :
    props.inProgress ? 'yellow' : 'red'};

`