import React from "react";
import styled from "@emotion/styled";
//匯入拆分的WeatherIcon元件
import WeatherIcon from "./../components/WeatherIcon";
// import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";

//用react-create-app提拱的ReactComponent元件引入svg圖示
import { ReactComponent as RainIcon } from "./../images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./../images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./../images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./../images/loading.svg";

const WeatherCardWrapper = styled.div`
  position: relative;
  min-width: 360px;
  box-shadow: ${({ theme }) => theme.boxShadow};
  background-color: ${({ theme }) => theme.foregroundColor};
  box-sizing: border-box;
  padding: 30px 15px;
`;

const Location = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.titleColor};
  margin-bottom: 20px;
`;

const Description = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.textColor};
  margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const Temperature = styled.div`
  color: ${({ theme }) => theme.temperatureColor};
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
  color: ${({ theme }) => theme.textColor};
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
  color: ${({ theme }) => theme.textColor};
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
  color: ${({ theme }) => theme.textColor};
  svg {
    width: 15px;
    height: 15px;
    margin-left: 10px;
    cursor: pointer;
    animation: rotate infinite 1.5s linear;
    /*isLoading的時候才套用旋轉效果*/
    animation-duration: ${({ isLoading }) => (isLoading ? "1.5s" : "0s")};
  }
  /* 定義旋轉的動畫效果 */
  @keyframes rotate {
    from {
      transform: rotate(360deg);
    }
    to {
      transform: rotate(0deg);
    }
  }
`;

const WeatherCard = ({ weatherElement, moment, fetchData }) => {
  const {
    observationTime,
    locationName,
    temperature,
    windSpeed,
    description,
    weatherCode,
    rainPossibility,
    comfortability,
    isLoading,
  } = weatherElement;
  return (
    <WeatherCardWrapper>
      <Location>{locationName}</Location>
      <Description>
        {description}
        {comfortability}
      </Description>
      <CurrentWeather>
        <Temperature>
          {Math.round(temperature)}
          <Celsius>C</Celsius>
        </Temperature>
        {/* 將weatherCode 和moment以props傳入weatherIcon */}
        <WeatherIcon weatherCode={weatherCode} moment={moment} />
      </CurrentWeather>
      <AirFlow>
        <AirFlowIcon />
        {windSpeed}
      </AirFlow>
      <Rain>
        <RainIcon />
        {rainPossibility}
      </Rain>
      {/* 更新onClick時會呼叫fetchData*/}
      <Refresh onClick={fetchData} isLoading={isLoading}>
        最後觀測時間：
        {new Intl.DateTimeFormat("zh-TW", {
          hour: "numeric",
          minute: "numeric",
        }).format(new Date(observationTime))}{" "}
        {isLoading ? <LoadingIcon /> : <RefreshIcon />}
      </Refresh>
    </WeatherCardWrapper>
  );
};

export default WeatherCard;
