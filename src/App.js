//匯入getMoment()、2. findLocation()
import { getMoment, findLocation } from "./utils/helpers";
//透過import方式把CSS或其他JS檔載入
//從react載入useState,useEffect,useCallback,useMemo方法
import React, { useState, useEffect, useCallback, useMemo } from "react";

//載入custom hooks
import useWeatherAPI from "./hooks/useWeatherAPI";
//weatherSetting
import WeatherSetting from "./views/WeatherSetting";
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

//帶入APP元件使用
function App() {
  //localStorage中取出先前保存的地區，若沒有保存過則給預設值
  const storageCity = localStorage.getItem("cityName") || "臺中市";

  //1. 定義currentCity
  const [currentCity, setCurrentCity] = useState(storageCity);

  //3. 找出每隻API要帶入的locationName
  //4. 使用useMemo把取得的資料保存
  const currentLocation = useMemo(
    () => findLocation(currentCity),
    [currentCity]
  );

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  };
  //5. 透過解構賦值取出currentLocation資料
  const { cityName, locationName, sunriseCityName } = currentLocation;

  //定義頁面state
  const [currentPage, setCurrentPage] = useState("WeatherCard");
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage);
  };

  //使用useState並定義currentTheme預設值為light
  const [currentTheme, setCurrentTheme] = useState("light");

  //使用getMoment()判斷白天晚上，再帶入<WeatherIcon/> 的moment中
  //TODO 等使用者可以修改地區時，要修改裡面的參數(目前dependencies先設定為[])
  //6. 在getMoment參數中換成sunriseCityName
  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);
  useEffect(() => {
    //依據moment決定要使用亮色or暗色主題
    setCurrentTheme(moment === "day" ? "light" : "dark");
  }, [moment]);

  //使用hooks-weatherAPI
  //7. 在useWeatherAPI中的參數改成locationName和cityName
  const [weatherElement, fetchData] = useWeatherAPI({
    locationName,
    cityName,
    authorizationKey: AUTHORIZATION_KEY,
  });
  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {/*條件轉譯決定要呈現哪個元件 */}
        {currentPage === "WeatherCard" && (
          <WeatherCard
            cityName={cityName}
            weatherElement={weatherElement}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
        {currentPage === "WeatherSetting" && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentCityChange={handleCurrentCityChange}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
