//透過import方式把CSS或其他JS檔載入
import React from "react";
//用react-create-app提拱的ReactComponent元件引入svg圖示
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";

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

const Location = styled.div`
  font-size: 28px;
  color: #212121;
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: #828282;
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: #757575;
  font-size: 96px;
  font-weight: 300;
  display: flex;
`;

const Celsius = styled.div`
  font-weight: normal;
  font-size: 42px;
`;

const AirFlow = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  margin-bottom: 20px;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

const Rain = styled.div`
  display: flex;
  align-items: center;
  font-size: 16x;
  font-weight: 300;
  color: #828282;
  svg {
    width: 25px;
    height: auto;
    margin-right: 30px;
  }
`;

//CSS選擇器樣式寫法
const Refresh = styled.div`
  position: absolute;
  right: 15px;
  bottom: 15px;
  font-size: 12px;
  display: inline-flex;
  align-items: flex-end;
  color: #828282;
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
  }
`;

//(emotion)將原本存在的元件新增樣式
//新元件 = styled(<原有元件>)
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

//帶入APP元件使用
function App() {
  return (
    <Container>
      <WeatherCard>
        <Location>臺北市</Location>
        <Description>多雲時晴</Description>
        <CurrentWeather>
          <Temperature>
            23<Celsius>C</Celsius>
          </Temperature>
          <DayCloudy />
        </CurrentWeather>
        <AirFlow>
          <AirFlowIcon />
          23m/h
        </AirFlow>
        <Rain>
          <RainIcon />
          48%
        </Rain>
        <Refresh>
          最後觀測時間：上午12:03
          <RefreshIcon />
        </Refresh>
      </WeatherCard>
    </Container>
  );
}

export default App;
