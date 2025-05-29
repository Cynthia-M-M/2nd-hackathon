import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { MdMic, MdMicOff, MdCamera } from 'react-icons/md';

const MediaInput = ({ onTextCapture, onImageCapture }) => {
    const [isRecording, setIsRecording] = useState(false);
    const { session } = useAuth();
    const recognition = useRef(null);

    // Initialize speech recognition
    const initSpeechRecognition = () => {
        if (!recognition.current) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognition.current = new SpeechRecognition();
                recognition.current.continuous = false;
                recognition.current.interimResults = false;
                
                recognition.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    onTextCapture(transcript);
                    toast.success('Voice captured successfully!');
                };
                
                recognition.current.onerror = (event) => {
                    console.error('Speech recognition error:', event.error);
                    toast.error('Failed to capture voice');
                    setIsRecording(false);
                };
                
                recognition.current.onend = () => {
                    setIsRecording(false);
                };
            }
        }
    };

    const toggleRecording = () => {
        if (!recognition.current) {
            initSpeechRecognition();
        }
        
        if (!recognition.current) {
            toast.error('Speech recognition not supported in this browser');
            return;
        }

        if (!isRecording) {
            try {
                recognition.current.start();
                setIsRecording(true);
                toast.success('Recording started...');
            } catch (error) {
                console.error('Failed to start recording:', error);
                toast.error('Failed to start recording');
            }
        } else {
            try {
                recognition.current.stop();
                setIsRecording(false);
            } catch (error) {
                console.error('Failed to stop recording:', error);
                toast.error('Failed to stop recording');
            }
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/upload-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            const data = await response.json();
            toast.success('Image uploaded successfully!');
            onImageCapture(data.filename);
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={toggleRecording}
                className={`p-2 rounded-full ${
                    isRecording 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-700'
                }`}
                title={isRecording ? 'Stop recording' : 'Start recording'}
            >
                {isRecording ? <MdMicOff size={24} /> : <MdMic size={24} />}
            </button>

            <label className="cursor-pointer p-2 rounded-full bg-gray-200 text-gray-700">
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <MdCamera size={24} />
            </label>
        </div>
    );
};

export default MediaInput; 