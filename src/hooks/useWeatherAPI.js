import { useState, useEffect, useCallback } from "react"; //！因為fetchCurrentWeather及fetWeatherForecast不再需要使用setWeatherElement方法
//所以可以搬到<App/>元件外自由使用
//custom Hooks

const fetchCurrentWeather = ({ authorizationKey, locationName }) => {
  //加上return 直接回傳fetch API回傳的promise
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${authorizationKey}&StationId=${locationName}`
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
const fetchWeatherForecast = ({ authorizationKey, cityName }) => {
  return fetch(
    `https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${authorizationKey}&locationName=${cityName}`
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

const useWeatherAPI = ({ locationName, cityName, authorizationKey }) => {
  //加入useState中用來定義的weatherElement
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

  const fetchData = useCallback(async () => {
    setWeatherElement((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    const [currentWeather, weatherForecast] = await Promise.all([
      fetchCurrentWeather({ authorizationKey, locationName }),
      fetchWeatherForecast({ authorizationKey, cityName }),
    ]);

    //記得把變數放入dependencies array中
    setWeatherElement({
      ...currentWeather,
      ...weatherForecast,
      isLoading: false,
    });
  }, [authorizationKey, cityName, locationName]);

  useEffect(() => {
    //step3. 在useEffect中呼叫此fetchData()
    fetchData();
  }, [fetchData]);

  //hooks最後回傳的是讓其他元件使用的資料或方法
  return [weatherElement, fetchData];
};

export default useWeatherAPI;
