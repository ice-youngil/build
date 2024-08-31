# 영일도방 스케치툴 제작

<div align="center">
<img width="50" alt="image" src="https://raw.githubusercontent.com/ice-youngil/build/main/youngildobang-sketch-ver3/favicon.ico">

</div>

> **한국외국어대학교 영일도방 툴 개발팀** <br/> **개발기간: 2024.07 ~ 2024.08**

## 배포 주소

> **개발 버전** : [http://yiceramics.cafe24.com:3000/](http://yiceramics.cafe24.com:3000/) <br>


## 개발팀 소개

|      정호영       |          신범수         |       김원빈         |                              양재원          | 김세은                                                            
| :------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | 
|   <img width="160px" src="https://avatars.githubusercontent.com/u/81744539?v=4" />    |                      <img width="160px" src="https://avatars.githubusercontent.com/u/138092396?s=64&v=4" />    |                   <img width="160px" src="https://avatars.githubusercontent.com/u/67516846?s=96&v=4"/>   | <img width="160px" src="https://avatars.githubusercontent.com/u/101964792?s=96&v=4"/>   | <img width="160px" src="https://avatars.githubusercontent.com/u/133905603?s=96&v=4"/>   | 
|   [@ghrnwjd](https://github.com/ghrnwjd)   |    [@beomsu](https://github.com/qjatn7034)  | [@been](https://github.com/been12151)  | [@jay-onee](https://github.com/jay-onee)  | [@ssen](https://github.com/ssen-k)  |
| 한국외국어대학교 정보통신공학과 4학년 | 한국외국어대학교 정보통신공학과 4학년 | 한국외국어대학교 정보통신공학과 4학년 | 한국외국어대학교 정보통신공학과 4학년 | 한국외국어대학교 정보통신공학과 3학년 | 
| PM | FRONT | FUNCTION | 3D MODELING | FIGMA

## 프로젝트 소개

#### 문화 예술 체험에 디지털을 접목시켜 학생들의 흥미와 교육 효과를 높이고자 스케치해 온 그림을 사진찍어 올린 후 몇 가지 옵션을 선택하면 학생들이 최종적으로 만들려고 하는 도자기를 미리 시뮬레이션해볼 수 있는 Tool을 개발하고자 함

## 기능 요구서
1. 도자 수업 중 학생들이 스케치해온 그림을 입력받아서 `완성된 형태를 눈으로 직접 예측해볼 수 있는 경험`을 제공한다

2. 각 `학생들 모두 본인 스케치를 개인 휴대폰을 이용하여 직접 사용할 수 있는 방법`을 지원한다

3. 이 수업의 학생들은 초등학교 5학년 ~ 고등학교까지로 범위가 다양하며, `기능 사용 및 활용에 있어서 쉽고 편하도록 UI를 구성한다`

#### 기능 명세
|동작|동작상세|부가기능|검토 사항|
|:----------:|:----------:|:----------:|:----------:|
|기물 종류 선택| 완성할 기물 종류를 선택한다 ex) 컵, 화병, 화분, 문패 등 | | 지원할 종류 결정 |
기물에 따른 형태 선택 | 원통형, 삼각형(위가 넓어지는 형태, 위가 좁아지는), 사각 등 | | 스케치 기물의 자유 형태도 지원할 것인가? |
스케치 자료(오브제) 입력 | 학생들이 준비해 온 스케치 자료를 사진으로 입력 받음 : 크롭 기능으로 선택을 완료하면 선택한 기물의 종류와 형태가 배경에 넣고 선택한 이미지를 올려서 확인 | 사진 자르기 &nbsp; 선택 배경에 올리기  | 사진첩에서 불러 오기 외 즉시 카메 라 입력 지원? |
작업물 풍성화 작업 | 모델링의 완성도 높이기 위한 선택 기능 추가 (배경 및 오브제 형태, 패턴 적용 등) | (오브제) 확대&nbsp;(오브제) 색 입히기 &nbsp;(오브제) 테두리 진하게 &nbsp;문양 &nbsp; 반복 채우기 &nbsp; 기물 배경색 선택 (흙 종류, 유약색 및 기법에 따른) ...| 3D 모델링을 위한 다양한 형태 변형 방법 지원 |
3D 결과물 보이기 | 스케치 입력 및 다양한 선택사항 선택 후 렌더링 후 보이기 | | |
이미지 사본 저장 | 입력한 스케치 및 선택사항, 완성한 3D 결과물 저장 | | |
공유하기 | 결과물 내보내기 기능(사진으로 만든 후 공유하기)

---

## 시작 가이드
### Requirements
For building and running the application you need:

- [Node.js 20.16.0](https://nodejs.org/en/blog/release/v20.16.0)
- [Npm 10.8.1](https://www.npmjs.com/package/npm/v/10.8.1)
- [fabric 5.3.0](https://www.npmjs.com/package/fabric/v/5.3.0)
- [three 0.167.0](https://www.npmjs.com/package/three/v/0.167.0)

### Installation
``` bash
$ git clone https://github.com/ice-youngil/build.git
$ cd build
$ serve -s youngildobang-sketch-ver3
```

---

## Stacks 🐈

### Environment
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-007ACC?style=for-the-badge&logo=Visual%20Studio%20Code&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white)
![Github](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white)             

### Config
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)        

### Development
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)


### Communication
![Discord](https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white)
![KakaoTalk](https://img.shields.io/badge/kakaotalk-ffcd00.svg?style=for-the-badge&logo=kakaotalk&logoColor=000000)


---
### [영일도방 스케치 툴 가이드북](https://github.com/ice-youngil/build/blob/guide/%EC%98%81%EC%9D%BC%EB%8F%84%EB%B0%A9%20%EC%8A%A4%EC%BC%80%EC%B9%98%20%ED%88%B4%20%EA%B0%80%EC%9D%B4%EB%93%9C.pdf)
---
