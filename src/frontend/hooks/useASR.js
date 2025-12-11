import { useState, useCallback } from 'react';

/**
 * Custom hook for Automatic Speech Recognition (ASR)
 * Replace the mock implementation with actual API calls to Whisper/Deepgram
 */
export function useASR() {
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState(null);

    const transcribe = useCallback(async (audioBlob) => {
        setIsTranscribing(true);
        setError(null);

        try {
            // TODO: Replace with actual API call
            // const formData = new FormData();
            // formData.append('audio', audioBlob);
            // 
            // const response = await fetch('/api/asr', {
            //   method: 'POST',
            //   body: formData
            // });
            // 
            // const data = await response.json();
            // setTranscript(data.transcript);
            // return data;

            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 1000));
            const mockTranscript = "This is a simulated transcript of the user's answer.";
            setTranscript(mockTranscript);

            return {
                transcript: mockTranscript,
                confidence: 0.95,
                isFinal: true
            };
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsTranscribing(false);
        }
    }, []);

    const reset = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    return {
        transcribe,
        reset,
        isTranscribing,
        transcript,
        error
    };
}
