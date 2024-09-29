//透過import方式把CSS或其他JS檔載入
//從react載入useState,useEffect方法
import React, { useState, useEffect } from "react";

//用react-create-app提拱的ReactComponent元件引入svg圖示
import { ReactComponent as DayCloudyIcon } from "./images/day-cloudy.svg";
import { ReactComponent as RainIcon } from "./images/rain.svg";
import { ReactComponent as AirFlowIcon } from "./images/airFlow.svg";
import { ReactComponent as RefreshIcon } from "./images/refresh.svg";
import { ReactComponent as LoadingIcon } from "./images/loading.svg";

//移除引用App.css，載入emotion
// import "./App.css";
import styled from "@emotion/styled";
//引用ThemeProvider
import { ThemeProvider } from "@emotion/react";
//元件式寫法CSS
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherCard = styled.div`
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

//(emotion)將原本存在的元件新增樣式
//新元件 = styled(<原有元件>)
const DayCloudy = styled(DayCloudyIcon)`
  flex-basis: 30%;
`;

//定義主題色搭配
const theme = {
  light: {
    backgroundColor: "#ededed",
    foregroundColor: "#f9f9f9",
    boxShadow: "0 1px 3px 0 #999999",
    titleColor: "#212121",
    temperatureColor: "#757575",
    textColor: "#828282",
  },
  dark: {
    backgroundColor: "#1F2022",
    foregroundColor: "#121416",
    boxShadow:
      "0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)",
    titleColor: "#f9f9fa",
    temperatureColor: "#dddddd",
    textColor: "#cccccc",
  },
};
//將自己的授權碼存為一個常數
const AUTHORIZATION_KEY = "<key/>";

//針對某地區發送API請求
const LOCATION_NAME = "臺北";

//第二隻API要帶入的值不同，另外宣告一個變數名稱
const LOCATION_NAME_FORECAST = "臺北市";

//！因為fetchCurrentWeather及fetWeatherForecast不再需要使用setWeatherElement方法
//所以可以搬到<App/>元件外自由使用
const fetchCurrentWeather = () => {
  //加上return 直接回傳fetch API回傳的promise
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
  )
    .then((response) => response.json())
    .then((data) => {
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.location[0];

      // STEP 2：將風速（WDSD）和氣溫（TEMP）的資料取出
      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          if (["WDSD", "TEMP"].includes(item.elementName)) {
            neededElements[item.elementName] = item.elementValue;
          }
          return neededElements;
        },
        {}
      );
      return {
        observationTime: locationData.time.obsTime,
        locationName: locationData.locationName,
        temperature: weatherElements.TEMP,
        windSpeed: weatherElements.WDSD,
      };
    });
};

//呼叫天氣預報API
const fetchWeatherForecast = () => {
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME_FORECAST}`
  )
    .then((response) => response.json())
    .then((data) => {
      //取出某縣市的預報資料
      const locationData = data.records.location[0];

      const weatherElements = locationData.weatherElement.reduce(
        (neededElements, item) => {
          //只保留需要的 天氣現象、降雨機率、舒適度 資料
          if (["Wx", "PoP", "CI"].includes(item.elementName)) {
            //此API會回傳36小時資料，但只要用到最近12小時，所以取item
            neededElements[item.elementName] = item.time[0].parameter;
          }
          return neededElements;
        },
        {}
      );

      return {
        description: weatherElements.Wx.parameterName,
        weatherCode: weatherElements.Wx.parameterValue,
        rainPossibility: weatherElements.PoP.parameterName,
        comfortability: weatherElements.CI.parameterName,
      };
    });
};

//帶入APP元件使用
function App() {
  //使用useState並定義currentTheme預設值為light
  const [currentTheme, setCurrentTheme] = useState("light");

  //定義會使用到的資料狀態(參考API給的回應格式)
  const [weatherElement, setWeatherElement] = useState({
    observationTime: new Date(),
    locationName: "",
    temperature: 0,
    windSpeed: 0,
    description: "",
    weatherCode: 0,
    rainPossibility: 0,
    comfortability: "",
    isLoading: true,
  });

  //加入useEffect方法
  //useEffect參數需要帶入一個函式，這個函式會在 畫面轉譯完成 後被呼叫
  //放入fetchCurrentWeather方法(原本的handleClick)及dependencies([])
  useEffect(() => {
    //step1. 定義async Function fetchData()
    const fetchData = async () => {
      //在抓取資料前，先把isLoading狀態改為true
      setWeatherElement((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      //step2. 使用promise.all搭配await，等待兩支API都取得回應後才繼續
      //直接透過陣列的解構賦值來取出Promise.all回傳的資料
      const [currentWeather, weatherForecast] = await Promise.all([
        fetchCurrentWeather(),
        fetchWeatherForecast(),
      ]);

      //把取得的資料透過物件的解構賦值放入
      setWeatherElement({
        ...currentWeather,
        ...weatherForecast,
        isLoading: false,
      });
    };

    //step3. 在useEffect中呼叫此fetchData()
    fetchData();
  }, []);

  //解構賦值簡化物件
  const {
    observationTime,
    locationName,
    description,
    windSpeed,
    temperature,
    rainPossibility,
    isLoading,
    comfortability,
  } = weatherElement;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        <WeatherCard>
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
            <DayCloudy />
          </CurrentWeather>
          <AirFlow>
            <AirFlowIcon />
            {windSpeed}
          </AirFlow>
          <Rain>
            <RainIcon />
            {rainPossibility}
          </Rain>
          {/* 更新onClick時會呼叫fetchCurrentWeather及fetchWeatherForecast方法*/}
          <Refresh
            onClick={() => {
              fetchCurrentWeather();
              fetchWeatherForecast();
            }}
            isLoading={isLoading}
          >
            最後觀測時間：
            {new Intl.DateTimeFormat("zh-TW", {
              hour: "numeric",
              minute: "numeric",
            }).format(new Date(observationTime))}{" "}
            {isLoading ? <LoadingIcon /> : <RefreshIcon />}
          </Refresh>
        </WeatherCard>
      </Container>
    </ThemeProvider>
  );
}

export default App;
