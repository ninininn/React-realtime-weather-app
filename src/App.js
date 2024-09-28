//透過import方式把CSS或其他JS檔載入
import React from "react";
import logo from "./logo.svg";

//移除引用App.css，載入emotion
// import "./App.css";
import styled from "@emotion/styled";

//元件式寫法CSS
const Container = styled.div`
  background-color: #ededed;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: 0 1px 3px 0 #999999;
  box-sizing: border-box;
  padding: 30px 15px;
`;

//帶入APP元件使用
function App() {
  return (
    <Container>
      <WeatherCard>
        <h1>Weather</h1>
      </WeatherCard>
    </Container>
  );
}

export default App;
