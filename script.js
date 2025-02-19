document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  /* =============================
     シーン管理
     ============================= */
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

  /* =============================
     ナレーション管理
     ============================= */
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
        // エリア1ナレーション終了 → エリア1ゲームシーンへ
        showScene("game-screen");
      }
    } else if (currentArea === "area2") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea2.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
      } else {
        // エリア2ナレーション終了 → エリア2ゲームシーン
        showScene("game-screen2");
      }
    }
  });

  function startArea2Narration() {
    currentArea = "area2";
    narrationIndex = 0;
    // エリア2の背景に差し替え
    const narrationBackground = document.querySelector('#narration-screen .narration-background');
    const narrationFrame = document.querySelector('#narration-screen .narration-frame');
    if (narrationBackground) narrationBackground.src = "images/bg2.jpg";
    if (narrationFrame) narrationFrame.src = "images/log.png";
    narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
    showScene("narration-screen");
  }

  /* =============================
     エリア1ゲームシーン
     ============================= */
  const bedArea = document.getElementById("bed-area");
  const casterArea = document.getElementById("caster-area");
  const exitButton = document.getElementById("exit-button");

  const hintModal = document.getElementById("hint-modal");
  const hintImage = document.getElementById("hint-image");
  const hintTextInModal = document.getElementById("hint-text-in-modal");

  const exitModal = document.getElementById("exit-modal");
  const passwordInput = document.getElementById("password-input");
  const passwordSubmit = document.getElementById("password-submit");

  // ベッド・キャスタータップ
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
  hintModal.addEventListener("click", () => {
    hintModal.style.display = "none";
  });

  // 部屋から出るボタン
  exitButton.addEventListener("click", () => {
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });
  exitModal.addEventListener("click", (e) => {
    if (e.target === exitModal) {
      exitModal.style.display = "none";
    }
  });

  // パスワード判定
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

  // ヒントボタン
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
  document.addEventListener("click", (e) => {
    if (e.target !== hintButton) {
      hintText.style.display = "none";
    }
  });

  /* =============================
     エリア2ゲームシーン (動的生成)
     ============================= */
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  // 背景はCSSで #game-screen2 { background-size: contain; ... } などを設定
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  // タップ領域 (デスク)
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

  // タップ領域 (ドライブ)
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

  // フラグ管理
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;

  deskArea2.addEventListener("click", () => {
    showPuzzleModal("desk");
  });
  driveArea2.addEventListener("click", () => {
    showPuzzleModal("drive");
  });

  /* =============================
     パズルモーダル (タップ式)
     ============================= */
  const puzzleModal = document.getElementById("puzzle-modal");
  let selectedContainer = null; // 現在選択中のピース

  function showPuzzleModal(puzzleType) {
    puzzleModal.innerHTML = "";
    puzzleModal.style.display = "flex";

    // パズルボード (200×200, 2×2)
    const board = document.createElement("div");
    board.id = "puzzle-board";
    puzzleModal.appendChild(board);

    // 4つのセル
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement("div");
      cell.className = "puzzle-cell";
      cell.dataset.cellIndex = i.toString();
      // セルをタップすると、選択中のピースがあれば配置
     cell.addEventListener("click", () => {
  if (selectedPiece) {
    if (cell.firstElementChild && cell.firstElementChild !== selectedPiece) {
      // すでにパネルが配置されている場合は、交換（スワップ）する
      let existing = cell.firstElementChild;
      let parentOfSelected = selectedPiece.parentNode;
      cell.replaceChild(selectedPiece, existing);
      parentOfSelected.appendChild(existing);
      selectedPiece.classList.remove("selected");
      selectedPiece = null;
    } else {
      // セルが空の場合は、そのまま配置
      cell.appendChild(selectedPiece);
      selectedPiece.style.position = "relative";
      selectedPiece.style.left = "0";
      selectedPiece.style.top = "0";
      selectedPiece.style.width = "100%";
      selectedPiece.style.height = "100%";
      selectedPiece.classList.remove("selected");
      checkBoardCompletion(puzzleType);
      selectedPiece = null;
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

    // ピースを4つ
    for (let i = 0; i < 4; i++) {
      const container = document.createElement("div");
      container.className = "piece-container";

      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.correctIndex = i.toString();

      // ランダム回転 (0,90,180,270)
      const rotations = [0, 90, 180, 270];
      const r = rotations[Math.floor(Math.random() * rotations.length)];
      piece.dataset.rotation = r.toString();
      piece.style.transform = `rotate(${r}deg)`;

      piece.style.backgroundImage = `url(${puzzleImageSrc})`;
      piece.style.backgroundSize = "200% 200%";
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      piece.style.backgroundPosition = `${posX} ${posY}`;

      // ピースをタップすると選択状態を切り替え
      piece.addEventListener("click", (e) => {
        e.stopPropagation();
        // 既に他のピースが選択されていたら解除
        if (selectedPiece && selectedPiece !== piece) {
          selectedPiece.classList.remove("selected");
        }
        // 同じピースを再度タップで解除
        if (selectedPiece === piece) {
          piece.classList.remove("selected");
          selectedPiece = null;
        } else {
          piece.classList.add("selected");
          selectedPiece = piece;
        }
      });

      // 回転ボタン (ピースコンテナに固定)
      const rotateBtn = document.createElement("button");
      rotateBtn.textContent = "回転";
      rotateBtn.className = "rotate-btn";
      rotateBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        let currentRot = parseInt(piece.dataset.rotation);
        currentRot = (currentRot + 90) % 360;
        piece.dataset.rotation = currentRot.toString();
        piece.style.transform = `rotate(${currentRot}deg)`;
        checkBoardCompletion(puzzleType);
      });

      container.appendChild(piece);
      container.appendChild(rotateBtn);
      tray.appendChild(container);
    }

    // 閉じるボタン
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "閉じる";
    closeBtn.className = "close-btn";
    closeBtn.addEventListener("click", () => {
      puzzleModal.style.display = "none";
      selectedPiece = null;
    });
    puzzleModal.appendChild(closeBtn);
  }

  // 完成判定
  function checkBoardCompletion(puzzleType) {
    const board = document.getElementById("puzzle-board");
    if (!board) return;
    let isComplete = true;
    const cells = board.querySelectorAll(".puzzle-cell");
    cells.forEach(cell => {
      if (!cell.firstElementChild) {
        isComplete = false;
      } else {
        const piece = cell.firstElementChild;
        const correctIdx = piece.dataset.correctIndex;
        const rot = parseInt(piece.dataset.rotation);
        // 正しいセルかつ回転が0°
        if (correctIdx !== cell.dataset.cellIndex || rot !== 0) {
          isComplete = false;
        }
      }
    });
   if (isComplete) {
  alert(`${puzzleType}パズルクリア！`);
  // 完成時、パズルボード内をクリアして完成画像を表示する
  board.innerHTML = "";
  const finalImg = document.createElement("img");
  finalImg.style.width = "200px";
  finalImg.style.height = "200px";
  // 例：puzzleType が "desk" の場合は "images/noa.png"、"drive" の場合は "images/roberia.png"
  finalImg.src = (puzzleType === "desk") ? "images/noa.png" : "images/roberia.png";
  board.appendChild(finalImg);
  document.getElementById("puzzle-modal").style.display = "none";
  selectedPiece = null;
}
      // フラグ立て
      if (puzzleType === "desk") {
        puzzleDeskCleared = true;
      } else {
        puzzleDriveCleared = true;
      }
      selectedPiece = null;
      checkAllPuzzlesCleared();
    }
  }
  function checkAllPuzzlesCleared() {
    if (puzzleDeskCleared && puzzleDriveCleared) {
      console.log("エリア2クリア!");
      // ここでエリア3ナレーションへ移行
      alert("エリア2クリア！ エリア3へ…");
    }
  }
});