/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const DateContainer = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Function to generate the array of 5 consecutive dates
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  // Function to format date as "Day Date"
  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const day = days[date.getDay()];
    const dayOfMonth = date.getDate();
    return `${day} ${dayOfMonth}`;
  };

  // Function to handle date selection
  const handleDateSelection = (date: React.SetStateAction<Date>) => {
    setSelectedDate(date);
  };

  const isSameDate = (
    date1: {getFullYear: () => any; getMonth: () => any; getDate: () => any},
    date2: {getFullYear: () => any; getMonth: () => any; getDate: () => any},
  ) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };
  // Generate the array of 5 consecutive dates
  const dates = generateDates();

  return (
    <View style={styles.container}>
      {dates.map((date, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleDateSelection(date)}
          style={[
            styles.dateBox,
            {
              backgroundColor: isSameDate(date, selectedDate)
                ? '#59CFA5'
                : 'grey',
              shadowColor: isSameDate(date, selectedDate)
                ? '#2FE48D'
                : 'transparent',
              shadowOffset: isSameDate(date, selectedDate)
                ? {width: 0, height: 0}
                : {width: 0, height: 0},
              shadowOpacity: isSameDate(date, selectedDate) ? 0.6 : 0,
              shadowRadius: isSameDate(date, selectedDate) ? 17 : 0,
            },
          ]}>
          <Text
            style={[
              styles.day,
              {
                color: isSameDate(date, selectedDate) ? 'white' : 'white',
              },
            ]}>
            {formatDate(date).split(' ')[0].toUpperCase()}
          </Text>
          <Text
            style={[
              styles.date,
              {
                color: isSameDate(date, selectedDate) ? 'white' : 'white',
              },
            ]}>
            {formatDate(date).split(' ')[1]}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
  },
  dateBox: {
    width: 62,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default DateContainer;
