import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import { RTCView, mediaDevices, RTCPeerConnection, MediaStream } from 'react-native-webrtc';
import { useSocketContext } from '../context/SocketContext';

const VideoCallScreen = () => {
  const { socket } = useSocketContext();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);

  useEffect(() => {
    // Initialize WebRTC connection
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    });

    // Get user media
    const startLocalStream = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        // Add local stream tracks to peer connection
        stream.getTracks().forEach(track => {
          peerConnection.current?.addTrack(track, stream);
        });
      } catch (error) {
        console.error('Error accessing media devices.', error);
      }
    };

    startLocalStream();

    // Handle incoming ICE candidates
    peerConnection.current.onicecandidate = event => {
      if (event.candidate) {
        socket.emit('ice_candidate', { candidate: event.candidate });
      }
    };

    // Handle incoming media streams
    peerConnection.current.ontrack = event => {
      const [stream] = event.streams;
      setRemoteStream(stream);
    };

    // Listen for ICE candidates from the remote peer
    socket.on('ice_candidate', ({ candidate }) => {
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // Listen for remote offer/answer
    socket.on('offer', async ({ offer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer);
      socket.emit('answer', { answer });
    });

    socket.on('answer', async ({ answer }) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
    });

    return () => {
      // Clean up WebRTC connection and media streams
      peerConnection.current?.close();
      localStream?.getTracks().forEach(track => track.stop());
      socket.disconnect();
    };
  }, [socket]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {localStream && (
        <RTCView
          streamURL={localStream.toURL()}
          style={{ width: '100%', height: '50%' }}
        />
      )}
      {remoteStream && (
        <RTCView
          streamURL={remoteStream.toURL()}
          style={{ width: '100%', height: '50%' }}
        />
      )}
    </View>
  );
};

export default VideoCallScreen;