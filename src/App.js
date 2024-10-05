//匯入getMoment()
import { getMoment } from "./utils/helpers";
//透過import方式把CSS或其他JS檔載入
//從react載入useState,useEffect,useCallback,useMemo方法
import React, { useState, useEffect, useCallback, useMemo } from "react";

//移除引用App.css，載入emotion
// import "./App.css";
import styled from "@emotion/styled";
//引用ThemeProvider
import { ThemeProvider } from "@emotion/react";
//載入WeatherCard元件
import WeatherCard from "./views/WeatherCard";
//元件式寫法CSS
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
const AUTHORIZATION_KEY = "CWA-F0C23CB4-9E98-4689-961C-76B38B358FA3";

//針對某地區發送API請求
const LOCATION_NAME = "臺中市";

//第二隻API要帶入的值不同，另外宣告一個變數名稱
const LOCATION_NAME_FORECAST = "467490";

//！因為fetchCurrentWeather及fetWeatherForecast不再需要使用setWeatherElement方法
//所以可以搬到<App/>元件外自由使用

const fetchCurrentWeather = () => {
  //加上return 直接回傳fetch API回傳的promise
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${AUTHORIZATION_KEY}&StationId=${LOCATION_NAME_FORECAST}`
  )
    .then((response) => response.json())
    .then((data) => {
      // STEP 1：定義 `locationData` 把回傳的資料中會用到的部分取出來
      const locationData = data.records.Station[0];

      return {
        observationTime: locationData.ObsTime.DateTime,
        locationName: locationData.StationName,
        temperature: locationData.WeatherElement.AirTemperature,
        windSpeed: locationData.WeatherElement.WindSpeed,
      };
    });
};

//呼叫天氣預報API
const fetchWeatherForecast = () => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${AUTHORIZATION_KEY}&locationName=${LOCATION_NAME}`
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

  //使用getMoment()判斷白天晚上，再帶入<WeatherIcon/> 的moment中
  //TODO 等使用者可以修改地區時，要修改裡面的參數(目前dependencies先設定為[])
  const moment = useMemo(() => getMoment(LOCATION_NAME), []);
  useEffect(() => {
    //依據moment決定要使用亮色or暗色主題
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);
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

  //把fetchData搬出useEffect
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

  useEffect(() => {
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
    weatherCode, //從weatherElement中取出weatherCode資料
  } = weatherElement;

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
      {/* weatherCard需要的資料透過 */}
        <WeatherCard
          weatherElement={weatherElement}
          moment={moment}
          fetchData={fetchData}
        />
      </Container>
    </ThemeProvider>
  );
}

export default App;
