import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, ImageSourcePropType} from 'react-native';

const BlinkingImage = ({
  source,
  blinking,
}: {
  source: ImageSourcePropType;
  blinking: boolean;
}) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (blinking) {
      // Blink the image by changing its opacity
      const interval = setInterval(() => {
        setOpacity(prev => (prev === 1 ? 0 : 1));
      }, 500); // Change opacity every 500ms

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [blinking]);

  return (
    <View style={styles.container}>
      <Image source={source} style={[styles.image, {opacity}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // Assuming you want a black background like in the image
  },
  image: {
    width: 200, // Set the width as per your requirement
    height: 200, // Set the height as per your requirement
    resizeMode: 'contain',
  },
});

export default BlinkingImage;
