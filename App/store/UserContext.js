import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../axios";
import Loader from "../Screens/Loader/Loader";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState({});
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [siteInfos, setSiteInfos] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [token, setToken] = useState("");

  //for appointemnts state
  const [selectedBarber, setSelectedBarber] = useState([]);
  const [selectedService, setSelectedService] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [text, setText] = useState("");
  const [value, setValue] = useState([]);

  const fetchData = async () => {
    setLoading(true); // Show loader before getting the data
    try {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");

      if (storedToken && storedUser) {
        const userJson = JSON.parse(storedUser);
        setUser(userJson);
        setToken(storedToken);

        const [responseBarbers, responseServices, responseSiteInfos] =
          await Promise.all([
            axiosClient.get(`/api/getBarbers?gender=${userJson.gender}`),
            axiosClient.get(`/api/getServices?gender=${userJson.gender}`),
            axiosClient.get(`/api/getSiteInfos`),
          ]);

        setBarbers(responseBarbers.data.barbers);
        setSelectedBarber(responseBarbers.data.barbers[0]);
        setServices(responseServices.data.services);
        setSiteInfos(responseSiteInfos.data.infos);

        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
      setLoading(false); // Set loading to false after data fetching
    } catch (err) {
      console.log(err, err.response, "tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //TODO:FIX THE LOGIC OF WHEN TO SEND REQUESTS
    fetchData();
  }, [isLogged]);

  if (loading) {
    // Render a loader while data is being fetched
    return <Loader />;
  }

  const updateUserLoggedInStatus = (status, user, token) => {
    if (status === true) {
      setUser(user);
      setToken(token);
      setIsLogged(status);
    }
  };

  return (
    <UserContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        barbers,
        selectedBarber,
        setSelectedBarber,
        selectedService,
        setSelectedService,
        services,
        siteInfos,
        updateUserLoggedInStatus,
        selectedTime,
        setSelectedTime,
        selectedDate,
        setSelectedDate,
        setLoading,
        token,
        text,
        setText,
        value,
        setValue,
        loading, // Pass loading state to context if needed
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
