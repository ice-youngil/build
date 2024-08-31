import React, { useState, useRef } from 'react';
import SidebarButton from 'components/SidebarButton';
import CanvasComponent from './CanvasComponent';
import TextSettings from 'components/TextSettings';
import PenSettings from 'components/PenSettings';
import ShapeSelectionModal from 'services/threeD/ShapeSelectionModal';
import ThreeDModal from 'services/threeD/ThreeDModel';

// ======================= css ===============================
import 'assets/css/SketchHome.css';
import 'assets/css/ToolSettings.css';
// ====================== 아이콘 ==============================
// Topbar
import homeIcon from 'assets/icon/home.png';
import imageLoadButtoIcon from 'assets/icon/load.png';
import imageSaveButtonIcon from 'assets/icon/save.png';
import imageResetButtonIcon from 'assets/icon/reset.png'; //reset 아이콘 추가

// Sidebar
import textIcon from 'assets/icon/text.png';
import paintIcon from 'assets/icon/paint.png'
import elementIcon from 'assets/icon/element.png';
import penIcon from 'assets/icon/pen.png';
import threeDIcon from 'assets/icon/apply.png';
import undoIcon from 'assets/icon/undo.png';
import redoIcon from 'assets/icon/redo.png';
import handIcon from 'assets/icon/hand.png';
import InIcon from 'assets/icon/plus.png';
import OutIcon from 'assets/icon/minus.png';
import explainIcon from 'assets/icon/explain.png';
import explainCloseIcon from 'assets/icon/explain-close.png';
import panningIcon from 'assets/icon/panning.png'; // 패닝 아이콘
import rotationIcon from 'assets/icon/rotation.png'; // 90도 회전 아이콘 추가

import EmojiSettings from 'components/EmojiSettings';
import BackgroundSettings from 'components/BackgroundSettings';

const SketchToolHome = () => {
  const canvasRef = useRef(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [image, setImage] = useState(null);
  const [toolSize, setToolSize] = useState(5);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [emojiUrl, setEmojiUrl] = useState(null);
  // 선택 창 표시 관련
  const [showTextTool, setShowTextTool] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPenSettings, setShowPenSettings] = useState(false);
  const [showBackgroundSettings, setShowBackgroundSettings] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [selectedShape, setSelectedShape] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isWrapperOpen, setIsWrapperOpen] = useState(false);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [selectedBackgroundColor, setSelectedBackgroundColor] = useState('#FFFFFF');
  const [captureCount, addCaptureCount] = useState(0);
  const [drawingImageUrl, setDrawingImageUrl] = useState(null);

  const backToMainPage = () => {
    window.open("http://sleepprc.cafe24.com");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (canvasRef.current) {
          canvasRef.current.clearCanvas();
        }
        const newImage = e.target.result;
        setImage(newImage);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveImage = () => {
    addCaptureCount(captureCount + 1);
  }
  const handleSaveImage = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.getCanvas();

      if (canvas) {
        const dataURL = canvas.toDataURL({
          format: 'png',
          quality: 1,
        });

        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'canvas_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Canvas object is not available');
      }
    } else {
      console.error('canvasRef.current is not available');
    }
  };

  const handleZoom = (zoomIn) => {
    if (canvasRef.current) {
      canvasRef.current.handleZoom(zoomIn);
    }
  };

  const handleUndoClick = () => {
    if (canvasRef.current) {
      canvasRef.current.undo(); // CanvasComponent의 undo 함수 호출
    }
  };

  const handleRedoClick = () => {
    if (canvasRef.current) {
      canvasRef.current.redo(); // CanvasComponent의 redo 함수 호출
    }
  };

  const handleApplyModel = () => {
    
    addCaptureCount(captureCount - 1);

    if (drawingImageUrl) {      
      setIsModalOpen(true);
    } 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIs3DModalOpen(false);
    URL.revokeObjectURL(drawingImageUrl);
  };

  const handleSelectShape = (shape) => {
    setSelectedShape(shape);
    setIsModalOpen(false);
    setIs3DModalOpen(true);
  };

  const handleEmojiButtonClick = () => {
    setIsWrapperOpen(false);
    setShowEmojiPicker(true);
  };

  const handleButtonClick = (tool) => {
    setIsWrapperOpen(true);
    setShowTextTool(false);
    setShowPenSettings(false);
    setShowEmojiPicker(false);
    setShowBackgroundSettings(false);

    setSelectedTool(tool);
    if (tool === 'text') {
      setShowTextTool(true);
    } else if (tool === 'pen') {
      setShowPenSettings(true);
    } else if (tool === 'background') {
      setShowBackgroundSettings(true);
    }
  };


  const closeSettings = () => {
    setIsWrapperOpen(false);
    setShowPenSettings(false);
    setShowTextTool(false);
    setShowEmojiPicker(false);
    setShowBackgroundSettings(false);
  };

  const handleAddText = (textSettings) => {
    if (canvasRef.current) {
      canvasRef.current.addText(textSettings);
    }
  };

  const handleSelectEmoji = (EmojiSettings) => {
    if (canvasRef.current) {
      canvasRef.current.addEmoji(EmojiSettings);
    }
  };

  const toggleDescription = () => {
    setDescriptionVisible(!isDescriptionVisible);
  };

  const handleRestoreClick = () => {
    if (canvasRef.current) {
      canvasRef.current.restoreInitialView(); // 초기 상태로 복구하는 함수 호출
    }
  };

  const handleRotation = ()  => {
    if (canvasRef.current) {
      canvasRef.current.rotationCanvas(); // 초기 상태로 복구하는 함수 호출
    }
 }
  return (
    <div className="sketchtoolhome-container">
      <div className="top-bar">
        <button className="top-home" onClick={backToMainPage}>
          <img src={homeIcon} alt="Home" />
        </button>
        <div className="top-function">

          <button className='top-reset' onClick={handleRestoreClick}>
            <img src={imageResetButtonIcon} alt='Reset'/>
          </button> {/* 탑바에 reset버튼 생성 */}

          <button className="top-load" onClick={() => document.getElementById('fileupload').click()}>
            <img src={imageLoadButtoIcon} alt="Load" />
            <input
              id="fileupload"
              type="file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
          </button>
          <button className="top-save" onClick={saveImage}>
            <img src={imageSaveButtonIcon} alt="Save" />
          </button>
        </div>
      </div>    
        <CanvasComponent
          ref={canvasRef}
          selectedTool={selectedTool}
          toolSize={toolSize}
          image={image}
          selectedColor={selectedColor}
          selectedBackgroundColor={selectedBackgroundColor}
          captureCount={captureCount}
          setDrawingImageUrl={setDrawingImageUrl}
        />
    
      <div className="control-button">
        <button className="undo-button" onClick={handleUndoClick}>
          <img src={undoIcon} />
        </button>
        <button className="redo-button" onClick={handleRedoClick}>
          <img src={redoIcon} />
        </button>

      </div>
      <div className="side-bar">
        <div className="side-function">
          <SidebarButton icon={textIcon} label="side-text" onClick={() => handleButtonClick('text')} />
          <SidebarButton icon={elementIcon} label="side-elements" onClick={() => handleEmojiButtonClick()} />
          <SidebarButton icon={penIcon} label="side-pen" onClick={() => handleButtonClick('pen')} />
          <SidebarButton icon={handIcon} label="side-handdler" onClick={() => setSelectedTool('hand')} />
          <SidebarButton icon={rotationIcon} label="side-rotation" onClick={() => handleRotation()}/> {/* 90도 회전 버튼 추가 */}      
          <SidebarButton icon={InIcon} label="side-zoom-in" onClick={() => handleZoom(true)} />
          <SidebarButton icon={OutIcon} label="side-zoom-out" onClick={() => handleZoom(false)} />
          <SidebarButton icon={paintIcon} label="side-panning" onClick={() => handleButtonClick('background')} />
        </div>
        <SidebarButton icon={threeDIcon} label="side-apply" onClick={handleApplyModel} />
      </div>

      {isWrapperOpen && <div className="wrapper">
        {showPenSettings && (
          <PenSettings
            toolSize={toolSize}
            setToolSize={setToolSize}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            closeSettings={closeSettings}
          />
        )}
        {showTextTool && (
          <TextSettings
            onAddText={handleAddText}
            closeSettings={closeSettings}
          />
        )}
        {showBackgroundSettings && (
          <BackgroundSettings
          selectedBackgroundColor={selectedBackgroundColor}
          setSelectedBackgroundColor={setSelectedBackgroundColor}
          closeSettings={closeSettings}
          />
        )        
        }
      </div>}


      {showEmojiPicker && (
        <EmojiSettings
          setEmojiUrl={setEmojiUrl}
          onAddEmoji={handleSelectEmoji}
          closeSettings={closeSettings}
        />
      )}

      <ShapeSelectionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectShape={handleSelectShape}
      />
      <ThreeDModal
        isOpen={is3DModalOpen}
        onClose={handleCloseModal}
        image={drawingImageUrl}
        shape={selectedShape}
      />
      <div className="explain">
        <button className="explain-button" onClick={toggleDescription}>
          {isDescriptionVisible ? '' : ''}
          <img src={explainIcon} alt="Explain" />
        </button>

        {isDescriptionVisible && (
          <div className="explain-overlay">
            <div className="explain-box">
              <div className='exp-1'></div>
              <div className="exp-1">
                <SidebarButton icon={imageResetButtonIcon} label="explain-apply"> </SidebarButton>
                <span className="exp-2">: 이미지 초기화</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={textIcon} label="explain-text"></SidebarButton>
                <span className="exp-2">: 텍스트 입력하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={elementIcon} label="explain-elements"></SidebarButton>
                <span className="exp-2">: 스티커 추가하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={penIcon} label="explain-pen"></SidebarButton>
                <span className="exp-2">: 펜 설정하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={handIcon} label="explain-handdler"></SidebarButton>
                <span className="exp-2">: 요소 선택하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={OutIcon} label="explain-zoom-out"></SidebarButton>
                <span className="exp-2">: 이미지 축소하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={InIcon} label="explain-zoom-in"></SidebarButton>
                <span className="exp-2">: 이미지 확대하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={rotationIcon} label="explain-apply"> </SidebarButton>
                <span className="exp-2">: 이미지 90도 회전</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={paintIcon} label="explain-panning"></SidebarButton>
                <span className="exp-2">: 배경색 지정하기</span>
              </div>
              <div className="exp-1">
                <SidebarButton icon={threeDIcon} label="explain-apply"> </SidebarButton>
                <span className="exp-2">: 문패 미리보기</span>
              </div>
              <div className='exp-1'>
                <span className='exp-3'>😀 문패 영상의 저장을 원할 시 최소 5초 이상 최대한 길게 녹화 후 저장 부탁드립니다. </span>
              </div>
              <div className='exp-1'></div>
              <button className="explain-close" onClick={toggleDescription}>
                <img src={explainCloseIcon} alt="explain-close" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SketchToolHome;
