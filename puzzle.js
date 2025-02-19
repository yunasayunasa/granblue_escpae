document.addEventListener("DOMContentLoaded", () => {
  // ここにパズル関連のコードをすべて記述する
  // 例：グローバル変数、showPuzzleModal、checkBoardCompletion など
});

// --- パズル関連グローバル変数 ---
window.selectedContainer = null;  // 現在選択中のパネル（ピースコンテナ）
window.puzzleDeskCleared = false;   // デスクパズルクリアフラグ（必要に応じて）
window.puzzleDriveCleared = false;  // ドライブパズルクリアフラグ（必要に応じて）

// --- パズルモーダルの表示・操作 ---
window.showPuzzleModal = function(puzzleType) {
  const puzzleModal = document.getElementById("puzzle-modal");
  if (!puzzleModal) return;
  puzzleModal.innerHTML = "";
  puzzleModal.style.display = "flex";

  // パズルボード（2×2グリッド、全体 200×200px、各セル 100×100px）
  const board = document.createElement("div");
  board.id = "puzzle-board";
  puzzleModal.appendChild(board);

  for (let i = 0; i < 4; i++) {
    const cell = document.createElement("div");
    cell.className = "puzzle-cell";
    cell.dataset.cellIndex = i.toString();

    // セルタップ時：選択中のパネルを配置または交換（スワップ）
    cell.addEventListener("click", () => {
      if (window.selectedContainer) {
        if (cell.firstElementChild && cell.firstElementChild !== window.selectedContainer) {
          // 既にパネルがある場合、スワップする
          let existing = cell.firstElementChild;
          let parentOfSelected = window.selectedContainer.parentNode;
          cell.replaceChild(window.selectedContainer, existing);
          parentOfSelected.appendChild(existing);
          window.selectedContainer.classList.remove("selected");
          window.selectedContainer = null;
        } else {
          // セルが空の場合、配置する
          cell.appendChild(window.selectedContainer);
          window.selectedContainer.style.position = "relative";
          window.selectedContainer.style.left = "0";
          window.selectedContainer.style.top = "0";
          window.selectedContainer.style.width = "100%";
          window.selectedContainer.style.height = "100%";
          window.selectedContainer.classList.remove("selected");
          window.checkBoardCompletion(puzzleType);
          window.selectedContainer = null;
        }
      }
    });
    board.appendChild(cell);
  }

  // ピーストレイの作成
  const tray = document.createElement("div");
  tray.id = "puzzle-tray";
  puzzleModal.appendChild(tray);

  // パズル画像のパス（puzzleType に応じて）
  let puzzleImageSrc = (puzzleType === "desk")
    ? "images/noa_puzzle.png"
    : "images/roberia_puzzle.png";

  // 4つのパネルを生成
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

    // パネルのタップで選択状態にする
    container.addEventListener("click", (e) => {
      e.stopPropagation();
      if (window.selectedContainer && window.selectedContainer !== container) {
        window.selectedContainer.classList.remove("selected");
      }
      if (window.selectedContainer === container) {
        container.classList.remove("selected");
        window.selectedContainer = null;
      } else {
        container.classList.add("selected");
        window.selectedContainer = container;
      }
    });

    container.appendChild(silhouette);
    tray.appendChild(container);
  }

  // グローバル回転ボタン（モーダル外、固定配置）
  let globalRotateBtn = document.getElementById("global-rotate-btn");
  if (!globalRotateBtn) {
    globalRotateBtn = document.createElement("button");
    globalRotateBtn.id = "global-rotate-btn";
    globalRotateBtn.textContent = "回転";
    globalRotateBtn.addEventListener("click", () => {
      if (window.selectedContainer) {
        let currentRot = parseInt(window.selectedContainer.dataset.rotation);
        currentRot = (currentRot + 90) % 360;
        window.selectedContainer.dataset.rotation = currentRot.toString();
        window.selectedContainer.style.transform = `rotate(${currentRot}deg)`;
        window.checkBoardCompletion(puzzleType);
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
    window.selectedContainer = null;
  });
  puzzleModal.appendChild(closeBtn);
};

  
// --- 完成判定 ---  
window.checkBoardCompletion = function(puzzleType) {
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
    // 完成時、パズルボードをクリアし完成画像を表示する
    board.innerHTML = "";
    const finalImg = document.createElement("img");
    finalImg.style.width = "200px";
    finalImg.style.height = "200px";
    finalImg.src = (puzzleType === "desk") ? "images/noa.png" : "images/roberia.png";
    board.appendChild(finalImg);
    document.getElementById("puzzle-modal").style.display = "none";
    window.selectedContainer = null;
  }
};

 // フラグ管理
  let puzzleDeskCleared = false;
  let puzzleDriveCleared = false;

  deskArea2.addEventListener("click", () => {
    showPuzzleModal("desk");
  });
  driveArea2.addEventListener("click", () => {
    showPuzzleModal("drive");
  });

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


window.checkAllPuzzlesCleared = function() {
  if (window.puzzleDeskCleared && window.puzzleDriveCleared) {
    console.log("エリア2クリア!");
    alert("エリア2クリア！ エリア3へ…");
  }
};