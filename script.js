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

  // 初期はタイトル画面
  showScene("title-screen");
  document.getElementById("title-screen").addEventListener("click", () => {
    showScene("narration-screen");
  });

  /* ------------- ナレーション管理 ------------- */
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
  narrationScreen.addEventListener("click", () => {
    if (currentArea === "area1") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea1.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea1[narrationIndex]}</p>`;
      } else {
        showScene("game-screen");
      }
    } else if (currentArea === "area2") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea2.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
      } else {
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

  bedArea.addEventListener("click", () => {
    hintImage.src = "images/bg1_hint1.jpg";
    hintTextInModal.textContent = "ベッドには謎の紙片が残されている…";
    hintModal.style.display = "flex";
  });
  casterArea.addEventListener("click", () => {
    hintImage.src = "images/bg1_hint2.jpg";
    hintTextInModal.textContent = "キャスターに妙な跡がある…";
    hintModal.style.display = "flex";
  });
  hintModal.addEventListener("click", () => { hintModal.style.display = "none"; });

  exitButton.addEventListener("click", () => {
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });
  exitModal.addEventListener("click", (e) => {
    if (e.target === exitModal) {
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

  // ヒントボタン（エリア1ゲームシーン内）
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
    if (e.target !== hintButton) {
      hintText.style.display = "none";
    }
  });

  /* ------------- エリア2ゲームシーンの作成（動的生成） ------------- */
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  // 背景は CSS により設定済み

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

  /* ------------- パズルクリアフラグ管理（エリア2） ------------- */
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;

  deskArea2.addEventListener("click", () => {
    showPuzzleModal("desk");
  });
  driveArea2.addEventListener("click", () => {
    showPuzzleModal("drive");
  });

  /* ------------- シルエットパズルモーダル ------------- */
  // グローバル回転ボタンはモーダル外に配置
  const puzzleModal = document.getElementById("puzzle-modal");
  let selectedContainer = null; // 現在選択中のピースコンテナ
  function showPuzzleModal(puzzleType) {
    puzzleModal.innerHTML = "";
    puzzleModal.style.display = "flex";

    // パズルボード (200×200, 2×2)
    const board = document.createElement("div");
    board.id = "puzzle-board";
    puzzleModal.appendChild(board);
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement("div");
      cell.className = "puzzle-cell";
      cell.dataset.cellIndex = i.toString();
      // セルタップで、選択中のパネルを配置・入れ替え
      cell.addEventListener("click", () => {
        if (selectedContainer) {
          if (cell.firstElementChild && cell.firstElementChild !== selectedContainer) {
            // セルに既にパネルがある場合、交換する
            let existing = cell.firstElementChild;
            let parentOfSelected = selectedContainer.parentNode;
            cell.replaceChild(selectedContainer, existing);
            parentOfSelected.appendChild(existing);
            selectedContainer.classList.remove("selected");
            selectedContainer = null;
          } else {
            // セルが空の場合、配置する
            cell.appendChild(selectedContainer);
            selectedContainer.style.position = "relative";
            selectedContainer.style.left = "0";
            selectedContainer.style.top = "0";
            selectedContainer.style.width = "100%";
            selectedContainer.style.height = "100%";
            selectedContainer.classList.remove("selected");
            checkBoardCompletion(puzzleType);
            selectedContainer = null;
          }
        }
      });
      board.appendChild(cell);
    }

    // ピーストレイ
    const tray = document.createElement("div");
    tray.id = "puzzle-tray";
    puzzleModal.appendChild(tray);

    let puzzleImageSrc = (puzzleType === "desk")
      ? "images/noa_puzzle.png"
      : "images/roberia_puzzle.png";

    // 4つのピース生成
    for (let i = 0; i < 4; i++) {
      const container = document.createElement("div");
      container.className = "piece-container";
      container.dataset.correctIndex = i.toString();
      container.dataset.rotation = "0";

      const silhouette = document.createElement("div");
      silhouette.className = "puzzle-silhouette";
      silhouette.dataset.correctIndex = i.toString();
      silhouette.dataset.rotation = "0";
      silhouette.style.backgroundImage = `url(${puzzleImageSrc})`;
      silhouette.style.backgroundSize = "200% 200%";
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      silhouette.style.backgroundPosition = `${posX} ${posY}`;

      // タップで選択（グローバル変数 selectedContainer に記憶）
      container.addEventListener("click", (e) => {
        e.stopPropagation();
        if (selectedContainer && selectedContainer !== container) {
          selectedContainer.classList.remove("selected");
        }
        if (selectedContainer === container) {
          container.classList.remove("selected");
          selectedContainer = null;
        } else {
          container.classList.add("selected");
          selectedContainer = container;
        }
      });

      container.appendChild(silhouette);
      tray.appendChild(container);
    }

    // グローバル回転ボタン（モーダル外に固定済み）
    let globalRotateBtn = document.getElementById("global-rotate-btn");
    if (!globalRotateBtn) {
      globalRotateBtn = document.createElement("button");
      globalRotateBtn.id = "global-rotate-btn";
      globalRotateBtn.textContent = "回転";
      globalRotateBtn.addEventListener("click", () => {
        if (selectedContainer) {
          let currentRot = parseInt(selectedContainer.dataset.rotation);
          currentRot = (currentRot + 90) % 360;
          selectedContainer.dataset.rotation = currentRot.toString();
          selectedContainer.style.transform = `rotate(${currentRot}deg)`;
          checkBoardCompletion(puzzleType);
        }
      });
      document.body.appendChild(globalRotateBtn);
    }

    // 閉じるボタン
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "閉じる";
    closeBtn.className = "close-btn";
    closeBtn.addEventListener("click", () => {
      puzzleModal.style.display = "none";
      selectedContainer = null;
    });
    puzzleModal.appendChild(closeBtn);
  }

  /* ------------- 完成判定 ------------- */
  function checkBoardCompletion(puzzleType) {
    const board = document.getElementById("puzzle-board");
    if (!board) return;
    let isComplete = true;
    const cells = board.querySelectorAll(".puzzle-cell");
    cells.forEach(cell => {
      if (!cell.firstElementChild) {
        isComplete = false;
      } else {
        const container = cell.firstElementChild;
        const correctIdx = container.dataset.correctIndex;
        const rot = parseInt(container.dataset.rotation);
        if (correctIdx !== cell.dataset.cellIndex || rot !== 0) {
          isComplete = false;
        }
      }
    });
    if (isComplete) {
      alert(`${puzzleType}パズルクリア！`);
      // 完成時、パズルボードをクリアして完成画像を表示
      board.innerHTML = "";
      const finalImg = document.createElement("img");
      finalImg.style.width = "200px";
      finalImg.style.height = "200px";
      // puzzleType が "desk" の場合は "noa.png"、"drive" の場合は "roberia.png"
      finalImg.src = (puzzleType === "desk") ? "images/noa.png" : "images/roberia.png";
      board.appendChild(finalImg);
      puzzleModal.style.display = "none";
      selectedContainer = null;
    }
  }

  /* ------------- エリア2ゲームシーン生成 ------------- */
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);
  // 背景は CSS で設定済み

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

  /* ------------- パズルクリアフラグ管理（エリア2） ------------- */
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;
});