/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {Fragment, useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import DateContainer from './DateContainer';
import JobCard from './JobCard';
import {jobDetails} from '../utils/JobDetails';
import useSubMenuedStore from '../store/subMenuStore';
import NintiDoc from './NintiDoc';
import 'react-native-get-random-values';
import 'node-libs-react-native/globals';
import {
  AudioConfig,
  AudioInputStream,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import {LogBox} from 'react-native';
import AudioRecord from 'react-native-live-audio-stream';
import useTranscriptionStore from '../store/transcriptionControlStore';
import Transcription from './Transcription';
import RNFS from 'react-native-fs';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import Tts from 'react-native-tts';
LogBox.ignoreLogs(['new NativeEventEmitter']);
interface DashboardProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function Dashboard({navigation}: DashboardProps) {
  const key = process.env.SPEECH_SDK_KEY;
  const region = process.env.SPEECH_SDK_REGION;
  const language = 'en-IN';
  const {showMenu, setShowMenu, currentView, setCurrentView} =
    useSubMenuedStore();
  // const [transcript, setTranscript] = useState('');
  const [msg, setMsg] = useState('');

  const {
    startTranscription,
    pauseTranscription,
    stopTranscription,
    setStartTranscription,
    setTranscript,
    setPauseTranscription,
    setStopTranscription,
    transcript,
  } = useTranscriptionStore();
  const [shouldAppendData, setShouldAppendData] = useState(true);

  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const channels = 1;
  const bitsPerChannel = 16;
  const sampleRate = 16000;

  let initializedCorrectly = false;
  let recognizer: SpeechRecognizer;

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener('focus', () => {
      // Re-initialize or reset component state here
      setShouldAppendData(true);
    });

    const unsubscribeBlur = navigation.addListener('blur', () => {
      // Cleanup or pause processes here
      stopAudio();
      setShouldAppendData(true);
    });

    return () => {
      unsubscribeFocus();
      unsubscribeBlur();
    };
  }, [navigation]);

  const handleTtsProgress = (event: any) => {
    // Handle tts-progress event
    console.log('TTS Progress:', event);
  };

  const handleTtsFinish = (event: any) => {
    // Handle tts-finish event
    console.log('TTS Finished:', event);
  };

  useEffect(() => {
    Tts.addEventListener('tts-progress', handleTtsProgress);
    Tts.addEventListener('tts-finish', handleTtsFinish);

    // Cleanup function
    return () => {
      Tts.removeEventListener('tts-progress', handleTtsProgress);
      Tts.removeEventListener('tts-finish', handleTtsFinish);
    };
  }, []);

  useEffect(() => {
    if (startTranscription) {
      setStopTranscription(false);
      console.log('inside start transcription 1', shouldAppendData);
      // setShouldAppendData(true);
      console.log('inside start transcription');
      initializeAudio();
      return () => {
        if (stopTranscription) {
          stopAudio();
          console.log('inside start transcription 2', shouldAppendData);
          setShouldAppendData(true);
        }
      };
    }
  }, [startTranscription]);

  useEffect(() => {
    if (pauseTranscription) {
      // Start speaking "Ninti is waiting" at 30-second intervals
      const id = setInterval(() => {
        Tts.speak('Ninti is waiting', {
          iosVoiceId: 'com.apple.ttsbundle.Moira-compact',
          rate: 0.5,
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 1,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });
      }, 10000); // 30 seconds interval
      setIntervalId(id);
    } else {
      // Clear the interval when pauseTranscription becomes false
      if (intervalId) {
        clearInterval(intervalId);
      }
      setIntervalId(null);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [pauseTranscription]);

  useEffect(() => {
    if (showMenu !== 0 && !stopTranscription) {
      setStartTranscription(true);
    }
  }, [showMenu, startTranscription]);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log('write external storage', grants);

        if (
          grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.READ_EXTERNAL_STORAGE'] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants['android.permission.RECORD_AUDIO'] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log('Permissions granted');
        } else {
          console.log('All required permissions not granted');
          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }
  };

  // useEffect(() => {}, [startTranscription]);

  useEffect(() => {
    const normalizedCommand = msg.toLowerCase();
    if (
      normalizedCommand.includes('hello ai start') ||
      normalizedCommand.includes('hello niti start')
    ) {
      console.log('command received:', msg);
      setTranscript('');
      setCurrentView('transcription');
      setPauseTranscription(false);
      setStopTranscription(false);
      setMsg('');
    } else if (
      normalizedCommand.includes('pause transcription') &&
      !stopTranscription
    ) {
      setPauseTranscription(true);
    } else if (
      normalizedCommand.includes('resume transcription') &&
      !stopTranscription
    ) {
      setPauseTranscription(false);
      setStartTranscription(true);
      console.log('inside resume');
      initializeAudio();
    } else if (normalizedCommand.includes('stop transcription')) {
      jobDetails[showMenu].description = transcript;
      setStopTranscription(true);
      AudioRecord.stop();
      stopAudio();
    }
  }, [msg, pauseTranscription, startTranscription, stopTranscription]);

  console.log(jobDetails[showMenu].description);

  const initializeAudio = async () => {
    await checkPermissions();
    if (!initializedCorrectly) {
      //creates a push stream system which allows new data to be pushed to the recognizer
      const audioFilePath = `${RNFS.DocumentDirectoryPath}/recordedAudio.pcm`;
      console.log('inside start transcription 3', shouldAppendData);
      setShouldAppendData(true);
      const pushStream = AudioInputStream.createPushStream();
      const options = {
        sampleRate,
        channels,
        bitsPerChannel,
        audioSource: 6,
      };
      // @ts-ignore
      AudioRecord.init(options);
      //everytime data is recieved from the mic, push it to the pushStream
      AudioRecord.on('data', data => {
        console.log('before if', shouldAppendData);
        if (!shouldAppendData) {
          console.log('Skipping data append due to stop signal');
          return;
        }
        const pcmData = Buffer.from(data, 'base64');
        pushStream.write(pcmData);
        RNFS.appendFile(audioFilePath, pcmData.toString('base64'), 'base64')
          .then(() => console.log('Data appended to file'))
          .catch(err => console.error('Error writing to file', err));
      });

      AudioRecord.start();

      const speechConfig = SpeechConfig.fromSubscription(
        key as string,
        region as string,
      );
      speechConfig.speechRecognitionLanguage = language;
      const audioConfig = AudioConfig.fromStreamInput(pushStream); //the recognizer uses the stream to get audio data
      recognizer = new SpeechRecognizer(speechConfig, audioConfig);

      recognizer.sessionStarted = (s, e) => {
        console.log('sessionStarted');
        console.log(e.sessionId);
      };

      recognizer.sessionStopped = (s, e) => {
        console.log('sessionStopped');
      };

      recognizer.recognizing = (s, e) => {
        //The recognizer will return partial results. This is not called when recognition is stopped and sentences are formed but when recognizer picks up scraps of words on-the-fly.
        setMsg(e.result.text);
        console.log(e.result.text);
      };
      recognizer.recognized = (s, e) => {
        console.log('Recognized:', e.result.text);
        const normalizedText = e.result.text.toLowerCase();
        const isStartCommand =
          normalizedText.includes('hello ai start') ||
          normalizedText.includes('hello niti start');

        console.log(
          'Conditions:',
          !pauseTranscription,
          !stopTranscription,
          isStartCommand,
        );

        console.log(
          'Conditions:',
          !pauseTranscription,
          !stopTranscription,
          isStartCommand,
        );

        if (e.result.text && !stopTranscription) {
          if (isStartCommand) {
            console.log(
              'Start command recognized, updating view and states accordingly',
            );
            setCurrentView('transcription');
            setPauseTranscription(false);
            setStopTranscription(false);
            setTranscript('');
          } else if (
            !pauseTranscription &&
            startTranscription &&
            !stopTranscription
          ) {
            console.log('Setting transcript:', e.result.text);
            setTranscript(e.result.text);
          }
        }
      };

      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log('startContinuousRecognitionAsync');
        },
        err => {
          console.log(err);
        },
      );

      initializedCorrectly = true;
    }
  };

  //stops the audio stream and recognizer
  const stopAudio = async () => {
    console.log('Stopping audio...');
    console.log('inside start transcription 4', shouldAppendData);
    setShouldAppendData(false);
    AudioRecord.stop();
    console.log('AudioRecord stopped');

    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log('Recognizer stopped');
          initializedCorrectly = false;
        },
        err => {
          console.error('Error stopping recognizer:', err);
        },
      );
    }
  };

  useEffect(() => {
    if (stopTranscription || pauseTranscription) {
      // stopAudio();
      setStartTranscription(false);
    }
  }, [pauseTranscription, stopTranscription]);

  return (
    <View style={{flex: 1}}>
      {!currentView && (
        <LinearGradient
          colors={['#000000', '#000000', '#071f16']}
          start={{x: 0.5, y: 0.5}}
          style={styles.linearGradient}>
          <ScrollView>
            <View style={styles.scrollViewContent}>
              <View style={{flex: 1, gap: 6}}>
                <View>
                  <View style={{alignItems: 'center'}}>
                    <Text
                      style={{color: 'white', fontSize: 20, fontWeight: '400'}}>
                      Hi Dr. Here is the list of surgeries
                    </Text>
                    <Text
                      style={{
                        color: '#FFFFFFBF',
                        fontSize: 18,
                        fontWeight: '400',
                        marginTop: 3,
                      }}>
                      Please tab to choose the mode
                    </Text>
                  </View>
                  <View style={{marginTop: 30}}>
                    <DateContainer />
                  </View>
                  <View
                    style={{
                      marginTop: 20,
                      padding: 10,
                      gap: 10,
                    }}>
                    {jobDetails.map((job, index) => (
                      <Fragment key={index}>
                        {showMenu === 0 && (
                          <JobCard
                            jobName={job.jobName}
                            progress={job.progress}
                            id={job.id}
                          />
                        )}
                        {showMenu === job.id && (
                          <View style={styles.container}>
                            <TouchableOpacity
                              style={{padding: 10}}
                              onPress={() => setShowMenu(0)}>
                              <Text
                                style={{
                                  color: 'red',
                                  fontSize: 20,
                                  fontWeight: '800',
                                }}>
                                X
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                padding: 10,
                              }}
                              onPress={() => setCurrentView('nintidoc')}>
                              <Text
                                style={{
                                  color: 'white',
                                  fontSize: 20,
                                  fontWeight: '500',
                                }}>
                                NintiDoc
                              </Text>
                              <Image
                                source={require('../assets/icons/arrow.png')}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: 10,
                              }}>
                              <View>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize: 20,
                                    fontWeight: '500',
                                  }}>
                                  Analyse recording
                                </Text>
                                <Text
                                  style={{
                                    color: 'white',
                                    fontSize: 10,
                                    fontWeight: '500',
                                  }}>
                                  (Beta)
                                </Text>
                              </View>
                              <Image
                                source={require('../assets/icons/arrow.png')}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View style={styles.completedContainer}>
                                <Text
                                  style={{
                                    color: '#2FE48D',
                                    fontSize: 16,
                                    fontWeight: '400',
                                  }}>
                                  Mark as completed
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                      </Fragment>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      )}
      {currentView === 'nintidoc' && (
        <NintiDoc back={() => setCurrentView('')} />
      )}
      {currentView === 'transcription' && (
        <Transcription
          back={() => {
            setCurrentView('nintidoc');
          }}
          navigation={navigation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 50,
  },
  linearGradient: {
    flex: 1,
  },
  container: {
    borderRadius: 20,
    backgroundColor: '#202020',
    padding: 10,
  },
  completedContainer: {
    borderRadius: 20,
    borderColor: '#2FE48D',
    borderWidth: 2,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});
