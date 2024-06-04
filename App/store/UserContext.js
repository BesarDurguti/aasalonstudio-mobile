import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosClient from "../axios";
import Loader from "../Screens/Loader/Loader";
import usePushNotifications from "../usePushNotification";

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

  const expoPushToken = usePushNotifications();

  const getUserData = async () =>{
    const storedToken = await AsyncStorage.getItem("token");
    const storedUser = await AsyncStorage.getItem("user");

    if (storedToken && storedUser) {
      const userJson = JSON.parse(storedUser);
      setUser(userJson);
      setToken(storedToken);
      setIsLogged(true);
    }else{
      setIsLogged(false);
      setLoading(false);
    }

  }

  const getBarbers = async () => {
    if (user && token) {
      try {
        const responseBarbers = await axiosClient.get(
          `/api/getBarbers?gender=${user.gender}`
        );
        if (
          responseBarbers.data.barbers &&
          responseBarbers.data.barbers.length > 0
        ) {
          setBarbers(responseBarbers.data.barbers);
          setSelectedBarber(responseBarbers.data.barbers[0]);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getServices = async () => {
    // console.log('a JEMI KTU');
    if (user && token) {
      try {
        const responseServices = await axiosClient.get(`/api/getServices?gender=${user.gender}`);
        if(responseServices.data.services && responseServices.data.services.length > 0){
          setServices(responseServices.data.services);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const getSiteInfos = async () => {
      // console.log('A jemi ktu');
    if (user && token) {
      try {
        const responseSiteInfos = await axiosClient.get(`/api/getSiteInfos`);
        if(responseSiteInfos.data.infos && responseSiteInfos.data.infos.length > 0){
          setSiteInfos(responseSiteInfos.data.infos);
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  const getDataAll = async () => {
    await getBarbers();
    await getServices();
    await getSiteInfos();

    setLoading(false);
  }

  useEffect(() =>{
    getUserData();

    if(isLogged){
      getDataAll();
    }
  },[isLogged])




  const updateUserLoggedInStatus = (status, user, token) => {
    if (status === true) {
      storeExpoToken(user.id);

      setUser(user);
      setToken(token);
      setIsLogged(status);
    }
  };

  const storeExpoToken = (userId) => {
    let storeExpoTokenData = {
      expo_token: expoPushToken,
      user_id: userId,
    };

    // console.log('Checking if we have expo token:',storeExpoTokenData);

    axiosClient
      .post(`/api/store-token`, storeExpoTokenData)
      .then((response) => {})
      .catch((error) => {
        console.error("error", error);
      });
  };

  const logoutForProfile = async () => {

    await deleteExpoToken();
    await axiosClient.post("/api/logout");

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    setIsLogged(false);
  }

  const deleteExpoToken = async () => {
    let storeExpoTokenData = {
      expo_token: expoPushToken,
      user_id: user.id,
    };

    await axiosClient
      .delete(`/api/delete-token`, { data: storeExpoTokenData })
      .then((response) => {})
      .catch((err) => {
        console.log("error deleting the token", err);
      });
  };

  if (loading) {
    return <Loader />;
  }

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
        deleteExpoToken,
        logoutForProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
