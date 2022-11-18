import React, { useState, useRef } from 'react';
import ReactCrop from 'react-image-crop';
import { toJson } from './toJson';

import 'react-image-crop/dist/ReactCrop.css';
import classes from './App.module.css';

export default function App() {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef(null);

  const [dimensions, setDimensions] = useState();
  const [size, setSize] = useState();
  const [json, setJson] = useState([]);

  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();

  function onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', (e) => {
        setImgSrc(reader.result?.toString() || '');
        setSize(`${(e.loaded / 1024 / 1024).toFixed(2)} MB`);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  function onImageLoad(e) {
    const { width, height } = e.currentTarget;
    setDimensions({ height: e.target.naturalHeight, width: e.target.naturalWidth });
    setCrop(width, height);
  }

  function formateJson() {
    if (completedCrop?.width && completedCrop?.height && imgRef.current) {
      setJson([...json, toJson(imgRef.current, completedCrop, json)]);
    }
  }

  const info = dimensions ? `${dimensions.width}x${dimensions.height} pixels; RGB; ${size} ` : '';

  return (
    <div className={classes.App}>
      <div>
        <div>
          <div>{info}</div>
        </div>
        {!imgSrc && <input type="file" accept="image/*" onChange={onSelectFile} />}
      </div>
      {!!imgSrc && (
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
        >
          <img ref={imgRef} alt="img" src={imgSrc} onLoad={onImageLoad} />
        </ReactCrop>
      )}
      <div>
        <pre>
          {json
            ? json.map((item, index) => (
                <span key={index}>
                  <br />
                  {item}
                </span>
              ))
            : ''}
        </pre>
        <button onClick={formateJson}>Добавить</button>
      </div>
    </div>
  );
}
