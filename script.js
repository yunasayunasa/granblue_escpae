document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

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

  // タイトル画面を表示
  showScene("title-screen");

  // タイトル画面のクリックイベント登録
  const titleScreen = document.getElementById("title-screen");
  titleScreen.addEventListener("click", () => {
    alert("タイトルタップ発生");
    showScene("narration-screen");
  });
});

  /* =============================
     パズルモーダル (タップ式)
     ============================= 
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
      alert("エリア2クリア！ エリア3へ…");*/
    }
  }
});