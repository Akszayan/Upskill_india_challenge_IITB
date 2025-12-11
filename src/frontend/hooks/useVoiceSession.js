import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Custom hook for managing voice recording sessions
 * Handles MediaRecorder, audio streaming, and VU meter
 */
export function useVoiceSession() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    const [sessionId, setSessionId] = useState(null);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    const startRecording = useCallback(async () => {
        try {
            // Request microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            // Set up audio context for VU meter
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            audioContextRef.current = audioContext;

            const analyser = audioContext.createAnalyser();
            analyserRef.current = analyser;
            analyser.fftSize = 256;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

            // Start VU meter updates
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const updateLevel = () => {
                if (!isRecording) return;

                analyser.getByteFrequencyData(dataArray);
                const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
                setAudioLevel(Math.min(100, (average / 255) * 100));

                requestAnimationFrame(updateLevel);
            };
            updateLevel();

            // Set up MediaRecorder
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);

                    // TODO: Stream chunks to backend
                    // uploadAudioChunk(event.data, sessionId);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

                // TODO: Upload final audio
                // uploadFinalAudio(audioBlob, sessionId);

                console.log('Recording stopped. Audio blob size:', audioBlob.size);
            };

            // Start recording
            mediaRecorder.start(1000); // Collect data every 1 second
            setIsRecording(true);

            // TODO: Initialize session with backend
            // const response = await fetch('/api/stream', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify({ action: 'start' })
            // });
            // const { sessionId } = await response.json();

            // Mock session ID
            const mockSessionId = `sess_${Date.now()}`;
            setSessionId(mockSessionId);

            console.log('Recording started. Session ID:', mockSessionId);
        } catch (err) {
            console.error('Error starting recording:', err);
            setError(err.message);
        }
    }, [isRecording]);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }

        setIsRecording(false);
        setAudioLevel(0);

        console.log('Recording stopped');
    }, []);

    const reset = useCallback(() => {
        setSessionId(null);
        setError(null);
        setAudioLevel(0);
    }, []);

    return {
        isRecording,
        audioLevel,
        sessionId,
        error,
        startRecording,
        stopRecording,
        reset
    };
}
