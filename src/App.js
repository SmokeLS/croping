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

  const [cropSizes, setCropSizes] = useState();
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

  function mouseDownHandler(e) {
    const canvas = document.getElementsByTagName('canvas')[0];

    if (!canvas && !canvas.getContext) {
      return;
    }

    const context = canvas.getContext('2d');

    e.target.addEventListener('mousemove', (e) => mouseMoveOnce(e, canvas, context), { once: true });
  }

  function mouseMoveOnce(e, canvas, context) {
    const prev = e;

    function sameMouseMoveHandler(e) {
      mouseMoveHandler(e, prev, canvas, context);
    }

    e.target.addEventListener('mousemove', sameMouseMoveHandler);
    e.target.addEventListener('mouseup', (e) => mouseUpHandler(e, sameMouseMoveHandler), { once: true });
  }

  function mouseMoveHandler(e, prev, canvas, context) {
    if (!e || !prev) {
      return;
    }

    let x = prev.offsetX,
      y = prev.offsetY,
      w = e.offsetX - prev.offsetX,
      h = e.offsetY - prev.offsetY;

    context.clearRect(0, 0, canvas.width, canvas.height); // стирает старый прямоугольник при попытки создать новый

    if (!w || !h) {
      return;
    }

    context.strokeRect(x, y, w, h); // создание прямоугольника без заливки согласно переданным параметром от мышки

    setCropSizes({
      x,
      y,
      w,
      h,
    });
  }

  function mouseUpHandler(e, sameMouseMoveHandler) {
    e.target.removeEventListener('mousemove', sameMouseMoveHandler);
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
        <>
          {dimensions && (
            <canvas
              onMouseDown={mouseDownHandler}
              width={dimensions.width}
              height={dimensions.height}
              style={{
                position: 'absolute',
                width: dimensions.width,
                height: dimensions.height,
                boxSizing: 'border-box',
              }}
            ></canvas>
          )}
          <img ref={imgRef} alt="img" src={imgSrc} onLoad={onImageLoad} />
        </>
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
