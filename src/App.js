import React, { useState, useRef, useEffect } from 'react';

import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import { toJson } from './toJson';

import 'react-image-crop/dist/ReactCrop.css';

// This is to demonstate how to make and center a % aspect crop
// which is a bit trickier so we use some helper functions.

const json = {};

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

export default function App() {
  const [imgSrc, setImgSrc] = useState('');
  const previewCanvasRef = useRef(null);
  const imgRef = useRef(null);

  const [dimensions, setDimensions] = useState();
  const [size, setSize] = useState();
  const [json, setJson] = useState([]);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [aspect, setAspect] = useState(16 / 9);

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        setImgSrc(reader.result?.toString() || '');
        setSize(`${(e.loaded / 1024 / 1024).toFixed(2)} MB`);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setDimensions({ height: e.target.naturalHeight, width: e.target.naturalWidth });
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function handleToggleAspectClick() {
    if (aspect) {
      setAspect(undefined);
    } else if (imgRef.current) {
      const { width, height } = imgRef.current;
      setAspect(16 / 9);
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  }

  function formateJson() {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      console.log(json);
      setJson([...json, toJson(imgRef.current, completedCrop, json)]);
    }
  }

  const info = dimensions ? `${dimensions.width}x${dimensions.height} pixels; RGB; ${size} ` : '';

  return (
    <div className="App">
      <div className="Crop-Controls">
        <div>
          <div>{info}</div>
        </div>
        <input type="file" accept="image/*" onChange={onSelectFile} />
        <div>
          <button onClick={handleToggleAspectClick}>Toggle aspect {aspect ? 'off' : 'on'}</button>
        </div>
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
        >
          <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
        </ReactCrop>
      )}
      <div>
        <button onClick={formateJson}>Добавить</button>
        <pre>
          {json
            ? json.map((item) => (
                <>
                  <br />
                  {item}
                </>
              ))
            : ''}
        </pre>
      </div>
    </div>
  );
}
