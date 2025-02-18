document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  /* ------------- シーン管理 ------------- */
  function showScene(sceneId) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => scene.style.display = "none");
    const target = document.getElementById(sceneId);
    if (target) {
      target.style.display = "block";
    } else {
      console.error(`Scene with ID "${sceneId}" が見つかりません`);
    }
  }

  /* ------------- 初期シーン設定 ------------- */
  showScene("title-screen");
  document.getElementById("title-screen").addEventListener("click", () => {
    showScene("narration-screen");
  });

  /* ------------- ナレーション管理（エリア1/2） ------------- */
  const narrationScreen = document.getElementById("narration-screen");
  const narrationContent = document.getElementById("narration-content");

  const narrationTextsArea1 = [
    "君は目を覚ますと、自分の部屋にいた…",
    "部屋から出ようとするが、鍵がかかっている…",
    "どうやらこの鍵を開けないと出られないようだ。"
  ];
  const narrationTextsArea2 = [
    "無事部屋を脱出した君は、操舵室にたどり着いた。",
    "なぜ自分の部屋にあんな鍵が...？考えても答えは出ない...",
    "その時ふと、あることに気がついた。",
    "━操舵室に、ノアが居ない。",
    "どこに行ったのだろう？探しに行こうとすると、声が聞こえた。",
    "団長さん！ここだよ！聞こえるかい！？",
    "声はするが、姿は見えず━、君はこの部屋を探すことにした。"
  ];

  let currentArea = "area1";
  let narrationIndex = 0;
  narrationScreen.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentArea === "area1") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea1.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea1[narrationIndex]}</p>`;
      } else {
        // エリア1ナレーション終了 → エリア1ゲームシーンへ
        showScene("game-screen");
      }
    } else if (currentArea === "area2") {
      if (narrationIndex < narrationTextsArea2.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
        narrationIndex++;
      } else {
        // エリア2ナレーション終了 → エリア2ゲームシーンへ
        showScene("game-screen2");
      }
    }
  });

  function startArea2Narration() {
    currentArea = "area2";
    narrationIndex = 0;
    const narrationBackground = document.querySelector('#narration-screen .narration-background');
    const narrationFrame = document.querySelector('#narration-screen .narration-frame');
    if (narrationBackground) narrationBackground.src = "images/bg2.jpg";
    if (narrationFrame) narrationFrame.src = "images/log.png";
    narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
    narrationIndex++;
    showScene("narration-screen");
  }

  /* ------------- エリア1ゲームシーン処理 ------------- */
  const bedArea = document.getElementById("bed-area");
  const casterArea = document.getElementById("caster-area");
  const exitButton = document.getElementById("exit-button");
  const hintModal = document.getElementById("hint-modal");
  const hintImage = document.getElementById("hint-image");
  const hintTextInModal = document.getElementById("hint-text-in-modal");
  const exitModal = document.getElementById("exit-modal");
  const passwordInput = document.getElementById("password-input");
  const passwordSubmit = document.getElementById("password-submit");

  bedArea.addEventListener("click", (e) => {
    e.stopPropagation();
    hintImage.src = "images/bg1_hint1.jpg";
    hintTextInModal.textContent = "ベッドには謎の紙片が残されている…";
    hintModal.style.display = "flex";
  });
  casterArea.addEventListener("click", (e) => {
    e.stopPropagation();
    hintImage.src = "images/bg1_hint2.jpg";
    hintTextInModal.textContent = "キャスターに妙な跡がある…";
    hintModal.style.display = "flex";
  });
  hintModal.addEventListener("click", () => { hintModal.style.display = "none"; });
  exitButton.addEventListener("click", (e) => {
    e.stopPropagation();
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });
  exitModal.addEventListener("click", (e) => {
    if (e.target === exitModal) { exitModal.style.display = "none"; }
  });
  passwordSubmit.addEventListener("click", () => {
    const input = passwordInput.value.trim();
    const correctPassword = "4593";
    if (/^\d{4}$/.test(input)) {
      if (input === correctPassword) {
        alert("鍵が開いた！\nエリア1クリア！\n次はエリア2のナレーションです。");
        exitModal.style.display = "none";
        startArea2Narration();
      } else {
        alert("間違っているようだ...");
        passwordInput.value = "";
      }
    } else {
      alert("間違っているようだ...");
      passwordInput.value = "";
    }
  });

  // ヒントボタン（ゲームシーン内）
  const hintButton = document.createElement("button");
  hintButton.textContent = "ヒント";
  hintButton.id = "hint-button";
  hintButton.classList.add("button");
  document.getElementById("game-screen").appendChild(hintButton);
  const hintText = document.createElement("p");
  hintText.id = "hint-text";
  hintText.textContent = "";
  hintText.style.display = "none";
  document.getElementById("game-screen").appendChild(hintText);
  hintButton.addEventListener("click", () => {
    hintText.textContent = "くはっ！数字は別のヒントの色と連動しているよ！";
    hintText.style.display = "block";
    setTimeout(() => { hintText.style.display = "none"; }, 3000);
  });
  document.addEventListener("click", (e) => {
    if (e.target !== hintButton) { hintText.style.display = "none"; }
  });

  /* ------------- エリア2ゲームシーンの作成（動的生成） ------------- */
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  // 背景はCSSで #game-screen2 { background-size: contain; ... } を設定

  // タップ領域：デスクエリア（エリア2）
  const deskArea2 = document.createElement("div");
  deskArea2.id = "desk-area2";
  deskArea2.style.position = "absolute";
  deskArea2.style.width = "200px";
  deskArea2.style.height = "200px";
  deskArea2.style.top = "40%";
  deskArea2.style.left = "30%";
  deskArea2.style.backgroundColor = "rgba(255,0,0,0.3)";
  deskArea2.style.cursor = "pointer";
  gameScreen2.appendChild(deskArea2);
  const deskOverlay = document.createElement("img");
  deskOverlay.src = "images/bg2_desk.png";
  deskOverlay.style.position = "absolute";
  deskOverlay.style.top = "0";
  deskOverlay.style.left = "0";
  deskOverlay.style.width = "100%";
  deskOverlay.style.height = "100%";
  deskArea2.appendChild(deskOverlay);

  // タップ領域：ドライブエリア（エリア2）
  const driveArea2 = document.createElement("div");
  driveArea2.id = "drive-area2";
  driveArea2.style.position = "absolute";
  driveArea2.style.width = "200px";
  driveArea2.style.height = "200px";
  driveArea2.style.top = "40%";
  driveArea2.style.left = "60%";
  driveArea2.style.backgroundColor = "rgba(0,0,255,0.3)";
  driveArea2.style.cursor = "pointer";
  gameScreen2.appendChild(driveArea2);
  const driveOverlay = document.createElement("img");
  driveOverlay.src = "images/bg2_drive.png";
  driveOverlay.style.position = "absolute";
  driveOverlay.style.top = "0";
  driveOverlay.style.left = "0";
  driveOverlay.style.width = "100%";
  driveOverlay.style.height = "100%";
  driveArea2.appendChild(driveOverlay);

  // パズルフラグ
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;

  deskArea2.addEventListener("click", (e) => {
    e.stopPropagation();
    showPuzzleModal("desk");
  });
  driveArea2.addEventListener("click", (e) => {
    e.stopPropagation();
    showPuzzleModal("drive");
  });

  /* ------------- シルエットパズルモーダル ------------- */
  function showPuzzleModal(puzzleType) {
    let puzzleModal = document.getElementById("puzzle-modal");
    if (!puzzleModal) {
      puzzleModal = document.createElement("div");
      puzzleModal.id = "puzzle-modal";
      // 白背景
      puzzleModal.style.backgroundColor = "#fff";
      puzzleModal.style.position = "fixed";
      puzzleModal.style.top = "0";
      puzzleModal.style.left = "0";
      puzzleModal.style.width = "100%";
      puzzleModal.style.height = "100%";
      puzzleModal.style.display = "flex";
      puzzleModal.style.flexDirection = "column";
      puzzleModal.style.justifyContent = "center";
      puzzleModal.style.alignItems = "center";
      puzzleModal.style.zIndex = "3000";
      document.body.appendChild(puzzleModal);
    }
    puzzleModal.innerHTML = "";

    // ボード200×200, セル100×100
    const boardSize = 200;
    const boardContainer = document.createElement("div");
    boardContainer.id = "puzzle-board";
    boardContainer.style.width = boardSize + "px";
    boardContainer.style.height = boardSize + "px";
    boardContainer.style.display = "grid";
    boardContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    boardContainer.style.gridTemplateRows = "repeat(2, 1fr)";
    boardContainer.style.gap = "2px";
    boardContainer.style.border = "2px solid #000";
    puzzleModal.appendChild(boardContainer);

    for (let i = 0; i < 4; i++) {
      const cell = document.createElement("div");
      cell.className = "puzzle-cell";
      cell.dataset.cellIndex = i;
      cell.style.border = "1px dashed #aaa";
      cell.style.width = "100%";
      cell.style.height = "100%";
      cell.style.position = "relative";
      // ドロップ処理
      cell.addEventListener("dragover", (e) => { e.preventDefault(); });
      cell.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          cell.appendChild(draggedPiece);
          // ドロップ時にピースをセルサイズ(100%)に合わせる
          draggedPiece.style.width = "100%";
          draggedPiece.style.height = "100%";
          draggedPiece.style.position = "relative";
          checkPuzzleBoardCompletion(puzzleType);
        }
      });
      boardContainer.appendChild(cell);
    }

    // ピーストレイ
    const trayContainer = document.createElement("div");
    trayContainer.id = "puzzle-tray";
    trayContainer.style.width = "100%";
    trayContainer.style.height = "120px";
    trayContainer.style.display = "flex";
    trayContainer.style.justifyContent = "flex-start";
    trayContainer.style.alignItems = "center";
    trayContainer.style.overflowX = "auto";
    trayContainer.style.backgroundColor = "#eee";
    trayContainer.style.marginTop = "20px";
    puzzleModal.appendChild(trayContainer);

    let puzzleImageSrc = (puzzleType === "desk")
      ? "images/noa_puzzle.png"
      : "images/roberia_puzzle.png";

    for (let i = 0; i < 4; i++) {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.correctIndex = i;
      piece.style.width = "100px";
      piece.style.height = "100px";
      piece.style.boxSizing = "border-box";
      piece.style.border = "1px solid #ccc";
      piece.style.backgroundImage = `url(${puzzleImageSrc})`;
      piece.style.backgroundSize = "200% 200%";
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      piece.style.backgroundPosition = `${posX} ${posY}`;
      piece.draggable = true;

      // ★ ランダム回転させたい場合
      const rotations = [0, 90, 180, 270];
      const randomRot = rotations[Math.floor(Math.random() * rotations.length)];
      piece.dataset.rotation = randomRot.toString();
      piece.style.transform = `rotate(${randomRot}deg)`;

      piece.addEventListener("dragstart", onDragStart);
      piece.addEventListener("dragend", onDragEnd);

      const rotateBtn = document.createElement("button");
      rotateBtn.textContent = "回転";
      rotateBtn.style.position = "absolute";
      rotateBtn.style.bottom = "2px";
      rotateBtn.style.right = "2px";
      rotateBtn.style.zIndex = "10";
      rotateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        let currentRotation = parseInt(piece.dataset.rotation);
        currentRotation = (currentRotation + 90) % 360;
        piece.dataset.rotation = currentRotation.toString();
        piece.style.transform = `rotate(${currentRotation}deg)`;
        checkPuzzleBoardCompletion(puzzleType);
      });
      piece.appendChild(rotateBtn);

      trayContainer.appendChild(piece);
    }

    // 閉じるボタン
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "閉じる";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.addEventListener("click", () => {
      puzzleModal.style.display = "none";
    });
    puzzleModal.appendChild(closeBtn);

    puzzleModal.style.display = "flex";
  }

  /* ------------- ドラッグ処理 ------------- */
  let draggedPiece = null;
  function onDragStart(e) {
    draggedPiece = this;
    e.dataTransfer.setData("text/plain", this.dataset.correctIndex);
    setTimeout(() => { this.style.opacity = "0.5"; }, 0);
  }
  function onDragEnd(e) {
    this.style.opacity = "1";
    draggedPiece = null;
  }

  /* ------------- 完成判定 ------------- */
  function checkPuzzleBoardCompletion(puzzleType) {
    const cells = document.querySelectorAll(".puzzle-cell");
    let isComplete = true;
    cells.forEach(cell => {
      if (!cell.firstElementChild) {
        isComplete = false;
      } else {
        let piece = cell.firstElementChild;
        const correctIdx = piece.dataset.correctIndex;
        const currentRot = parseInt(piece.dataset.rotation);
        if (correctIdx !== cell.dataset.cellIndex || currentRot !== 0) {
          isComplete = false;
        }
      }
    });
    if (isComplete) {
      alert(`${puzzleType}パズルクリア！`);
      if (puzzleType === "desk") {
        puzzleDeskCleared = true;
      } else if (puzzleType === "drive") {
        puzzleDriveCleared = true;
      }
      document.getElementById("puzzle-modal").style.display = "none";
      checkAllPuzzlesCleared();
    }
  }
  function checkAllPuzzlesCleared() {
    if (puzzleDeskCleared && puzzleDriveCleared) {
      console.log("エリア2クリア!");
      startArea3Narration();
    }
  }
  function startArea3Narration() {
    alert("エリア2クリア! エリア3のナレーションを開始します。");
    // エリア3以降の処理をここに実装
  }

});