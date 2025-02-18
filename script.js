document.addEventListener("DOMContentLoaded", () => {
  const puzzleModal = document.getElementById("puzzle-modal");

  // 選択中のピースコンテナ
  let selectedContainer = null;

  /**
   * パズルモーダルを表示
   * puzzleType: "desk" or "drive" 等
   */
  function showPuzzleModal(puzzleType) {
    puzzleModal.innerHTML = "";
    puzzleModal.style.display = "flex";

    // --- パズルボード (200×200, 2×2) ---
    const board = document.createElement("div");
    board.id = "puzzle-board";
    puzzleModal.appendChild(board);

    // 4つのセル
    for (let i = 0; i < 4; i++) {
      const cell = document.createElement("div");
      cell.className = "puzzle-cell";
      cell.dataset.cellIndex = String(i);

      // セルをタップ → 選択中のピースがあれば配置
      cell.addEventListener("click", () => {
        if (selectedContainer) {
          // セルに移動
          cell.appendChild(selectedContainer);
          // セルに合わせて大きさ100%
          selectedContainer.style.position = "relative";
          selectedContainer.style.left = "0";
          selectedContainer.style.top = "0";
          selectedContainer.style.width = "100%";
          selectedContainer.style.height = "100%";
          selectedContainer.classList.remove("selected");
          checkBoardCompletion(puzzleType);
          selectedContainer = null;
        }
      });

      board.appendChild(cell);
    }

    // --- ピーストレイ (下部) ---
    const tray = document.createElement("div");
    tray.id = "puzzle-tray";
    puzzleModal.appendChild(tray);

    // ピース画像パス
    const puzzleImageSrc = (puzzleType === "desk")
      ? "images/noa_puzzle.png"
      : "images/roberia_puzzle.png";

    // 4つのピースを生成
    for (let i = 0; i < 4; i++) {
      const container = document.createElement("div");
      container.className = "piece-container";
      container.dataset.correctIndex = String(i);
      container.dataset.rotation = "0"; // 初期回転 0°

      // シルエット画像
      const silhouette = document.createElement("div");
      silhouette.className = "puzzle-silhouette";
      silhouette.style.backgroundImage = `url(${puzzleImageSrc})`;
      // i=0→左上, i=1→右上, i=2→左下, i=3→右下
      let posX = (i % 2 === 0) ? "0%" : "100%";
      let posY = (i < 2) ? "0%" : "100%";
      silhouette.style.backgroundPosition = `${posX} ${posY}`;

      // 回転ボタン
      const rotateBtn = document.createElement("button");
      rotateBtn.textContent = "回転";
      rotateBtn.className = "rotate-btn";
      rotateBtn.addEventListener("click", (e) => {
        // 親コンテナを回転させる → ボタンも一緒に回る
        e.stopPropagation(); // タップ選択のイベントを止める
        e.preventDefault();
        let currentRot = parseInt(container.dataset.rotation);
        currentRot = (currentRot + 90) % 360;
        container.dataset.rotation = String(currentRot);
        // container全体を回転
        container.style.transform = `rotate(${currentRot}deg)`;
        checkBoardCompletion(puzzleType);
      });

      // ピースコンテナをタップ → 選択/解除
      container.addEventListener("click", (e) => {
        e.stopPropagation();
        // すでに他のピースが選択されていれば解除
        if (selectedContainer && selectedContainer !== container) {
          selectedContainer.classList.remove("selected");
        }
        if (selectedContainer === container) {
          // 同じピースを2回タップ → 選択解除
          container.classList.remove("selected");
          selectedContainer = null;
        } else {
          // 新規選択
          container.classList.add("selected");
          selectedContainer = container;
        }
      });

      container.appendChild(silhouette);
      container.appendChild(rotateBtn);
      tray.appendChild(container);
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

  /**
   * 完成判定
   */
  function checkBoardCompletion(puzzleType) {
    const board = document.getElementById("puzzle-board");
    if (!board) return;

    let isComplete = true;
    const cells = board.querySelectorAll(".puzzle-cell");
    cells.forEach(cell => {
      if (!cell.firstElementChild) {
        // ピースコンテナが入っていない
        isComplete = false;
      } else {
        const container = cell.firstElementChild;
        const correctIdx = container.dataset.correctIndex;
        const rot = parseInt(container.dataset.rotation);
        // 回転は 0°、セルの index が合致で正解
        if (correctIdx !== cell.dataset.cellIndex || rot !== 0) {
          isComplete = false;
        }
      }
    });

    if (isComplete) {
      alert(`${puzzleType}パズルクリア！`);
      puzzleModal.style.display = "none";
      selectedContainer = null;
      // ここでフラグを立てたり、エリア2クリア処理を行う
    }
  }

  // 例：実際はエリア2のタップ領域などで showPuzzleModal("desk") を呼び出す
  // showPuzzleModal("desk");
});