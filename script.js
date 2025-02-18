document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  // -------------------------------
  // シーン管理（最新のシーン一覧を毎回取得）
  // -------------------------------
  function showScene(sceneId) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => (scene.style.display = "none"));
    const target = document.getElementById(sceneId);
    if (target) {
      target.style.display = "block";
    } else {
      console.error(`Scene with ID "${sceneId}" が見つかりません`);
    }
  }

  // -------------------------------
  // 初期シーン設定
  // -------------------------------
  showScene("title-screen");

  // タイトル画面クリック → エリア1ナレーション開始
  document.getElementById("title-screen").addEventListener("click", () => {
    showScene("narration-screen");
  });

  // -------------------------------
  // ナレーション管理（エリア1 / エリア2）
  // -------------------------------
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

  narrationScreen.addEventListener("click", (event) => {
    event.stopPropagation();
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
    // 差し替え：エリア2用背景、フレーム（必要に応じて調整）
    const narrationBackground = document.querySelector('#narration-screen .narration-background');
    const narrationFrame = document.querySelector('#narration-screen .narration-frame');
    if (narrationBackground) narrationBackground.src = "images/bg2.jpg";
    if (narrationFrame) narrationFrame.src = "images/log.png";
    narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
    narrationIndex++;
    showScene("narration-screen");
  }

  // -------------------------------
  // エリア1ゲームシーン処理
  // -------------------------------
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
  hintModal.addEventListener("click", () => {
    hintModal.style.display = "none";
  });
  exitButton.addEventListener("click", (e) => {
    e.stopPropagation();
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });
  exitModal.addEventListener("click", (event) => {
    if (event.target === exitModal) {
      exitModal.style.display = "none";
    }
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
    setTimeout(() => {
      hintText.style.display = "none";
    }, 3000);
  });
  document.addEventListener("click", (event) => {
    if (event.target !== hintButton) {
      hintText.style.display = "none";
    }
  });

  // -------------------------------
  // エリア2ゲームシーンの作成（動的生成）
  // -------------------------------
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.backgroundImage = "url('images/bg2.jpg')";
  gameScreen2.style.backgroundSize = "cover";
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  // タップ可能領域：デスクエリア（エリア2）
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

  // タップ可能領域：ドライブエリア（エリア2）
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

  // -------------------------------
  // パズルクリアフラグ管理（エリア2）
  // -------------------------------
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

  function showPuzzleModal(puzzleType) {
    let puzzleModal = document.getElementById("puzzle-modal");
    if (!puzzleModal) {
      puzzleModal = document.createElement("div");
      puzzleModal.id = "puzzle-modal";
      puzzleModal.style.position = "fixed";
      puzzleModal.style.top = "0";
      puzzleModal.style.left = "0";
      puzzleModal.style.width = "100%";
      puzzleModal.style.height = "100%";
      puzzleModal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      puzzleModal.style.display = "flex";
      puzzleModal.style.justifyContent = "center";
      puzzleModal.style.alignItems = "center";
      document.body.appendChild(puzzleModal);
    }
    puzzleModal.innerHTML = "";

    const puzzleContainer = document.createElement("div");
    puzzleContainer.id = "puzzle-container";
    puzzleContainer.style.position = "relative";
    puzzleContainer.style.width = "400px";
    puzzleContainer.style.height = "400px";
    puzzleContainer.style.backgroundColor = "#fff";
    puzzleContainer.style.display = "flex";
    puzzleContainer.style.flexWrap = "wrap";
    puzzleContainer.style.border = "2px solid #000";
    puzzleModal.appendChild(puzzleContainer);

    let puzzleImageSrc = (puzzleType === "desk")
      ? "images/noa_puzzle.png"
      : "images/roberia_puzzle.png";

    for (let i = 0; i < 4; i++) {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.index = i;
      piece.dataset.rotation = "0";
      piece.style.width = "50%";
      piece.style.height = "50%";
      piece.style.boxSizing = "border-box";
      piece.style.border = "1px solid #ccc";
      piece.style.position = "relative";
      piece.style.backgroundImage = `url(${puzzleImageSrc})`;
      piece.style.backgroundSize = "200% 200%";
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      piece.style.backgroundPosition = `${posX} ${posY}`;

      piece.draggable = true;
      piece.addEventListener("dragstart", onDragStart);
      piece.addEventListener("dragend", onDragEnd);
      piece.addEventListener("dragover", onDragOver);
      piece.addEventListener("drop", onDrop);

      const rotateBtn = document.createElement("button");
      rotateBtn.textContent = "回転";
      rotateBtn.style.position = "absolute";
      rotateBtn.style.bottom = "5px";
      rotateBtn.style.right = "5px";
      rotateBtn.style.zIndex = "10";
      rotateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        let currentRotation = parseInt(piece.dataset.rotation);
        currentRotation = (currentRotation + 90) % 360;
        piece.dataset.rotation = currentRotation.toString();
        piece.style.transform = `rotate(${currentRotation}deg)`;
        checkPuzzleCompletion(puzzleType);
      });
      piece.appendChild(rotateBtn);

      puzzleContainer.appendChild(piece);
    }

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

    randomizePuzzlePieces(puzzleContainer);
  }

  let draggedPiece = null;
  function onDragStart(e) {
    draggedPiece = this;
    e.dataTransfer.setData("text/plain", this.dataset.index);
    setTimeout(() => {
      this.style.opacity = "0.5";
    }, 0);
  }
  function onDragEnd(e) {
    this.style.opacity = "1";
    draggedPiece = null;
  }
  function onDragOver(e) {
    e.preventDefault();
  }
  function onDrop(e) {
    e.preventDefault();
    if (draggedPiece && draggedPiece !== this) {
      let temp = document.createElement("div");
      this.parentNode.insertBefore(temp, this);
      draggedPiece.parentNode.insertBefore(this, draggedPiece);
      temp.parentNode.insertBefore(draggedPiece, temp);
      temp.parentNode.removeChild(temp);
      checkPuzzleCompletionForBoth();
    }
  }
  function randomizePuzzlePieces(container) {
    let pieces = Array.from(container.getElementsByClassName("puzzle-piece"));
    pieces.sort(() => Math.random() - 0.5);
    pieces.forEach(piece => {
      container.appendChild(piece);
    });
  }
  function checkPuzzleCompletion(puzzleType) {
    const puzzleModal = document.getElementById("puzzle-modal");
    if (!puzzleModal) return;
    const puzzleContainer = document.getElementById("puzzle-container");
    const pieces = Array.from(puzzleContainer.getElementsByClassName("puzzle-piece"));
    let isComplete = true;
    pieces.forEach((piece, index) => {
      if (piece.dataset.index != index || parseInt(piece.dataset.rotation) !== 0) {
        isComplete = false;
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
      checkPuzzleCompletionForBoth();
    }
  }
  function checkPuzzleCompletionForBoth() {
    if (puzzleDeskCleared && puzzleDriveCleared) {
      console.log("エリア2クリア!");
      startArea3Narration();
    }
  }
  function startArea3Narration() {
    alert("エリア2クリア! エリア3のナレーションを開始します。");
    // ここでエリア3ナレーション開始処理を実装してください
  }
});