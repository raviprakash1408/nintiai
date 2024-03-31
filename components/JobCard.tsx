/* eslint-disable react-native/no-inline-styles */
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {JobDetails} from '../utils/JobDetails';
import {Bar} from 'react-native-progress';
import useSubMenuedStore from '../store/subMenuStore';
// import useTranscriptionStore from '../store/transcriptionControlStore';

const JobCard = ({jobName, progress, id}: JobDetails) => {
  const {setShowMenu} = useSubMenuedStore();
  // const {setStopTranscription} = useTranscriptionStore();
  const decimalProgress = progress / 100;
  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          height: '100%',
          justifyContent: 'space-between',
        }}>
        <View style={{width: 3, height: '100%', backgroundColor: '#2FE48D'}} />
        <View style={{justifyContent: 'space-between', paddingVertical: 10}}>
          <Text style={{fontSize: 20, fontWeight: '500', color: 'white'}}>
            {jobName}
          </Text>
          <View style={{gap: 10}}>
            <Bar
              progress={decimalProgress}
              width={300}
              height={10}
              color="#59CFA5"
              unfilledColor="#ccc"
              borderWidth={0}
            />
            <Text style={{fontSize: 16, fontWeight: '400', color: 'white'}}>
              Sun, 15 Jan 2024
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{gap: 5, padding: 5}}
          onPress={() => {
            setShowMenu(id);
            // setStartTranscription(true);
            // setCurrentView('nintidoc');
            // setStopTranscription(false);
          }}>
          <View style={styles.dots} />
          <View style={styles.dots} />
          <View style={styles.dots} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  dots: {
    width: 4,
    height: 4,
    // @ts-ignore
    borderRadius: 50,
    backgroundColor: 'white',
  },
  container: {
    height: 154,
    borderRadius: 20,
    backgroundColor: '#202020',
    padding: 20,
  },
});
