import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  const renderItem = ({ item, index }) => {
    // Animated styles for 3D effect
    const animatedStyle = {
      transform: [
        { scale: animatedValue[index] },
        { translateY: animatedValue[index].interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0],
          }) },
      ],
      opacity: animatedValue[index].interpolate({
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

  // Animated value for 3D effect
  const animatedValue = menuItems.map(() => new Animated.Value(0));

  // Function to animate items on component mount
  React.useEffect(() => {
    const animations = menuItems.map((item, index) => {
      return Animated.timing(animatedValue[index], {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, animations).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}></Text> */}
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
    // backgroundColor: '#ffffff'2C3E50,
    backgroundColor: '#2C3E50',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
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
    backgroundColor: '#4CAF50',
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
