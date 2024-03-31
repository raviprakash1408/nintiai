/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState, useRef} from 'react';
import {
  AudioConfig,
  AudioInputStream,
  SpeechConfig,
  SpeechRecognizer,
} from 'microsoft-cognitiveservices-speech-sdk';
import AudioRecord from 'react-native-live-audio-stream';
import RNFS from 'react-native-fs';
import {PermissionsAndroid, Platform} from 'react-native';
import useTranscriptionStore from '../store/transcriptionControlStore';
import useSubMenuedStore from '../store/subMenuStore';
import {jobDetails} from '../utils/JobDetails';

export const useSpeechToText = () => {
  const key = process.env.SPEECH_SDK_KEY;
  const region = process.env.SPEECH_SDK_REGION;
  const language = 'en-IN';

  const {
    setTranscript,
    setStartTranscription,
    setPauseTranscription,
    pauseTranscription,
    setStopTranscription,
    stopTranscription,
  } = useTranscriptionStore();
  const [current, setCurrent] = useState('');
  const pauseTranscriptionRef = useRef(pauseTranscription); // Ref to track pauseTranscription state
  const [audioFilePath, setAudioFilePath] = useState('');

  let recognizer: SpeechRecognizer; // Keep recognizer as mutable reference

  const {showMenu} = useSubMenuedStore();
  useEffect(() => {
    pauseTranscriptionRef.current = pauseTranscription; // Update ref whenever pauseTranscription changes
  }, [pauseTranscription]);

  useEffect(() => {
    const normalizedCurrent = current.toLowerCase();
    if (normalizedCurrent.includes('hello ai start')) {
      setStartTranscription(true);
      setPauseTranscription(false);
      setStopTranscription(false);
    } else if (normalizedCurrent.includes('pause transcription')) {
      setPauseTranscription(true);
    } else if (normalizedCurrent.includes('resume transcription')) {
      setPauseTranscription(false);
    } else if (normalizedCurrent.includes('stop transcription')) {
      setStopTranscription(true);
      stopAudio();
      setPauseTranscription(false);
      setStartTranscription(false);
    }
  }, [current]);

  const checkPermissions = async () => {
    if (Platform.OS === 'android') {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

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
        return false;
      }
    }
    return true;
  };

  const initializeAudio = async () => {
    if (await checkPermissions()) {
      const pushStream = AudioInputStream.createPushStream();
      const options = {
        sampleRate: 16000,
        channels: 1,
        bitsPerChannel: 16,
        audioSource: 6,
      };
      // @ts-ignore
      AudioRecord.init(options);
      const fileName = `recording_${new Date().toISOString()}.pcm`;
      const fullPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      setAudioFilePath(fullPath);
      AudioRecord.on('data', data => {
        const pcmData = Buffer.from(data, 'base64');
        pushStream.write(pcmData);
        // Append received audio data directly to the file
        RNFS.appendFile(fullPath, pcmData.toString('base64'), 'base64').catch(
          err => {
            console.error('Error writing to audio file', err);
          },
        );
      });

      AudioRecord.start();

      const speechConfig = SpeechConfig.fromSubscription(
        key as string,
        region as string,
      );
      speechConfig.speechRecognitionLanguage = language;
      const audioConfig = AudioConfig.fromStreamInput(pushStream);
      recognizer = new SpeechRecognizer(speechConfig, audioConfig);

      recognizer.sessionStarted = () => console.log('sessionStarted');
      recognizer.sessionStopped = () => console.log('sessionStopped');

      recognizer.recognizing = (s, e) => {
        console.log('recognizing', e.result.text);
        setCurrent(e.result.text);
      };

      recognizer.recognized = (s, e) => {
        if (
          !stopTranscription &&
          !pauseTranscriptionRef.current &&
          e.result.text
        ) {
          console.log('Updating transcript:', e.result.text);
          if (showMenu > 0) {
            jobDetails[showMenu].description = e.result.text;
            setTranscript(e.result.text.trim(), true);
          }
        }
      };

      recognizer.startContinuousRecognitionAsync(
        () => console.log('startContinuousRecognitionAsync'),
        err => console.log('Error:', err),
      );
    }
  };

  const stopAudio = async () => {
    AudioRecord.stop();
    if (recognizer) {
      recognizer.stopContinuousRecognitionAsync(
        () => console.log('Recognizer stopped'),
        err => console.error('Error stopping recognizer:', err),
      );
    }
  };

  return {initializeAudio, stopAudio, audioFilePath};
};
