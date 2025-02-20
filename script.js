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
        alert("鍵が開いた！\nエリア1クリア！");
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
deskArea2.style.left = "50%";
deskArea2.style.width = "35%";
deskArea2.style.height = "15%";
deskArea2.style.backgroundColor = "rgba(0,0,0,0.0)";
deskArea2.style.cursor = "pointer";
deskArea2.style.zIndex = "2";
gameContainer2.appendChild(deskArea2);

// ドライブ領域
const driveArea2 = document.createElement("div");
driveArea2.id = "drive-area2";
driveArea2.style.position = "absolute";
driveArea2.style.top = "48%";
driveArea2.style.left = "23%";
driveArea2.style.width = "10%";
driveArea2.style.height = "10%";
driveArea2.style.backgroundColor = "rgba(0,0,0,0.0)";
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
    alert("正解！ エリア2クリア！ ");
    startArea3Narration();
  }
}

// エリア3ナレーションシーンを生成する関数（checkSilhouetteQuizCleared() の外に定義）
function startArea3Narration() {
  // シーン生成
  const scene = document.createElement("div");
  scene.id = "narration-screen3";
  scene.className = "scene";
  scene.style.position = "absolute";
  scene.style.top = "0";
  scene.style.left = "0";
  scene.style.width = "100%";
  scene.style.height = "100%";
  scene.style.background = "#000"; // 背景色（後でbg3.jpgを貼る場合は下記で設定）
  // 背景画像（例: bg3.jpg）
  scene.style.backgroundImage = "url('images/bg3.jpg')";
  scene.style.backgroundSize = "contain";
  scene.style.backgroundPosition = "center";
  scene.style.backgroundRepeat = "no-repeat";
  document.body.appendChild(scene);

  // テキストフレーム (log.png) を下部に配置（例）
  const logFrame = document.createElement("img");
  logFrame.src = "images/log.png"; // 今まで使っている会話フレーム
  logFrame.style.position = "absolute";
  logFrame.style.bottom = "0";
  logFrame.style.left = "50%";
  logFrame.style.transform = "translateX(-50%)";
  logFrame.style.width = "100%"; // 画面幅に合わせる
  logFrame.style.height = "auto";
  logFrame.style.zIndex = "10";
  scene.appendChild(logFrame);

  // テキスト表示領域
  const textContainer = document.createElement("div");
  textContainer.style.position = "absolute";
  textContainer.style.bottom = "10%";
  textContainer.style.left = "50%";
  textContainer.style.transform = "translateX(-50%)";
  textContainer.style.width = "80%";
  textContainer.style.color = "#fff";
  textContainer.style.fontSize = "1.2rem";
  textContainer.style.zIndex = "11";
  textContainer.style.textAlign = "center";
  scene.appendChild(textContainer);

  // キャラ表示用コンテナ
  const characterContainer = document.createElement("div");
  characterContainer.style.position = "absolute";
  characterContainer.style.bottom = "20%"; // 今までgran.pngを配置していた高さに合わせる
  characterContainer.style.left = "0";
  characterContainer.style.width = "100%";
  characterContainer.style.height = "50%"; // 適宜調整
  characterContainer.style.zIndex = "9";
  scene.appendChild(characterContainer);

  // 現在の行インデックス
  let currentLineIndex = 0;
  // メインシナリオをコピーして扱う
  const lines = [...area3MainLines];

  // クリックで次へ進む
  scene.addEventListener("click", onClickNext);

  function onClickNext(e) {
    e.stopPropagation();
    showNextLine();
  }

  function showNextLine() {
    if (currentLineIndex >= lines.length) {
      // ここで選択肢を出す
      showChoice();
      return;
    }
    const line = lines[currentLineIndex];
    currentLineIndex++;

    // キャラ表示を更新
    updateCharacters(line.characters);
    // テキストを更新
    textContainer.innerHTML = `<p>${line.text}</p>`;
  }

  // キャラクター表示更新
  function updateCharacters(charDefs) {
    // まずコンテナ内をクリア
    characterContainer.innerHTML = "";
    if (!charDefs || charDefs.length === 0) {
      // キャラなしの背景のみ
      return;
    }

    if (charDefs.length === 1) {
      // 1人 → 中央表示
      const c = createCharacterElement(charDefs[0]);
      c.style.position = "absolute";
      c.style.left = "50%";
      c.style.transform = "translateX(-50%)";
      characterContainer.appendChild(c);
    } else if (charDefs.length === 2) {
      // 2人 → 左右に表示
      const c1 = createCharacterElement(charDefs[0]);
      const c2 = createCharacterElement(charDefs[1]);
      c1.style.position = "absolute";
      c1.style.left = "15%";
      c2.style.position = "absolute";
      c2.style.right = "15%";
      characterContainer.appendChild(c1);
      characterContainer.appendChild(c2);
    }
    // 3人以上は今回ない想定
  }

  // キャラクター要素を作る
  function createCharacterElement(charDef) {
    const img = document.createElement("img");
    // 画像ファイル名を name に合わせる（例: "ロベリア" → "roberia.png" など）
    // ただし今回はユーザーがシナリオで name に "ロベリアネガ" と書いているので
    // そのまま "roberia_negative.png" に対応するマッピングが必要。
    // ここでは簡単のため、 name をファイル名にしている想定にします:
    const fileMap = {
      "グラン": "gran.png",
      "ロベリア": "roberia.png",
      "ノア": "noa.png",
      "ロベリアネガ": "roberia_negative.png",
      "ノアネガ": "noa_negative.png"
    };
    const fileName = fileMap[charDef.name] || "gran.png";
    img.src = `images/${fileName}`;
    img.style.maxWidth = "40%";
    img.style.bottom = "0";

    // 役割(話者 or 非話者) → brightness 切り替え
    if (charDef.role === "話者") {
      img.style.filter = "brightness(1)";
    } else {
      img.style.filter = "brightness(0.5)";
    }

    // アニメーション指定
    if (charDef.anim === "jump") {
      // CSS 側に .jump { animation: jump 0.5s; } など用意しておき、classList.add("jump") する
      img.classList.add("jump");
    } else if (charDef.anim === "shake") {
      img.classList.add("shake");
    } else if (charDef.anim === "fadeout") {
      img.classList.add("fadeout");
    }
    // など、アニメーションに応じてクラスを付与

    return img;
  }

  // 選択肢を出す
  function showChoice() {
    scene.removeEventListener("click", onClickNext);

    // テキストを表示
    textContainer.innerHTML = `<p>君はどちらと戦う？</p>`;

    // 半透明モーダルを作成
    const choiceModal = document.createElement("div");
    choiceModal.style.position = "absolute";
    choiceModal.style.top = "0";
    choiceModal.style.left = "0";
    choiceModal.style.width = "100%";
    choiceModal.style.height = "100%";
    choiceModal.style.backgroundColor = "rgba(0,0,0,0.5)";
    choiceModal.style.zIndex = "999";
    scene.appendChild(choiceModal);

    // 中央にボタンを配置
    const choiceContainer = document.createElement("div");
    choiceContainer.style.position = "absolute";
    choiceContainer.style.top = "50%";
    choiceContainer.style.left = "50%";
    choiceContainer.style.transform = "translate(-50%, -50%)";
    choiceContainer.style.display = "flex";
    choiceContainer.style.flexDirection = "column";
    choiceContainer.style.gap = "20px";
    choiceModal.appendChild(choiceContainer);

    // ボタンA
    const btnA = document.createElement("button");
    btnA.textContent = "ロベリアネガと戦う(クイズ)";
    choiceContainer.appendChild(btnA);
    btnA.addEventListener("click", () => {
      scene.removeEventListener("click", onClickNext);
      choiceModal.remove();
      // 分岐ナレーションを表示して、ゲームへ
      showBranchLines(linesAfterChoiceA, () => {
        // ここでゲーム実装 or すぐエンディングへ
        showEndingLines();
      });
    });

    // ボタンB
    const btnB = document.createElement("button");
    btnB.textContent = "ノアネガと戦う(謎解き)";
    choiceContainer.appendChild(btnB);
    btnB.addEventListener("click", () => {
      scene.removeEventListener("click", onClickNext);
      choiceModal.remove();
      // 分岐ナレーションを表示して、ゲームへ
      showBranchLines(linesAfterChoiceB, () => {
        // ここでゲーム実装 or すぐエンディングへ
        showEndingLines();
      });
    });
  }

  // 分岐ナレーションを順番に表示
  function showBranchLines(branchLines, onFinish) {
    let idx = 0;
    const branchClickHandler = () => {
      if (idx >= branchLines.length) {
        scene.removeEventListener("click", branchClickHandler);
        if (onFinish) onFinish();
        return;
      }
      const line = branchLines[idx++];
      updateCharacters(line.characters);
      textContainer.innerHTML = `<p>${line.text}</p>`;
    };
    scene.addEventListener("click", branchClickHandler);
    branchClickHandler(); // 最初の呼び出し
  }

  // エンディングナレーションを表示
  function showEndingLines() {
    let idx = 0;
    const endClickHandler = () => {
      if (idx >= endingLines.length) {
        scene.removeEventListener("click", endClickHandler);
        // 最後にエンディング画像を表示する
        showEndingImage();
        return;
      }
      const line = endingLines[idx++];
      updateCharacters(line.characters);
      textContainer.innerHTML = `<p>${line.text}</p>`;
    };
    scene.addEventListener("click", endClickHandler);
    endClickHandler();
  }

  // エンディング画像(THANK YOU FOR PLAYING)を表示
  function showEndingImage() {
    // 画面をクリアしてエンディング画面に遷移
    scene.innerHTML = "";
    // 背景画像を切り替える or 新規要素で表示
    scene.style.backgroundImage = "url('images/title.jpg')"; 
    scene.style.backgroundSize = "contain";
    scene.style.backgroundPosition = "center";
    scene.style.backgroundRepeat = "no-repeat";

    // テキストを表示（左側 or 中央寄せなど）
    const endText = document.createElement("div");
    endText.style.position = "absolute";
    endText.style.top = "50%";
    endText.style.left = "50%";
    endText.style.transform = "translate(-50%, -50%)";
    endText.style.color = "#fff";
    endText.style.fontSize = "2rem";
    endText.style.textAlign = "center";
    endText.innerHTML = "THANK YOU FOR PLAYING!";
    scene.appendChild(endText);
  }

  // 最初の行を表示
  showNextLine();
}


// ==============================
// データ構造
// ==============================

// area3MainLines: エリア3の導入ナレーション
// 各要素は { characters: [...], text: "..." } の形
// characters は [ { name: "ロベリア", role: "話者", anim: "1回ぴょんと跳ねる" }, ... ]
// text は 「」内のセリフ部分
const area3MainLines = [
  {
    characters: [
      { name: "ロベリア", role: "話者", anim: "jump" },
      { name: "ノア", role: "非話者", anim: "" }
    ],
    text: "くっは！助かったよ、団長さん。メルシィ！"
  },
  {
    characters: [
      { name: "ロベリア", role: "非話者", anim: "" },
      { name: "ノア", role: "話者", anim: "" }
    ],
    text: "信じていたよ。団長さんが必ず助けてくれるってね。"
  },
  {
    characters: [
      { name: "グラン", role: "話者", anim: "" }
    ],
    text: "君は助け出した2人から話を聞くことにした。"
  },
  {
    characters: [],
    text: "どうやら何者かにあの場所に封印されていたらしい。"
  },
  {
    characters: [],
    text: "そんなことができるのは、星晶獣しかありえない。"
  },
  {
    characters: [],
    text: "その時、甲板に２つの影が降り立った。"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" },
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "..."
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "非話者", anim: "" },
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "まさかあの封印を解かれるなんてね...意外...かな"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" },
      { name: "ノアネガ", role: "非話者", anim: "" }
    ],
    text: "くはっ！頭を捻らせる時の苦悶の声...最高だっ！"
  },
  {
    characters: [],
    text: "ロベリアとノアによく似た雰囲気の、だが絶対に違う確信が持てる何者かが現れた。"
  },
  {
    characters: [],
    text: "君は問う、お前達は何者だ。"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" }
    ],
    text: "答えよう、クイズの星晶獣、ロベリアネガ。"
  },
  {
    characters: [
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "謎解きの星晶獣、ノアネガ。"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" },
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "君達にはもう一度謎解きパズルの一部になってもらう。"
  },
  {
    characters: [
      { name: "ノア", role: "話者", anim: "" }
    ],
    text: "団長さん！来るよ！僕とロベリアで片方はなんとかする！"
  },
  {
    characters: [
      { name: "ロベリア", role: "話者", anim: "" }
    ],
    text: "くっは！謎を壊すとどんな音がするんだろうね！アンテレサーント！"
  },
  {
    characters: [
      { name: "グラン", role: "話者", anim: "" }
    ],
    text: "君はどちらと戦う？"  // ← ここで選択肢を出す
  }
];

// 選択肢Aを選んだ場合の分岐ナレーション
const linesAfterChoiceA = [
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" }
    ],
    text: "クイズで勝負だ！"
  },
  // ゲーム開始（後ほど実装）→ エンディングへ
];

// 選択肢Bを選んだ場合の分岐ナレーション
const linesAfterChoiceB = [
  {
    characters: [
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "僕は謎解きの星晶獣...謎解きで勝負！"
  },
  // ゲーム開始（後ほど実装）→ エンディングへ
];

// エンディングナレーション
const endingLines = [
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "shake" },
      { name: "ノアネガ", role: "話者", anim: "shake" }
    ],
    text: "ぐっ！そんな、まさか...！"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" },
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "もう少しで...！あと少しで...！"
  },
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "fadeout" },
      { name: "ノアネガ", role: "話者", anim: "fadeout" }
    ],
    text: "馬鹿なああああああああ！"
  },
  {
    characters: [
      { name: "ロベリア", role: "非話者", anim: "" },
      { name: "ノア", role: "話者", anim: "jump" }
    ],
    text: "やった！団長さんも大丈夫かな？"
  },
  {
    characters: [
      { name: "ロベリア", role: "話者", anim: "" },
      { name: "ノア", role: "非話者", anim: "" }
    ],
    text: "くっは！なかなか楽しかったよ、さぁ行こうか！次なる謎を探しに！"
  },
  {
    characters: [
      { name: "グラン", role: "話者", anim: "" }
    ],
    text: "君は無事事件を解決し、船を取り戻した。"
  },
  {
    characters: [],
    text: "この広い空にはまだまだ謎が隠されている。"
  },
  {
    characters: [],
    text: "行こう、全ての謎を解き、遥かなる地平線"
  },
  {
    characters: [],
    text: "ナゾタルシアへ━"
  },
  {
    characters: [],
    text: "グランブルーエスケープ〜完〜"
  }
];