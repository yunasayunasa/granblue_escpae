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

// 1) エリア2の「scene」コンテナ
const gameScreen2 = document.createElement("div");
gameScreen2.id = "game-screen2";
gameScreen2.className = "scene";
// 全画面に配置
gameScreen2.style.position = "absolute";
gameScreen2.style.top = "0";
gameScreen2.style.left = "0";
gameScreen2.style.width = "100%";
gameScreen2.style.height = "100%";
document.body.appendChild(gameScreen2);

// 2) エリア2のコンテナ (gameContainer2)
const gameContainer2 = document.createElement("div");
gameContainer2.id = "game-container2";
// ここを relative にして、子要素を絶対配置で重ねる
gameContainer2.style.position = "relative";
gameContainer2.style.width = "100%";
gameContainer2.style.height = "100%";
gameScreen2.appendChild(gameContainer2);

/* 
   (A) 背景画像 (bg2.jpg) を <img> で配置
   (B) 透過画像 (bg2_desk.png, bg2_drive.png) も同じ座標系で重ねる
   → 3枚とも width=100%, height=auto でアスペクト比を保つ
   → 親要素のサイズに合わせて表示し、余白が出ても「全体が映る」ようにしたい場合は objectFit=contain
*/

// (A) 背景画像
const bg2 = document.createElement("img");
bg2.src = "images/bg2.jpg";
bg2.id = "background2";
bg2.style.position = "absolute";
bg2.style.top = "50%";
bg2.style.left = "50%";
bg2.style.transform = "translate(-50%, -50%)";
bg2.style.width = "100%";
bg2.style.height = "auto";
// 画像全体を表示しつつ余白が出る場合はしょうがない (contain)
bg2.style.objectFit = "contain";
bg2.style.zIndex = "0";
gameContainer2.appendChild(bg2);

// (B1) デスク透過画像
const deskOverlay = document.createElement("img");
deskOverlay.src = "images/bg2_desk.png";
deskOverlay.id = "desk-overlay";
deskOverlay.style.position = "absolute";
deskOverlay.style.top = "50%";
deskOverlay.style.left = "50%";
deskOverlay.style.transform = "translate(-50%, -50%)";
deskOverlay.style.width = "100%";
deskOverlay.style.height = "auto";
deskOverlay.style.objectFit = "contain";
deskOverlay.style.zIndex = "1"; // 背景より前
gameContainer2.appendChild(deskOverlay);

// (B2) ドライブ透過画像
const driveOverlay = document.createElement("img");
driveOverlay.src = "images/bg2_drive.png";
driveOverlay.id = "drive-overlay";
driveOverlay.style.position = "absolute";
driveOverlay.style.top = "50%";
driveOverlay.style.left = "50%";
driveOverlay.style.transform = "translate(-50%, -50%)";
driveOverlay.style.width = "100%";
driveOverlay.style.height = "auto";
driveOverlay.style.objectFit = "contain";
driveOverlay.style.zIndex = "1";
gameContainer2.appendChild(driveOverlay);

/*
   (C) タップ領域 (deskArea2, driveArea2)
   → 親要素と同じ座標系(absolute) で、前面(zIndex=2) に配置
   → 半透明色が見えるようにする
*/

// デスク領域
const deskArea2 = document.createElement("div");
deskArea2.id = "desk-area2";
deskArea2.style.position = "absolute";
// 背景画像を中央基準 (top=50%, left=50%) にするなら transform する or パーセント指定
// ここでは例として top=40%, left=30%
deskArea2.style.top = "50%";
deskArea2.style.left = "60%";
deskArea2.style.width = "30%";
deskArea2.style.height = "15%";
deskArea2.style.backgroundColor = "rgba(255,0,0,0.3)";
deskArea2.style.cursor = "pointer";
deskArea2.style.zIndex = "2";
gameContainer2.appendChild(deskArea2);

// ドライブ領域
const driveArea2 = document.createElement("div");
driveArea2.id = "drive-area2";
driveArea2.style.position = "absolute";
driveArea2.style.top = "40%";
driveArea2.style.left = "40%";
driveArea2.style.width = "15%";
driveArea2.style.height = "15%";
driveArea2.style.backgroundColor = "rgba(0,0,255,0.3)";
driveArea2.style.cursor = "pointer";
driveArea2.style.zIndex = "2";
gameContainer2.appendChild(driveArea2);

// タップイベント (シルエットクイズ)
deskArea2.addEventListener("click", () => {
  showSilhouetteQuiz("desk");
});
driveArea2.addEventListener("click", () => {
  showSilhouetteQuiz("drive");
});

// 既存のシルエットクイズ処理はこの下に続く...

  // フラグ管理（エリア2シルエットクイズ用）
  let deskQuizCleared = false;
  let driveQuizCleared = false;

  

  /* =============================
     シルエットクイズ機能（エリア2用）
     ============================= */
  function showSilhouetteQuiz(area) {
  const quizModal = document.getElementById("puzzle-modal");
  if (!quizModal) return;
  quizModal.innerHTML = "";
  quizModal.style.display = "flex";
  quizModal.style.flexDirection = "column";
  quizModal.style.justifyContent = "center";
  quizModal.style.alignItems = "center";

  // ★ ここでテキストを追加
  const questionText = document.createElement("p");
  questionText.textContent = "ここに封印されているのは誰？";
  questionText.style.marginBottom = "10px"; // 余白を少し入れる
  quizModal.appendChild(questionText);

  // ① シルエット画像の表示
  const silhouetteImg = document.createElement("img");
  silhouetteImg.style.width = "80%";
  silhouetteImg.style.height = "auto";
  if (area === "desk") {
    silhouetteImg.src = "images/noa_puzzle.png";
  } else if (area === "drive") {
    silhouetteImg.src = "images/roberia_puzzle.png";
  }
  quizModal.appendChild(silhouetteImg);

  // ② 「回答する」ボタン
  const answerButton = document.createElement("button");
  answerButton.textContent = "回答する";
  answerButton.style.marginTop = "10px";
  quizModal.appendChild(answerButton);

  answerButton.addEventListener("click", () => {
    if (!quizModal.querySelector("input")) {
      const inputField = document.createElement("input");
      inputField.type = "text";
      inputField.placeholder = "カタカナで入力";
      inputField.style.marginTop = "10px";
      quizModal.appendChild(inputField);

      const submitButton = document.createElement("button");
      submitButton.textContent = "送信";
      submitButton.style.marginTop = "10px";
      quizModal.appendChild(submitButton);

      submitButton.addEventListener("click", () => {
        const answer = inputField.value.trim();
        if (area === "desk") {
          if (answer === "ノア") {
            alert("正解！");
            deskQuizCleared = true;
            quizModal.style.display = "none";
            checkSilhouetteQuizCleared();
          } else {
            alert("不正解。再入力してください。");
          }
        } else if (area === "drive") {
          if (answer === "ロベリア") {
            alert("正解！");
            driveQuizCleared = true;
            quizModal.style.display = "none";
            checkSilhouetteQuizCleared();
          } else {
            alert("不正解。再入力してください。");
          }
        }
      });
    }
  });

  // ③ 閉じるボタン
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "閉じる";
  closeBtn.className = "close-btn";
  closeBtn.style.marginTop = "10px";
  closeBtn.addEventListener("click", () => {
    quizModal.style.display = "none";
  });
  quizModal.appendChild(closeBtn);
}

  function checkSilhouetteQuizCleared() {
    if (deskQuizCleared && driveQuizCleared) {
      alert("正解！ エリア2クリア！ エリア3のナレーションを開始します。");
      // ここでエリア3ナレーション開始処理を呼び出す
      // 例: startArea3Narration();
    }
  }

  // ----- タイトル画面のタップイベント（デバッグ用） -----
  const titleScreen = document.getElementById("title-screen");
  function handleTitleTap(e) {
    alert("タイトルタップ発生");
    showScene("narration-screen");
  }
  titleScreen.addEventListener("click", handleTitleTap);
  titleScreen.addEventListener("touchstart", handleTitleTap);
});