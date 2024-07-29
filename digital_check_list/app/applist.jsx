import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState, useEffect } from 'react';
import SearchableDropdown from 'react-native-searchable-dropdown';
import axios from 'axios';

const menuItems = [
  { name: 'Digital CheckList', icon: 'checklist', color: '#4CAF50' },
  { name: 'OT Booking', icon: 'event', color: '#F44336' },
  { name: 'Digital Pass', icon: 'trending-up', color: '#E91E63' },
  { name: 'Doctor HandsOff', icon: 'person', color: '#FF9800' },
  { name: 'Credential & Privilege', icon: 'school', color: '#2196F3' },
  { name: 'Discharge Tracker', icon: 'store', color: '#8BC34A' },
  // Add more menu items as needed
];

const HomeScreen = () => {
  const [locations, setLocations] = useState([]);
  const [location, setLocation] = useState(null);
  const [animatedValues, setAnimatedValues] = useState(menuItems.map(() => new Animated.Value(0)));

  useEffect(() => {
    axios.get('http://10.10.9.89:202/api/Users/GetAllLocationList')
      .then(response => {
        const fetchedLocations = response.data.map(loc => ({
          id: loc.location_Id,
          name: loc.location_Display_Name
        }));
        setLocations(fetchedLocations);
        setLocation(fetchedLocations[0]);
      })
      .catch(error => {
        console.error('Error fetching location data:', error);
      });

    const animations = animatedValues.map((animatedValue, index) => {
      return Animated.timing(animatedValue, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, animations).start();
  }, []);

  const renderItem = ({ item, index }) => {
    const animatedStyle = {
      transform: [
        { scale: animatedValues[index] },
        {
          translateY: animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }),
        },
      ],
      opacity: animatedValues[index].interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    return (
      <Animated.View style={[styles.menuItem, animatedStyle]}>
        <TouchableOpacity style={[styles.menuButton, { backgroundColor: item.color }]}>
          <MaterialIcons name={item.icon} size={40} color="white" />
        </TouchableOpacity>
        <Text style={styles.menuText}>{item.name}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)}
          onItemSelect={(item) => setLocation(item)}
          containerStyle={styles.dropdown}
          textInputStyle={styles.dropdownTextInput}
          itemStyle={styles.dropdownItem}
          itemTextStyle={styles.dropdownItemText}
          itemsContainerStyle={styles.dropdownItemsContainer}
          items={locations}
          defaultIndex={0}
          placeholder="Select a location"
          resetValue={false}
          underlineColorAndroid="transparent"
        />
      </View>

      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    width: '100%',
  },
  dropdownTextInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    color: '#333',
  },
  dropdownItem: {
    padding: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    color: '#333',
  },
  dropdownItemsContainer: {
    maxHeight: 140,
  },
  flatListContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  menuItem: {
    flex: 1,
    margin: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    paddingTop: 20,
  },
  menuButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  menuText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default HomeScreen;
