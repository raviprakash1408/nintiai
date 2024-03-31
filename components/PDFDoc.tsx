/* eslint-disable react-native/no-inline-styles */
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import React, {useRef, useState} from 'react';
import {
  View,
  Button,
  Modal,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import SignatureScreen, {SignatureViewRef} from 'react-native-signature-canvas';
// import useTranscriptionStore from '../store/transcriptionControlStore';
import useSubMenuedStore from '../store/subMenuStore';
import useTranscriptionStore from '../store/transcriptionControlStore';

const {height: windowHeight} = Dimensions.get('window');
interface Props {
  diagnosis: string;
  prognosis: string;
  description: string;
  navigation: NavigationProp<ParamListBase>;
}

const PDFDoc = ({diagnosis, prognosis, description, navigation}: Props) => {
  const signatureRef = useRef<SignatureViewRef>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [signatureImage, setSignatureImage] = useState<string>('');
  //   const {setStopTranscription, setStartTranscription} = useTranscriptionStore();
  const {setShowMenu, setCurrentView} = useSubMenuedStore();
  const {setTranscript} = useTranscriptionStore();

  const handleGeneratePDF = async () => {
    try {
      const signature = await getSignatureImage();

      const htmlContent = `
        <html>
          <body>
            <h1>Diagnosis</h1>
            <p>${diagnosis}</p>
            <h1>Prognosis</h1>
            <p>${prognosis}</p>
            <h1>Description</h1>
            <p>${description}</p>
            <h1>Signature</h1>
            <img src="${signature}" style="width: 100%; height: auto;" />
          </body>
        </html>
      `;

      const options = {
        html: htmlContent,
        fileName: 'generatedPDF',
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);
      console.log('PDF generated:', file.filePath);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleHome = () => {
    setCurrentView('');
    setTranscript('');
    setShowMenu(0);
    navigation.navigate('Home');
  };

  const handleSignature = async (signature: string) => {
    // Set the base64-encoded signature to the state
    setSignatureImage(signature);

    // Close the modal after saving the signature
    setModalVisible(false);
  };

  const getSignatureImage = async () => {
    // Get base64 representation of the signature
    if (signatureRef.current) {
      const signature = await signatureRef.current.readSignature();
      // Return base64 representation of the signature
      return `data:image/png;base64,${signature}`;
    }
    return '';
  };

  return (
    <View style={{flex: 1}}>
      <View style={{marginTop: 20}}>
        <Button title="Go to Home" onPress={handleHome} />
      </View>
      <ScrollView style={{flex: 1, marginTop: 10, padding: 10}}>
        <View
          style={{
            height: windowHeight,
            backgroundColor: 'white',
            paddingHorizontal: 20,
            paddingTop: 20,
            borderRadius: 10,
            paddingBottom: 20,
            maxHeight: '97%',
          }}>
          <Text style={{fontWeight: 'bold', marginBottom: 5}}>Diagnosis</Text>
          <Text>{diagnosis}</Text>
          <Text style={{fontWeight: 'bold', marginBottom: 5, marginTop: 10}}>
            Prognosis
          </Text>
          <Text>{prognosis}</Text>
          <Text style={{fontWeight: 'bold', marginBottom: 5, marginTop: 10}}>
            Description
          </Text>
          <Text style={{marginBottom: 20}}>{description}</Text>
          {signatureImage && (
            <Image
              source={{uri: signatureImage}}
              style={{width: 150, height: 50}}
            />
          )}
          <View style={{width: '70%', height: 2, backgroundColor: 'black'}} />
          <Text style={{fontWeight: 'bold', marginBottom: 5, marginTop: 10}}>
            Signature
          </Text>
        </View>
      </ScrollView>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            width: '70%',
            backgroundColor: '#00ffa3',
            paddingVertical: 15,
            borderRadius: 20,
            alignItems: 'center',
          }}
          onPress={() => setModalVisible(true)}>
          <Text style={{fontSize: 18}}>Sign yourself</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <SignatureScreen
            ref={signatureRef}
            onOK={handleSignature}
            onEmpty={() => console.log('No signature')}
            descriptionText="Sign"
            clearText="Clear"
            confirmText="Save"
            webStyle={`
              .m-signature-pad {
                border: 1px solid #000;
              }
            `}
          />
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={() => {
              setModalVisible(false);
              if (signatureRef.current) {
                signatureRef.current.clearSignature();
              }
            }}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity
          style={{
            width: '70%',
            backgroundColor: '#00ffa3',
            paddingVertical: 15,
            borderRadius: 20,
            alignItems: 'center',
            marginVertical: 10,
          }}
          onPress={handleGeneratePDF}>
          <Text style={{fontSize: 18}}>Generate PDF</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PDFDoc;
