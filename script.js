document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  // ================================
  // シーン管理
  // ================================
  const scenes = document.querySelectorAll('.scene');
  function showScene(sceneId) {
    scenes.forEach(scene => (scene.style.display = "none"));
    const scene = document.getElementById(sceneId);
    if (scene) {
      scene.style.display = "block";
    } else {
      console.error(`Scene with ID "${sceneId}" が見つかりません`);
    }
  }

  // 最初はタイトル画面
  showScene("title-screen");

  // タイトル画面クリック → ナレーション画面（エリア1）へ
  document.getElementById("title-screen").addEventListener("click", () => {
    showScene("narration-screen");
  });

  // ================================
  // ナレーション管理
  // ================================
  const narrationScreen = document.getElementById("narration-screen");
  const narrationContent = document.getElementById("narration-content");

  // エリア1のナレーション（1行ずつ表示）
  const narrationTextsArea1 = [
    "君は目を覚ますと、自分の部屋にいた…",
    "部屋から出ようとするが、鍵がかかっている…",
    "どうやらこの鍵を開けないと出られないようだ。"
  ];

  // エリア2のナレーション（1行ずつ表示）
  const narrationTextsArea2 = [
    "無事部屋を脱出した君は、操舵室にたどり着いた。",
    "なぜ自分の部屋にあんな鍵が...？考えても答えは出ない...",
    "その時ふと、あることに気がついた。",
    "━操舵室に、ノアが居ない。",
    "どこに行ったのだろう？探しに行こうとすると、声が聞こえた。",
    "団長さん！ここだよ！聞こえるかい！？",
    "声はするが、姿は見えず━、君はこの部屋を探すことにした。"
  ];

  // 現在のエリア状態（"area1" または "area2"）とナレーション進行用インデックス
  let currentArea = "area1";
  let narrationIndex = 0;

  // ナレーション画面のクリックイベント（1クリックで1行表示）
  narrationScreen.addEventListener("click", (event) => {
    // 子要素からのクリックがあっても、親要素での処理だけ行う
    event.stopPropagation();

    if (currentArea === "area1") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea1.length) {
        // 前の内容を上書き
        narrationContent.innerHTML = `<p>${narrationTextsArea1[narrationIndex]}</p>`;
      } else {
        // エリア1のナレーション終了 → エリア1ゲーム画面へ
        showScene("game-screen");
      }
    } else if (currentArea === "area2") {
      if (narrationIndex < narrationTextsArea2.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
        narrationIndex++;
      } else {
        showScene("game-screen2");
      }
    }
  });

  // エリア2ナレーション開始用の関数
  function startArea2Narration() {
    currentArea = "area2";
    narrationIndex = 0;
    // エリア2用の背景やフレームを変更（必要に応じて画像パスを調整）
    const narrationBackground = document.querySelector('#narration-screen .narration-background');
    const narrationFrame = document.querySelector('#narration-screen .narration-frame');
    if (narrationBackground) {
      narrationBackground.src = "images/bg2.jpg";
    }
    if (narrationFrame) {
      narrationFrame.src = "images/log.png";
    }
    // 最初の1文を表示
    narrationContent.innerHTML = `<p>${narrationTextsArea2[narrationIndex]}</p>`;
    narrationIndex++;
    showScene("narration-screen");
  }

  // ================================
  // エリア1ゲームシーンの処理
  // ================================
  const bedArea    = document.getElementById("bed-area");
  const casterArea = document.getElementById("caster-area");
  const exitButton = document.getElementById("exit-button");

  // ヒント用モーダル
  const hintModal        = document.getElementById("hint-modal");
  const hintImage        = document.getElementById("hint-image");
  const hintTextInModal  = document.getElementById("hint-text-in-modal");

  // 4桁入力モーダル
  const exitModal        = document.getElementById("exit-modal");
  const passwordInput    = document.getElementById("password-input");
  const passwordSubmit   = document.getElementById("password-submit");

  // ベッドをタップ
  bedArea.addEventListener("click", (e) => {
    e.stopPropagation();
    hintImage.src = "images/bg1_hint1.jpg"; // ヒント画像の切り替え
    hintTextInModal.textContent = "ベッドには謎の紙片が残されている…";
    hintModal.style.display = "flex";
  });

  // キャスターをタップ
  casterArea.addEventListener("click", (e) => {
    e.stopPropagation();
    hintImage.src = "images/bg1_hint2.jpg";
    hintTextInModal.textContent = "キャスターに妙な跡がある…";
    hintModal.style.display = "flex";
  });

  // ヒントモーダルをクリックで閉じる
  hintModal.addEventListener("click", () => {
    hintModal.style.display = "none";
  });

  // 「部屋から出る」ボタン → 4桁入力モーダル表示
  exitButton.addEventListener("click", (e) => {
    e.stopPropagation();
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });

  // 4桁入力モーダル外をクリックで閉じる
  exitModal.addEventListener("click", (event) => {
    if (event.target === exitModal) {
      exitModal.style.display = "none";
    }
  });

  // 4桁入力の判定（エリア1ゲームクリア）
  passwordSubmit.addEventListener("click", () => {
    const input = passwordInput.value.trim();
    const correctPassword = "4593";
    if (/^\d{4}$/.test(input)) {
      if (input === correctPassword) {
        alert("鍵が開いた！\nエリア1クリア！\n次はエリア2のナレーションです。");
        exitModal.style.display = "none";
        // エリア1ゲームクリア後 → エリア2ナレーション開始
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

  // ================================
  // ゲーム画面内のヒントボタン
  // ================================
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
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  // ================================
  // エリア2ゲームシーンの作成
  // ================================
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.backgroundImage = "url('images/bg2.jpg')";
  gameScreen2.style.backgroundSize = "cover";
  gameScreen2.style.position = "relative";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  // タップ可能領域（デスクエリア）
  const deskArea2 = document.createElement("div");
  deskArea2.id = "desk-area2";
  deskArea2.style.position = "absolute";
  deskArea2.style.width = "200px"; // 仮サイズ。後で調整可
  deskArea2.style.height = "200px";
  deskArea2.style.top = "40%";
  deskArea2.style.left = "30%";
  deskArea2.style.backgroundColor = "rgba(255,0,0,0.3)"; // 半透明の赤
  deskArea2.style.cursor = "pointer";
  gameScreen2.appendChild(deskArea2);

  // デスクエリアにオーバーレイ画像（bg2_desk.png）
  const deskOverlay = document.createElement("img");
  deskOverlay.src = "images/bg2_desk.png";
  deskOverlay.style.position = "absolute";
  deskOverlay.style.top = "0";
  deskOverlay.style.left = "0";
  deskOverlay.style.width = "100%";
  deskOverlay.style.height = "100%";
  deskArea2.appendChild(deskOverlay);

  // タップ可能領域（ドライブエリア）
  const driveArea2 = document.createElement("div");
  driveArea2.id = "drive-area2";
  driveArea2.style.position = "absolute";
  driveArea2.style.width = "200px"; // 仮サイズ
  driveArea2.style.height = "200px";
  driveArea2.style.top = "40%";
  driveArea2.style.left = "60%";
  driveArea2.style.backgroundColor = "rgba(0,0,255,0.3)"; // 半透明の青
  driveArea2.style.cursor = "pointer";
  gameScreen2.appendChild(driveArea2);

  // ドライブエリアにオーバーレイ画像（bg2_drive.png）
  const driveOverlay = document.createElement("img");
  driveOverlay.src = "images/bg2_drive.png";
  driveOverlay.style.position = "absolute";
  driveOverlay.style.top = "0";
  driveOverlay.style.left = "0";
  driveOverlay.style.width = "100%";
  driveOverlay.style.height = "100%";
  driveArea2.appendChild(driveOverlay);

  // -------------------------------
  // パズルクリアのフラグ管理
  // -------------------------------
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;

  // タップ領域クリックでそれぞれのシルエットパズル開始
  deskArea2.addEventListener("click", (e) => {
    e.stopPropagation();
    showPuzzleModal("desk");
  });
  driveArea2.addEventListener("click", (e) => {
    e.stopPropagation();
    showPuzzleModal("drive");
  });

  // ================================
  // シルエットパズル用モーダルとパズル処理
  // ================================
  function showPuzzleModal(puzzleType) {
    // モーダルがなければ作成
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
    // クリア済みのモーダル内容をクリア
    puzzleModal.innerHTML = "";

    // パズル用コンテナ（固定サイズ例：400×400px）
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

    // パズル画像のパス設定（deskならnoa_puzzle.png、driveならroberia_puzzle.png）
    let puzzleImageSrc = "";
    if (puzzleType === "desk") {
      puzzleImageSrc = "images/noa_puzzle.png";
    } else if (puzzleType === "drive") {
      puzzleImageSrc = "images/roberia_puzzle.png";
    }

    // 4分割して各ピースを作成（2×2グリッド）
    for (let i = 0; i < 4; i++) {
      const piece = document.createElement("div");
      piece.className = "puzzle-piece";
      piece.dataset.index = i; // 正しい配置位置（0～3）
      piece.dataset.rotation = "0"; // 初期回転角度
      piece.style.width = "50%";
      piece.style.height = "50%";
      piece.style.boxSizing = "border-box";
      piece.style.border = "1px solid #ccc";
      piece.style.position = "relative";
      piece.style.backgroundImage = `url(${puzzleImageSrc})`;
      // 背景サイズを2倍にして、各ピースごとに表示する部分を調整（例：0～100%）
      piece.style.backgroundSize = "200% 200%";
      // 各ピースの背景位置（0:左上、1:右上、2:左下、3:右下）
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      piece.style.backgroundPosition = `${posX} ${posY}`;

      // ドラッグ＆ドロップのための設定
      piece.draggable = true;
      piece.addEventListener("dragstart", onDragStart);
      piece.addEventListener("dragend", onDragEnd);
      piece.addEventListener("dragover", onDragOver);
      piece.addEventListener("drop", onDrop);

      // 各ピースに回転ボタンを配置
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

    // モーダルを閉じるためのボタン
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

    // 初期配置をランダム化（単純なシャッフル）
    randomizePuzzlePieces(puzzleContainer);
  }

  // ドラッグ＆ドロップ用イベントハンドラー
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
      // ピース同士を入れ替え（シンプルなスワップ処理）
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

  // 各パズルのクリア判定：各ピースが正しい順（グリッド順）かつ回転が0°ならクリア
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
      puzzleModal.style.display = "none";
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
    // ここでエリア3のナレーション開始処理を実装してください
  }

  // ※エリア2ゲームシーンへ移行するタイミングは、既存のフローに合わせて showScene("game-screen2") 等で呼び出してください。
});