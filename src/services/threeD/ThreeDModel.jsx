import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import 'assets/css/Model.css';

const ThreeDModal = ({ isOpen, onClose, image, shape }) => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [recordingTime, setRecordingTime] = useState(0); // 녹화 시간 상태
    const [recordingStartTime, setRecordingStartTime] = useState(null);
    const [recordingEndTime, setRecordingEndTime] = useState(null);
    const [deviceMimeType, setdeviceMimeType] = useState('');

    useEffect(() => {
        if (!isOpen || !image) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xf4f1de, 1);
        const canvas = renderer.domElement;
        canvasRef.current = canvas;
        canvas.className = "threeD-canvas";
        container.appendChild(canvas);

        camera.position.z = 5;
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = image;

        img.onload = () => {
            const textureLoader = new THREE.TextureLoader();
            const texture = textureLoader.load(image);

            let geometry, material, mesh;

            if (shape === 'ceramic') {
                const imgWidth = img.width;
                const imgHeight = img.height;
                const aspectRatio = imgWidth / imgHeight;

                const points = [];
                for (let i = 0; i <= 20; i++) {
                    const x = (Math.sin(i * 0.1) * 0.5 + 0.5) * aspectRatio;
                    const y = (i - 10) * 0.2;
                    points.push(new THREE.Vector2(x, y));
                }

                geometry = new THREE.LatheGeometry(points, 32);
                material = new THREE.MeshBasicMaterial({ map: texture });
                mesh = new THREE.Mesh(geometry, material);

                const bottomGeometry = new THREE.CircleGeometry(points[0].x, 32);
                const bottomMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.DoubleSide });
                const bottom = new THREE.Mesh(bottomGeometry, bottomMaterial);
                bottom.rotation.x = Math.PI / 2;
                bottom.position.y = points[0].y;
                scene.add(bottom);

                const outlinePoints = points.map(p => new THREE.Vector2(p.x * 1.05, p.y));
                const outlineGeometry = new THREE.LatheGeometry(outlinePoints, 32);
                const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.BackSide });
                const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
                scene.add(outline);

                scene.add(mesh);

                const animate = () => {
                    requestAnimationFrame(animate);
                    mesh.rotation.y -= 0.005;
                    outline.rotation.y -= 0.005;
                    renderer.render(scene, camera);
                };

                animate();
            } else if (shape === 'rectangle') {
                const imgWidth = img.width;
                const imgHeight = img.height;
                const aspectRatio = imgWidth / imgHeight;
                const boxWidth = 2 * aspectRatio;
                const boxHeight = 2;

                geometry = new THREE.BoxGeometry(boxWidth, boxHeight, 0.2);
                const materials = [
                    new THREE.MeshBasicMaterial({ color: 0x8B4513 }),
                    new THREE.MeshBasicMaterial({ color: 0x8B4513 }),
                    new THREE.MeshBasicMaterial({ color: 0x8B4513 }),
                    new THREE.MeshBasicMaterial({ color: 0x8B4513 }),
                    new THREE.MeshBasicMaterial({ map: texture }),
                    new THREE.MeshBasicMaterial({ color: 0x8B4513 }),
                ];

                mesh = new THREE.Mesh(geometry, materials);

                const outlineGeometry = new THREE.BoxGeometry(boxWidth + 0.2, boxHeight + 0.2, 0.2);
                const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.BackSide });
                const outline = new THREE.Mesh(outlineGeometry, outlineMaterial);
                scene.add(outline);

                scene.add(mesh);

                const animate = () => {
                    requestAnimationFrame(animate);
                    mesh.rotation.y -= 0.005;
                    outline.rotation.y -= 0.005;
                    renderer.render(scene, camera);
                };

                animate();
            }
        };

        return () => {
            container.removeChild(canvas);
            renderer.dispose();
        };
    }, [isOpen, image, shape]);

    useEffect(() => {
        if (isRecording && recordingStartTime) {
            const interval = setInterval(() => {
                setRecordingTime(Math.floor((Date.now() - recordingStartTime) / 1000));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [isRecording, recordingStartTime]);

    const startRecording = () => {
        setRecordedChunks([]);
        const stream = canvasRef.current.captureStream(30); // 30 FPS
        // console.log(stream);

        const mimeTypes = ['video/webm', 'video/webm; codecs=vp8', 'video/webm; codecs=vp9', 'video/mp4'];
        const supportedMimeTypes = mimeTypes.filter(type => MediaRecorder.isTypeSupported(type));
        const mimeType = supportedMimeTypes.length ? supportedMimeTypes[0] : 'video/webm';
        setdeviceMimeType(mimeType);

        const recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = event => {
            if (event.data.size > 0) {
                setRecordedChunks(prev => [...prev, event.data]);
            }
        };

        recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mimeType });
            const url = URL.createObjectURL(blob);
            const endTime = Date.now();
            setRecordingEndTime(endTime);
            const duration = Math.floor((endTime - recordingStartTime) / 1000);

            // console.log("duration", duration)
            if (duration >= 5 && duration <= 1000) {               
                downloadVideo(url);
            } else {
                alert("다시 녹화를 시작해주세요.");
                setIsRecording(false);
                URL.revokeObjectURL(url);
            }
        };

        setMediaRecorder(recorder);
        recorder.start();
        setRecordingStartTime(Date.now());
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
        }
    };

    const downloadVideo = (url) => {
        if (url) {
            const a = document.createElement('a');
            a.href = url;
            if(deviceMimeType.includes("webm")){
                a.download = "sketch.webm"; // Assume webm for simplicity
            }
            else {
                a.download = "sketch.mp4";  
            }            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsRecording(false);
        }
    };

    useEffect(()=> {
        const htmlTitle = document.querySelector("title");
        htmlTitle.innerHTML = "영일도방 - 3D 미리보기"
      }, [])

    return (
        <div className={`modal-${isOpen ? 'overlay' : 'closed'}`}>
            <div className="modal-content" ref={containerRef}>
                <button className="threeD-save-button" 
                    onClick={() => {
                        if (!isRecording) {
                            startRecording();
                        } else {
                            stopRecording();
                        }
                        setIsRecording((prev) => !prev);
                    }}>{isRecording ? `녹화 중 (${recordingTime}s)` : (recordingTime >= 5 ? "저장 가능" : "녹화 시작")}
                    </button>
                <button className="threeD-close-button" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default ThreeDModal;
