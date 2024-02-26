import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import backgroundCars from './assets/background_cars.png'; 
import backgroundColor from './assets/background_color.png'; 
import RBLogo from './assets/RBLogo.png';

export function App() {
  const [count, setCount] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [urlParams, setUrlParams] = useState({});

  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStarted(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  
  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    setCameraStarted(false);
  };

  
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageDataURL = canvas.toDataURL('image/jpeg');
      console.log('Captured Image:', imageDataURL);
  
      // Combine URL parameters and captured image data
      const combinedData = {
        ...urlParams,
        visitorImage: imageDataURL,
      };
      console.log('Data to be sent:', combinedData);
  
      // Enviar datos al servidor
      fetch('https://089b-139-185-33-209.ngrok-free.app/createImage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Server response:', data);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    }
  };
  

  
  const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const params = {};
    for (let param of searchParams.entries()) {
      params[param[0]] = param[1];
    }
    setUrlParams(params);
  };


  useEffect(() => {
    getUrlParams();
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      
      <div style={{ 
          backgroundImage: `url(${backgroundCars})`, 
          backgroundSize: '100% auto', 
          backgroundPosition: 'center top', 
          height: 'calc(30vh + 10px)', 
          width: '100%', 
          position: 'relative',
        }}>
        <img src={RBLogo} alt="React Logo" style={{ 
          position: 'absolute',
          top: '10px',
          left: '10px',
          width: '100px',
          height: '50px'
        }} />
        
        
        <div style={{
          position: 'absolute',
          bottom: '30px', 
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'white', 
          fontSize: '30px', 
          fontWeight: 'bold',
          zIndex: 1, 
        }}>
          Photo enhancer for hiring
        </div>
      </div>

      
      <div style={{ 
        backgroundImage: `url(${backgroundColor})`, 
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: 'calc(70vh - 10px)', 
        width: '100%', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        
        <div style={{ border: '2px solid white' }}>
          <video ref={videoRef} id="video" width="320" height="240" autoPlay></video>
        </div>
       
        <button onClick={captureImage} style={{ marginTop: '10px' }}>Capture Image</button>
        
        <button onClick={cameraStarted ? stopCamera : startCamera} style={{ marginTop: '10px' }}>
          {cameraStarted ? 'Stop Camera' : 'Start Camera'}
        </button>
        
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>


    </div>
  );
}

export default App;
