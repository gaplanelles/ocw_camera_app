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
  const [isLoading, setIsLoading] = useState(false); // State variable for loader
  const [isTaken, setIsTaken] = useState(false);
  const [isTextGenerated, setIsTextGenerated] = useState(false); // State variable for loader
  const [imageDataURL, setImageDataURL] = useState(null);
  const [apiResponse, setApiResponse] = useState(""); // State variable for API response

  const LoadingImage = () => (
    <div id="loadingImage" className="search-results">
      <img src={imageDataURL} alt="Loading..." width="320" height="240" />
    </div>
  );

  const ShowVideo = () => (
    <div style={{ border: '2px solid white' }}>
    <video ref={videoRef} id="video" width="320" height="240" autoPlay></video>
  </div>
  );

  const ShowResult = () => (
    <div id="loadingImage" className="search-results">
      <img src="src/totti.jpeg" alt="Loading..." />
    </div>
  );
  const ShowText = () => (
    <div>
        <input type="text" placeholder={apiResponse} style={{ marginTop: '10px' }} />
    </div>
  );

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
    setIsLoading(true); // Show loader when user clicks on "Capture Image"
    setIsTaken(true)
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataURL = canvas.toDataURL('image/jpeg');
        console.log('Captured Image:', imageDataURL);
            // Store captured image data URL in state
        setImageDataURL(imageDataURL);

        
        // Combine URL parameters and captured image data
        const combinedData = {
            // ...urlParams,
            image: imageDataURL,
            requisitions: "driver"
        };
        console.log('Data to be sent:', combinedData);

        // Enviar datos al servidor con un método POST
        // fetch('https://de4d-139-185-33-209.ngrok-free.app/createImage', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(combinedData),
        // })
        // .then(response => {
        //     if (!response.ok) {
        //         throw new Error('Network response was not ok');
        //     }
        //     return response.json();
        // })
        // .then(data => {
        //     console.log('Server response:', data);
        // })
        // .catch(error => {
        //     console.error('There was a problem with the fetch operation:', error);
        // });

        // // Realizar otro fetch con un método GET incluyendo los parámetros en la URL
        // const { firstName, lastName, email } = urlParams;
        let firstName = "Andrea"
        let lastName = "Batino"
        let email="blabla"
        const url = `http://193.123.89.195/generateText?requisitions=driver&firstname=${firstName}&lastname=${lastName}&email=${email}`;
        // setTimeout(() => {
        //   setIsLoading(false); // Hide loader after delay
        // }, 3000);
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(async response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let botResponse = '';

            // console.log(response.text());
            let data= await response.text();
            // console.log(data)

            var jsonObjects = [];
            var start = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i] === '{') {
                    start = i;
                } else if (data[i] === '}') {
                    var jsonObject = data.substring(start, i + 1);
                    jsonObjects.push(JSON.parse(jsonObject));
                }
            }
            // console.log(jsonObjects)
            // Now you can loop through the array of JSON objects
            jsonObjects.forEach(obj => {
            // Your processing logic here
            const data = obj;
            //var botHtml = '<p class="botText"><span>' + data.response + '</span></p>';
            if (data.response === "\n") {
                // Replace "\n" with a newline character
                data.response = "<br>"; // Use "<br>" for HTML line break
            }
            botResponse = botResponse + data.response;

          });
            setApiResponse(botResponse)
            setIsLoading(false);
            setIsTextGenerated(true)
            // return response.json();
        })
        // .then(data => {
        //     console.log('Response from GET request:', data);



        //     // setApiResponse(parsedResponse.response);
        //     console.log(apiResponse) // Update state with API response
        //     setIsLoading(false); // Hide loader after delay
        // })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
        // setCameraStarted(false);
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
{/* 
        <div style={{ border: '2px solid white' }}>
          <video ref={videoRef} id="video" width="320" height="240" autoPlay></video>
        </div> */}

        <div>
          { !isLoading && !isTaken ?         
            <div style={{ border: '2px solid white' }}>
          <video ref={videoRef} id="video" width="320" height="240" autoPlay></video>
        </div>
          : null }
        </div>
        {/* <div>
          { isLoading && isTaken ? <LoadingImage /> : null }
        </div> */}

        <div>
        {isLoading && isTaken ? <LoadingImage imageDataURL={imageDataURL} /> : null}
        </div>

        <button onClick={captureImage} style={{ marginTop: '10px' }}>Capture Image</button>
        
        <button onClick={cameraStarted ? stopCamera : startCamera} style={{ marginTop: '10px' }}>
          {cameraStarted ? 'Stop Camera' : 'Start Camera'}
        </button>
    
        <div style={{ width: '300px', height: '300px', overflowY: 'scroll', marginTop: '10px' }}>
      <textarea
        placeholder={apiResponse}
        style={{
          width: '100%',
          height: '100%',
          resize: 'none', // Disable resizing
          boxSizing: 'border-box' // Include padding and border in the element's total width and height
        }}
      ></textarea>
    </div>
        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      </div>


    </div>
  );
}

export default App;