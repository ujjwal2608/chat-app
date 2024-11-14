import React from 'react';
import {TouchableOpacity, View,Text} from 'react-native';


interface CallControlsProps {
  localMicOn: boolean;
  localWebcamOn: boolean;
  toggleMic: () => void;
  toggleCamera: () => void;
  handleHangout: () => void;
}

const CallControls: React.FC<CallControlsProps> = ({
  localMicOn,
  localWebcamOn,
  toggleMic,
  toggleCamera,
  handleHangout,
}) => {
  return (
    <View
      style={{
        height: 100,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'black',
        opacity: 0.7,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
      }}>
      <TouchableOpacity onPress={toggleMic}>
       <Text>mike</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={toggleCamera}>
        <Text>camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleHangout}
        style={{
          backgroundColor: 'red',
          borderRadius: 50,
          paddingVertical: 10,
          paddingHorizontal: 15,
        }}>
       <Text>hangout</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {}}>
      <Text>ellipsis</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CallControls;