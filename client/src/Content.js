import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import './Content.css';
const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box',
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

function Content() {
  const [files, setFiles] = useState([]);
  const [prediction, setPrediction] = useState("");
  const [isPredicting, setIsPredicting] = useState(false); // To handle prediction state
  const [emotionLevels, setEmotionLevels] = useState(null); // To store emotion levels
  const [typedSuggestion, setTypedSuggestion] = useState(""); // For typewriter effect

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': [],
    },
    onDrop: acceptedFiles => {
      setFiles(
        acceptedFiles.map(file =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const handlePredict = () => {
    if (files.length === 0) {
      alert("Please upload an image before predicting.");
      return;
    }
    
    const formData = new FormData();
    formData.append('image', files[0]);

    setIsPredicting(true); // Set predicting state to true

    axios
      .post('http://localhost:3000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const predictedClass = response.data.predictedClass;
        const emotionLevels = response.data.emotionLevels; // Expecting emotion levels from the backend
        setPrediction(predictedClass);
        setEmotionLevels(emotionLevels); // Set emotion levels
        // alert(`Predicted Class: ${predictedClass}`);
        // setPrediction(predictedClass);
        // alert(`Predicted Class: ${predictedClass}`);
        
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      })
      .finally(() => {
        setIsPredicting(false); // Reset predicting state
      });
  };

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          alt="preview"
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);
  

   // Typewriter effect function
   const startTypewriterEffect = (text) => {
    setTypedSuggestion(''); // Reset typed text before starting the effect
    let index = 0;

    const typeWriter = () => {
      if (index < text.length) {
        setTypedSuggestion(prev => prev + text.charAt(index));
        index++;
        setTimeout(typeWriter, 50); // Adjust typing speed here
      }
    };

    typeWriter(); // Start typing
  };
  
  useEffect(() => {
    // Start the typewriter effect when prediction or emotion levels change
    if (prediction && emotionLevels) {
      const suggestion = getSuggestions(prediction, emotionLevels);
      startTypewriterEffect(suggestion);
    }
  }, [prediction, emotionLevels]);

  const getSuggestions = (predictedClass, levels) => {
    if (!levels) return "";

    let suggestions = [];

    // Check which class was predicted and generate the corresponding suggestion
    switch (predictedClass) {
        case 0: // Anger (assuming 0 is for anger)
            if (levels.anger === 'high') {
                suggestions.push("Your dog is feeling very angry. Give them space and ensure they are in a calm environment. Avoid loud noises or sudden movements.");
            } else if (levels.anger === 'medium') {
                suggestions.push("Your dog seems slightly agitated. A calming activity, like a short walk or a gentle play, could help relax them.");
            } else if (levels.anger === 'low') {
                suggestions.push("Your dog is relaxed and calm. It's a great time to play, train, or just enjoy some bonding time together.");
            }
            break;
        case 1: // Happiness (assuming 1 is for happiness)
            if (levels.happiness === 'high') {
                suggestions.push("Your dog is extremely happy! Keep up the great work with fun activities, social interactions, and rewarding experiences.");
            } else if (levels.happiness === 'medium') {
                suggestions.push("Your dog is in a good mood. Some playtime or a treat can help elevate their happiness even more.");
            } else if (levels.happiness === 'low') {
                suggestions.push("Your dog may not be very excited right now, but that’s okay. Encourage play and positive reinforcement to boost their mood.");
            }
            break;
        case 2: // Relaxation (assuming 2 is for relaxation)
            if (levels.relaxation === 'high') {
                suggestions.push("Your dog is deeply relaxed and content. It's a good time for calm interactions or to let them rest undisturbed.");
            } else if (levels.relaxation === 'medium') {
                suggestions.push("Your dog is moderately relaxed. They may enjoy a light activity or some quiet time in a comfortable spot.");
            } else if (levels.relaxation === 'low') {
                suggestions.push("Your dog seems a bit restless. Try to create a calm environment and encourage relaxation with a favorite blanket or spot.");
            }
            break;
        case 3: // Sadness (assuming 3 is for sadness)
            if (levels.sadness === 'high') {
                suggestions.push("Your dog appears very sad. Spend quality time with them, give them affection, and consider taking them for a fun activity or a favorite treat.");
            } else if (levels.sadness === 'medium') {
                suggestions.push("Your dog is feeling a bit down. Engaging them with their favorite toy or some attention can help lift their spirits.");
            } else if (levels.sadness === 'low') {
                suggestions.push("Your dog is happy and content. Continue with regular interaction and ensure they get enough play and exercise.");
            }
            break;
        default:
            suggestions.push("Unable to determine the emotion.");
    }

    return suggestions.join(" ");
};

  
  
  return (
    
    <section className="container-fluid bg-black ml-0 mr-0">
      <div className="row">
          <div className="col-4 quote">
           <h3>
           "Dogs do speak, but only to those who know how to listen." 
           </h3>
           <button class="glow-button ms-5">Click Me</button>
          </div>
          <div className="col-8 image "></div>

      </div>
      <div className="row justify-content-center bg-black ">
      <div className="col-12 col-md-8 text-center"> 
      <div class="card bg-dark text-white mb-5 ">
      <div class="card-header ">Upload photo</div>
      <div className="card-body fs-3">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
      <button className="btn btn-light" onClick={handlePredict} disabled={isPredicting}>
        {isPredicting ? 'Predicting...' : 'Predict'}
      </button>
      {/* <p>{getSuggestions(prediction,emotionLevels)}</p> */}
      <p>{typedSuggestion}</p> 
      </div>
      </div>
      </div>
      </div>
      {/* {prediction && <p>Predicted Class: {prediction}</p>} */}
      {/* <div className=" row bg-black pt-5 fs-2" >
        <div className='col-12 text-center'>
      <p>{getSuggestions(prediction,emotionLevels)}</p>
      </div>
      </div> */}
    </section>
  );
}

export default Content;
