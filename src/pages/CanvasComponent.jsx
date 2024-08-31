import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';
import html2canvas from "html2canvas";

import 'assets/css/SketchHome.css';

const CanvasComponent = forwardRef(({
  selectedTool,
  toolSize,
  image,
  selectedColor,
  onHistoryChange,
  selectedBackgroundColor,
  captureCount,
  setDrawingImageUrl
}, ref) => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [history, setHistory] = useState([]);
  const [redoHistory, setRedoHistory] = useState([]);
  const [undoPerformed, setUndoPerformed] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  const [initialZoom, setInitialZoom] = useState(1); // 초기 줌 값
  const [initialPan, setInitialPan] = useState({ x: 0, y: 0 }); // 초기 패닝 값

  const [isNowRotation, setIsNowRotation] = useState(false);
  const [cntCapture, setCntCapture] = useState(0);
  useImperativeHandle(ref, () => ({
    clearCanvas: () => {
      if (canvas) {
        canvas.clear();
        setHistory([]);
        setRedoHistory([]);
        if (onHistoryChange) {
          onHistoryChange([]);
        }
      }
    },
    addText: (textSettings) => {
      if (canvas) {
        const text = new fabric.Textbox(textSettings.text, {
          left: textSettings.left || 50,
          top: textSettings.top || 50,
          fill: textSettings.color || 'black',
          fontSize: textSettings.fontSize || 20,
          fontFamily: textSettings.fontFamily || 'Arial',
        });
        canvas.add(text);
        canvas.renderAll();
        onCanvasChange();
      }
    },
    addEmoji: (EmojiSettings) => {
      if (canvas) {
        fabric.Image.fromURL(EmojiSettings.url, (img) => {
          canvas.add(img);
          canvas.renderAll();
          onCanvasChange();
        }, { crossOrigin: 'anonymous' });
      }
    },
    getCanvas: () => canvas,
    handleZoom: (zoomIn) => {
      if (canvas) {
        const zoomFactor = zoomIn ? 1.1 : 1 / 1.1;
        const currentZoom = canvas.getZoom();
        const newZoom = currentZoom * zoomFactor;
        const canvasCenter = new fabric.Point(canvasWidth / 2, canvasHeight / 2);
        const centerPointBeforeZoom = fabric.util.transformPoint(canvasCenter, canvas.viewportTransform);
        canvas.zoomToPoint(centerPointBeforeZoom, newZoom);
        const centerPointAfterZoom = fabric.util.transformPoint(canvasCenter, canvas.viewportTransform);
        const panX = centerPointBeforeZoom.x - centerPointAfterZoom.x;
        const panY = centerPointBeforeZoom.y - centerPointAfterZoom.y;
        canvas.relativePan(new fabric.Point(panX, panY));
      }
    },
    undo: () => {
      if (history.length >= 2) {
        const currentState = history[history.length - 1];
        
        setRedoHistory((prevRedoHistory) => [...prevRedoHistory, currentState]);
        const newHistory = history.slice(0, -1);
        setHistory(newHistory);
        setUndoPerformed(true);
        setIsUndoing(true);

        const lastState = newHistory[newHistory.length - 1];
        if (canvas && lastState) {
          if(currentState.objects.length > 0 && currentState.objects[currentState.objects.length - 1].isRotation===true) {
            rotateCanvasContainer();
          }
          canvas.loadFromJSON(lastState, () => {
            canvas.getObjects('image').forEach((img) => {
              img.set({
                selectable: false,
                evented: false,
              });
            });
            canvas.renderAll();
            setIsUndoing(false);
          });
        }
      }
    },
    redo: () => {
      if (redoHistory.length > 0) {
        const redoState = redoHistory[redoHistory.length - 1];
        setRedoHistory(redoHistory.slice(0, -1));
        setHistory((prevHistory) => [...prevHistory, redoState]);

        if (canvas) {
          setUndoPerformed(false);
          setIsUndoing(true);
          canvas.loadFromJSON(redoState, () => {
            canvas.getObjects('image').forEach((img) => {
              img.set({
                selectable: false,
                evented: false,
              });
            });
            canvas.renderAll();
            setIsUndoing(false);
          });
        }
      }
    },
    restoreInitialView: () => {
      if (canvas) {
        let cnt = 0;
        canvas.getObjects().forEach((obj) => {
          if(cnt > 0) {
            canvas.remove(obj)
          }
          cnt = cnt + 1;
        })
        canvas.setZoom(initialZoom); // 초기 줌으로 복원
        canvas.viewportTransform[4] = initialPan.x; // 초기 패닝 위치로 복원
        canvas.viewportTransform[5] = initialPan.y;
        canvas.renderAll();

        setHistory([]);
        setRedoHistory([]);
        if (onHistoryChange) {
          onHistoryChange([]);
        }
        
        // canvas.renderAll();
      }
    },
    rotationCanvas: () => {
      changeRotationState();
      rotateCanvas();
    }
  }));

  useEffect(() => {
    if (canvas && history.length === 0) {
      const initialCanvasState = canvas.toJSON();
      setHistory([initialCanvasState]);
    }
  }, [canvas]);

  
  const onCanvasChange = useCallback(() => {
    if (canvas && !isUndoing) {

      const json = canvas.toJSON();

      if(isNowRotation){
        json.objects[json.objects.length - 1].isRotation = isNowRotation;
        changeRotationState();
      }
                
      setHistory((prevHistory) => [...prevHistory, json]);
      
      if (undoPerformed && history.length > 0) {
        setRedoHistory([]);
        setUndoPerformed(false);
      }

      if (onHistoryChange) {
        onHistoryChange(json);
      }
    }
  });

  useEffect(() => {
    if (image) {
      const imgElement = new Image();
      imgElement.crossOrigin = 'anonymous';
      imgElement.src = image;
      imgElement.onload = () => {
        if (canvas && canvasRef.current) {
          canvas.dispose();
        }

        const canvasInstance = new fabric.Canvas(canvasRef.current);
        const imgInstance = new fabric.Image(imgElement, {
          selectable: false,
        });

        const maxWidth = window.innerWidth * 0.70;
        const maxHeight = window.innerHeight * 0.70;

        const scaleFactor = Math.min(maxWidth / imgInstance.width, maxHeight / imgInstance.height);

        const canvasW = imgInstance.width * scaleFactor;
        const canvasH = imgInstance.height * scaleFactor;

        canvasInstance.setWidth(canvasW);
        canvasInstance.setHeight(canvasH);

        imgInstance.scaleToWidth(canvasW);
        imgInstance.scaleToHeight(canvasH);

        canvasInstance.add(imgInstance);
        canvasInstance.sendToBack(imgInstance);

        setCanvasWidth(canvasW);
        setCanvasHeight(canvasH);

        setInitialZoom(canvasInstance.getZoom());
        setInitialPan({ x: canvasInstance.viewportTransform[4], y: canvasInstance.viewportTransform[5] });

        setCanvas(canvasInstance);
      };
    }
  }, [image]);

  useEffect(() => {
    if(canvas){
      const myCanvas = document.querySelector('#drawing-canvas');
      myCanvas.style.backgroundColor=selectedBackgroundColor;      
    }    
  }, [selectedBackgroundColor])

  useEffect(()=> {
    if(canvas) {
      saveImage();     
    }
  }, [captureCount])

  const saveImage = async() => {
    let nowDate = new Date();
    let year = nowDate.getFullYear(); // 년도
    let month = nowDate.getMonth() + 1;  // 월
    let date = nowDate.getDate();  // 날짜

    const nowDay = year + '/' + month + '/' + date + " "
    
    const div = canvasRef.current;
    const captureCanvas = await html2canvas(div, { scale: 2 });

    captureCanvas.toBlob((blob) => {
      if(blob) {
        if(cntCapture < captureCount) {
          saveAs(blob, nowDay + "스케치.png");
        }          
        else{
          setDrawingImageUrl(URL.createObjectURL(blob));
        }
        setCntCapture(captureCount);
      }
    }, 'image/png');

  }
  useEffect(() => {
    if (canvas) {
      canvas.off('mouse:down');
      canvas.off('mouse:move');
      canvas.off('mouse:up');
      canvas.off('touch:down');
      canvas.off('touch:move');
      canvas.off('touch:up');

      if (selectedTool === 'pen') {
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        canvas.freeDrawingBrush.width = toolSize;
        canvas.freeDrawingBrush.color = selectedColor;
      } 
      else if (selectedTool === 'panning') {
        canvas.isDrawingMode = false;
        canvas.selection = false;
        canvas.defaultCursor = 'grab';

        let panning = false;
        let startX = 0;
        let startY = 0;

        const handlePanStart = (event) => {
          panning = true;
          canvas.defaultCursor = 'grabbing';
          if (event.e.touches) {
            startX = event.e.touches[0].clientX;
            startY = event.e.touches[0].clientY;
          } else {
            startX = event.e.clientX;
            startY = event.e.clientY;
          }
        };

        const handlePanMove = (event) => {
          if (panning) {
            let deltaX, deltaY;
            if (event.e.touches) {
              deltaX = event.e.touches[0].clientX - startX;
              deltaY = event.e.touches[0].clientY - startY;
              startX = event.e.touches[0].clientX;
              startY = event.e.touches[0].clientY;
            } else {
              deltaX = event.e.clientX - startX;
              deltaY = event.e.clientY - startY;
              startX = event.e.clientX;
              startY = event.e.clientY;
            }
            const delta = new fabric.Point(deltaX, deltaY);
            canvas.relativePan(delta);
          }
        };

        const handlePanEnd = () => {
          panning = false;
          canvas.defaultCursor = 'grab';
        };

        canvas.on('mouse:down', handlePanStart);
        canvas.on('mouse:move', handlePanMove);
        canvas.on('mouse:up', handlePanEnd);

        canvas.on('touch:down', handlePanStart);
        canvas.on('touch:move', handlePanMove);
        canvas.on('touch:up', handlePanEnd);
      } else {
        canvas.isDrawingMode = false;
        canvas.selection = true;
        canvas.defaultCursor = 'default';
      }
    }
  }, [selectedTool, toolSize, selectedColor, canvas]);

  useEffect(() => {
    if (canvas) {
      const onCanvasChangeWrapper = () => {
        if (!canvas._historySaved) {
          onCanvasChange();
          canvas._historySaved = true;
          setTimeout(() => {
            canvas._historySaved = false;
          }, 0);
        }
      };

      canvas.on('object:added', onCanvasChangeWrapper);
      canvas.on('object:modified', onCanvasChangeWrapper);
      canvas.on('path:created', onCanvasChangeWrapper);
      return () => {
        canvas.off('object:added', onCanvasChangeWrapper);
        canvas.off('object:modified', onCanvasChangeWrapper);
        canvas.off('path:created', onCanvasChangeWrapper);
      };
    }
  }, [canvas, onCanvasChange]);

  useEffect(() => {
    const htmlTitle = document.querySelector("title");
    htmlTitle.innerHTML = "영일도방 - 스케치 툴 제작";
  }, []);

  const rotateCanvasContainer = () => {
    const canvasSizer = document.querySelector('.canvas-container');
    const height = canvasSizer.offsetHeight;
    const width = canvasSizer.offsetWidth;
    
    const newHeight = width;
    const newWidth = height;

    canvasSizer.style.width = newWidth+"px";
    canvasSizer.style.height = newHeight+"px";
    canvas.setDimensions({width : newWidth, height: newHeight});
  }

  const rotateCanvas = () => {
    
    if(!canvas) return;
    
    rotateCanvasContainer();
    const degrees =  90;
    const radians = fabric.util.degreesToRadians(degrees);
        
    const objs = canvas.getObjects();
    objs.forEach(function(obj){
      var angleval = obj.get('angle');
      var val = angleval + degrees;
      obj.set('angle', val);
      
      var posval = {
        top: obj.get('top'),
        left: obj.get('left')
      }
      
      var newleft = canvas.width - posval.top;
      var newtop = posval.left;
      
      obj.set('top', newtop);
      obj.set('left', newleft);
      obj.setCoords();
    });
    changeRotationState();
    // 캔버스를 다시 렌더링합니다
    canvas.renderAll();
  };

  const changeRotationState = () => {
    setIsNowRotation(!isNowRotation)
  }

  return (
    <div className="canvas-window">
      <canvas id="drawing-canvas" ref={canvasRef} className={image ? 'active-canvas' : 'inactive-canvas'} />
      {!image && <div className="placeholder">이미지를 불러와 주세요</div>}
    </div>
  );
});

export default CanvasComponent;