import React, { useState, useRef, useContext, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Colors from "../../Utils/Colors";
import DropDownPicker from "react-native-dropdown-picker";
import { UserContext } from "../../store/UserContext";

const ServiceSelection = () => {
  const {
    barbers: contextBarbers,
    services: contextServices,
    setSelectedService,
    selectedService,
    setSelectedBarber,
    selectedBarber,
    value,
    setValue,
  } = useContext(UserContext);

  //open Services dropdown
  const [openServiceDropdown, setOpenServiceDropdown] = useState(false);

  const servicesMap = contextServices.map((service) => ({
    label: service.name + " - " + service.price + "€",
    value: service.id,
  }));

  const [services, setServices] = useState(servicesMap);

  useEffect(() => {
    setSelectedService(
      value.map((serviceId) =>
        contextServices.find((service) => service.id === serviceId)
      )
    );
  }, [value, contextServices, setSelectedService]);

  //open barbers dropdown
  const [openBarberDropdown, setOpenBarberDropdown] = useState(false);

  const barbersMap = contextBarbers.map((barber) => ({
    label: barber.name,
    value: barber.id,
  }));

  const [barbers, setBarbers] = useState(barbersMap); // Initialize with an empty array
  const [valueBarber, setValueBarer] = useState(selectedBarber.id);

  useEffect(() => {
    setValueBarer(selectedBarber.id);
    setSelectedBarber(selectedBarber);
  }, [selectedBarber]);

  useEffect(() => {
    const selectedBarberFromDropdown = contextBarbers.find(
      (c) => c.id === valueBarber
    );
    setSelectedBarber(selectedBarberFromDropdown);
  }, [valueBarber]);

  const [marginServices, setMarginServices] = useState(50);
  const [marginBarbers, setMarginBarbers] = useState(50);

  useEffect(() => {
    const countBarbers = contextBarbers.length;
    const countServices = contextServices.length;
    setMarginServices(countServices * 50);
    setMarginBarbers(countBarbers * 50);
  }, [contextBarbers, contextServices]);

  const formattedValue = value.map((serviceId) => {
    const service = contextServices.find((service) => service.id === serviceId);
    return service ? `${service.name} - ${service.price}€` : "";
  });

  return (
    <View style={{ marginTop: 50 }}>
      <Text
        style={{
          color: Colors.WHITE,
          marginBottom: 5,
          fontSize: 14,
          fontFamily: "outfit-b",
        }}
      >
        Zgjedh berberin
      </Text>
      <DropDownPicker
        placeholder=""
        open={openBarberDropdown}
        value={valueBarber}
        items={barbers}
        setOpen={setOpenBarberDropdown}
        setValue={setValueBarer}
        setItems={setBarbers}
        style={[
          style.dropdown,
          openBarberDropdown && {
            marginBottom: marginBarbers,
          },
        ]}
        textStyle={style.textStyle}
        dropDownContainerStyle={style.dropdown}
      />

      <Text
        style={{
          color: Colors.WHITE,
          marginBottom: 5,
          fontSize: 14,
          fontFamily: "outfit-b",
        }}
      >
        Zgjedh shërbimin
      </Text>
      <DropDownPicker
        placeholder=""
        open={openServiceDropdown}
        value={value}
        items={services}
        setOpen={setOpenServiceDropdown}
        setValue={setValue}
        setItems={setServices}
        style={[
          style.dropdown,
          openServiceDropdown && {
            marginBottom: marginServices,
          },
        ]}
        textStyle={style.textStyle}
        dropDownContainerStyle={style.dropdownDrop}
        multiple={true}
        multipleText={formattedValue.join(", ")}
        tickColor="#ff0000" 
      />
    </View>
  );
};

const style = StyleSheet.create({
  dropdown: {
    borderColor: Colors.WHITE,
    backgroundColor: Colors.BLACK,
    color: Colors.WHITE,
    marginBottom: 20,
    zIndex: 0,
  },
  textStyle: {
    color: Colors.WHITE,
    fontFamily: "outfit-md",
    fontSize: 14,
    backgroundColor: Colors.BLACK,
  },
  dropdownDrop: {
    borderColor: Colors.WHITE,
    backgroundColor: Colors.BLACK,
    color: Colors.WHITE,
  },
});

export default ServiceSelection;
