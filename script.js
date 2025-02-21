document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js 読み込みテスト");

  /* =============================
     シーン管理
  ============================= */
  function showScene(sceneId) {
    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(scene => {
      scene.style.display = "none";
    });
    const target = document.getElementById(sceneId);
    if (target) {
      target.style.display = "block";
    } else {
      console.error(`Scene with ID "${sceneId}" が見つかりません`);
    }
  }

  // タイトル画面を最初に表示
  showScene("title-screen");

  // タイトル画面をタップ → ナレーションシーン(エリア1)へ
  const titleScreen = document.getElementById("title-screen");
  titleScreen.addEventListener("click", () => {
    showScene("narration-screen");
  });

  /* =============================
     ナレーション管理(エリア1 / エリア2)
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

  // 「部屋から出る」ボタン
  exitButton.addEventListener("click", () => {
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });
  exitModal.addEventListener("click", (e) => {
    if (e.target === exitModal) {
      exitModal.style.display = "none";
    }
  });

  // 4桁入力の判定
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
  const gameScreen2 = document.createElement("div");
  gameScreen2.id = "game-screen2";
  gameScreen2.className = "scene";
  gameScreen2.style.position = "absolute";
  gameScreen2.style.top = "0";
  gameScreen2.style.left = "0";
  gameScreen2.style.width = "100%";
  gameScreen2.style.height = "100%";
  document.body.appendChild(gameScreen2);

  const gameContainer2 = document.createElement("div");
  gameContainer2.id = "game-container2";
  gameContainer2.style.position = "relative";
  gameContainer2.style.width = "100%";
  gameContainer2.style.height = "100%";
  gameScreen2.appendChild(gameContainer2);

  // 背景画像
  const bg2 = document.createElement("img");
  bg2.src = "images/bg2.jpg";
  bg2.id = "background2";
  bg2.style.position = "absolute";
  bg2.style.top = "50%";
  bg2.style.left = "50%";
  bg2.style.transform = "translate(-50%, -50%)";
  bg2.style.width = "100%";
  bg2.style.height = "auto";
  bg2.style.objectFit = "contain";
  bg2.style.zIndex = "0";
  gameContainer2.appendChild(bg2);

  // デスク透過画像
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
  deskOverlay.style.zIndex = "1";
  gameContainer2.appendChild(deskOverlay);

  // ドライブ透過画像
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

//オーバーレイ光るかテスト
/*element.classList.add("glow");
deskOverlay.classList.add("glow");
driveOverlay.classList.add("glow");*/

  // タップ領域
  const deskArea2 = document.createElement("div");
  deskArea2.id = "desk-area2";
  deskArea2.style.position = "absolute";
  deskArea2.style.top = "50%";
  deskArea2.style.left = "50%";
  deskArea2.style.width = "35%";
  deskArea2.style.height = "15%";
  deskArea2.style.backgroundColor = "rgba(0,0,0,0.0)";
  deskArea2.style.cursor = "pointer";
  deskArea2.style.zIndex = "2";
  gameContainer2.appendChild(deskArea2);

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

  // クリックイベント
  deskArea2.addEventListener("click", () => {
    showSilhouetteQuiz("desk");
  });
  driveArea2.addEventListener("click", () => {
    showSilhouetteQuiz("drive");
  });

  // エリア2クイズクリアフラグ
  let deskQuizCleared = false;
  let driveQuizCleared = false;

  // シルエットクイズ機能
  function showSilhouetteQuiz(area) {
    const quizModal = document.getElementById("puzzle-modal");
    if (!quizModal) return;
    quizModal.innerHTML = "";
    quizModal.style.display = "flex";
    quizModal.style.flexDirection = "column";
    quizModal.style.justifyContent = "center";
    quizModal.style.alignItems = "center";

    const questionText = document.createElement("p");
    questionText.textContent = "ここに封印されているのは誰？";
    questionText.style.marginBottom = "10px";
    quizModal.appendChild(questionText);

    const silhouetteImg = document.createElement("img");
    silhouetteImg.style.width = "80%";
    silhouetteImg.style.height = "auto";
    if (area === "desk") {
      silhouetteImg.src = "images/noa_puzzle.png";
    } else {
      silhouetteImg.src = "images/roberia_puzzle.png";
    }
    quizModal.appendChild(silhouetteImg);

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
              alert("封印が解けた！");
              deskQuizCleared = true;
              quizModal.style.display = "none";
              checkSilhouetteQuizCleared();
            } else {
              alert("解けない、間違っている様だ。");
            }
          } else {
            if (answer === "ロベリア") {
              alert("封印が解けた！");
              driveQuizCleared = true;
              quizModal.style.display = "none";
              checkSilhouetteQuizCleared();
            } else {
              alert("封印が解けない、間違っている様だ。");
            }
          }
        });
      }
    });

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

  // ==============================
  // エリア3ナレーション
  // ==============================
  // (省略していたが、ここに area3MainLines, linesAfterChoiceA, linesAfterChoiceB, endingLines を定義)

  // area3MainLines, linesAfterChoiceA, linesAfterChoiceB, endingLines はすでにコードに含まれている

function startArea3Narration() {
 //テスト用クリック二重処理を防ぐ
let lastInteractionTime = 0;

function onUserInteraction(e) {
  // タッチ操作の場合、デフォルトの動作をキャンセル
  e.preventDefault();
  const now = Date.now();
  // 直前の実行から500ミリ秒以内なら処理しない（値は調整可能）
  if (now - lastInteractionTime < 500) return;
  lastInteractionTime = now;
  showNextLine();
}
  //ここまでがテスト範囲
  
   // エリア2の透過画像を非表示にする
  const deskOverlay = document.getElementById("desk-overlay");
  if (deskOverlay) {
    deskOverlay.style.display = "none";
  }
  const driveOverlay = document.getElementById("drive-overlay");
  if (driveOverlay) {
    driveOverlay.style.display = "none";
  }
  const deskArea2 = document.getElementById("desk-area2");
if (deskArea2) {
  deskArea2.style.pointerEvents = "none";
}

const driveArea2 = document.getElementById("drive-area2");
if (driveArea2) {
  driveArea2.style.pointerEvents = "none";
}
  // 以下、既存のエリア3ナレーションシーンの生成処理
  /*const scene = document.createElement("div");
  scene.id = "narration-screen3";
  scene.className = "scene";
  scene.style.position = "absolute";
  scene.style.top = "0";
  scene.style.left = "0";
  scene.style.width = "100%";
  scene.style.height = "100%";
  scene.style.backgroundImage = "url('images/bg3.jpg')";
  scene.style.backgroundSize = "contain";
  scene.style.backgroundPosition = "center";
  scene.style.backgroundRepeat = "no-repeat";
  // display を "block" に設定して見えるように
  scene.style.display = "block";
  document.body.appendChild(scene);*/

  // 以降、テキストフレーム、キャラクターコンテナなどの処理…
  // ...
  
    // シーン生成
      const scene = document.createElement("div");
  scene.id = "narration-screen3";
  scene.className = "scene";
  scene.style.display = "block"; // ← これを追加
  // ...以降、シーンのスタイル設定
    scene.style.position = "absolute";
    scene.style.top = "0";
    scene.style.left = "0";
    scene.style.width = "100%";
    scene.style.height = "100%";
    scene.style.backgroundImage = "url('images/bg3.jpg')";
    scene.style.backgroundSize = "contain";
    scene.style.backgroundPosition = "center";
    scene.style.backgroundRepeat = "no-repeat";
    document.body.appendChild(scene);

    const logFrame = document.createElement("img");
    logFrame.src = "images/log.png";
    logFrame.style.position = "absolute";
    logFrame.style.bottom = "-30%";
    logFrame.style.left = "50%";
    logFrame.style.transform = "translateX(-50%)";
    logFrame.style.width = "100%";
    logFrame.style.height = "auto";
    logFrame.style.zIndex = "10";
    scene.appendChild(logFrame);

    const textContainer = document.createElement("div");
    textContainer.id = "narration-text3";
    textContainer.style.position = "absolute";
    textContainer.style.top = "70%";
    textContainer.style.left = "50%";
    textContainer.style.transform = "translateX(-50%)";
    textContainer.style.width = "80%";
    textContainer.style.color = "#fff";
    textContainer.style.fontSize = "1.2rem";
    textContainer.style.textAlign = "center";
    textContainer.style.zIndex = "11";
    scene.appendChild(textContainer);

    const characterContainer = document.createElement("div");
    characterContainer.id = "character-container";
    characterContainer.style.position = "absolute";
    characterContainer.style.bottom = "30%";
    characterContainer.style.left = "0";
    characterContainer.style.width = "100%";
    characterContainer.style.height = "50%";
    characterContainer.style.zIndex = "9";
    scene.appendChild(characterContainer);

    let currentLineIndex = 0;
    const lines = area3MainLines.slice();

    scene.addEventListener("click", onClickNext);
    function onClickNext(e) {
      e.stopPropagation();
      showNextLine();
    }

    function showNextLine() {
      if (currentLineIndex >= lines.length) {
        scene.removeEventListener("click", onClickNext);
        showChoice();
        return;
      }
      const line = lines[currentLineIndex++];
      console.log("テストテキスト",line.text);  

      updateCharacters(line.characters);
      textContainer.innerHTML = `<p>${line.text}</p>`;
    }

    function updateCharacters(charDefs) {
      characterContainer.innerHTML = "";
      if (!charDefs || charDefs.length === 0) return;
      if (charDefs.length === 1) {
        const c = createCharacterElement(charDefs[0]);
        c.style.position = "absolute";
        c.style.left = "50%";
        c.style.transform = "translateX(-50%)";
        characterContainer.appendChild(c);
      } else if (charDefs.length === 2) {
        const c1 = createCharacterElement(charDefs[0]);
        const c2 = createCharacterElement(charDefs[1]);
        c1.style.position = "absolute";
        c1.style.left = "35%";
        c2.style.position = "absolute";
        c2.style.right = "35%";
        characterContainer.appendChild(c1);
        characterContainer.appendChild(c2);
      }
    }

    function createCharacterElement(charDef) {
      const img = document.createElement("img");
      const fileMap = {
        "グラン": "gran2.png",
        "ロベリア": "roberia.png",
        "ノア": "noa.png",
        "ロベリアネガ": "roberia_negative.png",
        "ノアネガ": "noa_negative.png"
      };
      const fileName = fileMap[charDef.name] || "gran.png";
      img.src = `images/${fileName}`;
      
      //ここで各キャラのサイズを設定
if (charDef.name === "グラン") {
  // 例えば、グランは少し大きめに表示
  img.style.maxWidth = "80%";
} else if (charDef.name === "ロベリア") {
  img.style.maxWidth = "80%";
} else if (charDef.name === "ノア") {
  img.style.maxWidth ="80%";
} else if (charDef.name === "ロベリアネガ" || charDef.name === "ノアネガ") {
  // 敵キャラの場合、ここで設定
  img.style.maxWidth = "80%";
} else {
  img.style.maxWidth = "15%";
}

 // グランだけ位置が高すぎる場合、追加で下にずらす
  if (charDef.name === "グラン") {
    // 例：translateY で下に20pxずらす（調整値はお好みで）
    // すでに左右中央に配置している場合は transform に追記します
    img.style.transform = "translate(-50%, 30px)";
  }


      

      if (charDef.role === "話者") {
        img.style.filter = "brightness(1)";
      } else {
        img.style.filter = "brightness(0.5)";
      }
      if (charDef.anim === "jump") {
        img.classList.add("jump");
      } else if (charDef.anim === "shake") {
        img.classList.add("shake");
      } else if (charDef.anim === "fadeout") {
        img.classList.add("fadeout");
      }
      return img;
    }

    function showChoice() {
      scene.removeEventListener("click", onClickNext);
      textContainer.innerHTML = `<p>君はどちらと戦う？</p>`;
      const choiceModal = document.createElement("div");
      choiceModal.id = "choice-modal";
      choiceModal.style.position = "absolute";
      choiceModal.style.top = "0";
      choiceModal.style.left = "0";
      choiceModal.style.width = "50%";
      choiceModal.style.height = "100%";
      choiceModal.style.backgroundColor = "rgba(0,0,0,0.5)";
      choiceModal.style.zIndex = "999";
      scene.appendChild(choiceModal);

      const choiceContainer = document.createElement("div");
      choiceContainer.id = "choice-container";
      choiceContainer.style.position = "absolute";
      choiceContainer.style.top = "50%";
      choiceContainer.style.left = "50%";
      choiceContainer.style.transform = "translate(-50%, -50%)";
      choiceContainer.style.display = "flex";
      choiceContainer.style.flexDirection = "column";
      choiceContainer.style.gap = "20px";
      choiceModal.appendChild(choiceContainer);

      const btnA = document.createElement("button");
      btnA.textContent = "ロベリアネガと戦う(クイズ)";
      choiceContainer.appendChild(btnA);
      btnA.addEventListener("click", () => {
        scene.removeEventListener("click", onClickNext);
        choiceModal.remove();
        showBranchLines(linesAfterChoiceA, () => {
          startArea3Game("A");
        });
      });

      const btnB = document.createElement("button");
      btnB.textContent = "ノアネガと戦う(謎解き)";
      choiceContainer.appendChild(btnB);
      btnB.addEventListener("click", () => {
        scene.removeEventListener("click", onClickNext);
        choiceModal.remove();
        showBranchLines(linesAfterChoiceB, () => {
          startArea3Game("B");
        });
      });
    }

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
      branchClickHandler();
    }

    function showEndingLines() {
      let idx = 0;
      const endClickHandler = () => {
        if (idx >= endingLines.length) {
          scene.removeEventListener("click", endClickHandler);
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

    function showEndingImage() {
      scene.innerHTML = "";
      scene.style.backgroundImage = "url('images/title.jpg')";
      scene.style.backgroundSize = "contain";
      scene.style.backgroundPosition = "center";
      scene.style.backgroundRepeat = "no-repeat";
      const endText = document.createElement("div");
      endText.className = "end-text";
      endText.style.position = "absolute";
      endText.style.top = "50%";
      endText.style.left = "50%";
      endText.style.transform = "translate(-50%, -50%)";
      endText.style.color = "#000";
      endText.style.fontSize = "2rem";
      endText.style.textAlign = "center";
      endText.innerHTML = "Thank You for PLAYING!";
      scene.appendChild(endText);
    }

    //===============================
// 第3エリアゲーム部分の統合コード
//===============================
function startArea3Game(choice) {
  // 黒の半透明モーダル（ゲーム部分用）を作成
  const gameModal = document.createElement("div");
  gameModal.id = "area3-game-modal";
  gameModal.style.position = "fixed";
  gameModal.style.top = "0";
  gameModal.style.left = "0";
  gameModal.style.width = "100%";
  gameModal.style.height = "100%";
  gameModal.style.backgroundColor = "rgba(0,0,0,0.8)";
  gameModal.style.zIndex = "4000";
  gameModal.style.display = "flex";
  gameModal.style.flexDirection = "column";
  gameModal.style.justifyContent = "center";
  gameModal.style.alignItems = "center";
  document.body.appendChild(gameModal);

  if (choice === "A") {
    startQuizGame(gameModal);
  } else if (choice === "B") {
    startRiddleGame(gameModal);
  }
}

// ----- クイズゲーム（ロベリアネガ戦） -----
function startQuizGame(modal) {
  const quizQuestions = [
    {
      question: "オレの名前は？",
      options: ["ロベリア", "ロペリアネガ", "ロベリアネガ", "バレンタインロベリア"],
      correct: 2
    },
    {
      question: "部屋の鍵の番号は？",
      options: ["4593", "9354", "5493", "9435"],
      correct: 0
    },
    {
      question: "グッドエンドを見る為には誰からチョコを貰えばいい？",
      options: ["アンスリア", "ニーア", "クラリス", "ディアンサ"],
      correct: 1
    },
    {
      question: "十天衆について間違っているのはどれ？",
      options: [
        "150になると奥義が極大になる",
        "150になると4アビが再使用可能になる",
        "150になるとリミサポが増える",
        "150になるとアビリティが1T短縮される"
      ],
      correct: 3
    },
    {
      question: "このゲームの作者は？",
      options: ["ゆなまよ", "ゆなさ", "ゆなゆな", "ゆなんさ"],
      correct: 1
    }
  ];
  let currentQuizIndex = 0;

  function showQuizQuestion() {
    modal.innerHTML = ""; // 前の内容をクリア
    if (currentQuizIndex >= quizQuestions.length) {
      alert("全問正解！ エリア3クリア！");
      document.body.removeChild(modal);
      showEndingLines(); // エンディングナレーションへ遷移
      return;
    }
    const currentQuestion = quizQuestions[currentQuizIndex];

    const questionText = document.createElement("p");
    questionText.textContent = currentQuestion.question;
    questionText.style.color = "#fff";
    questionText.style.fontSize = "1.5rem";
    questionText.style.marginBottom = "20px";
    modal.appendChild(questionText);

    // 選択肢ボタンの生成
    currentQuestion.options.forEach((option, index) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.style.margin = "10px";
      btn.style.padding = "10px 20px";
      btn.style.fontSize = "1rem";
      btn.addEventListener("click", () => {
        if (index === currentQuestion.correct) {
          alert("正解！");
          currentQuizIndex++;
          showQuizQuestion();
        } else {
          alert("間違いだ！もう一度選びたまえ！");
        }
      });
      modal.appendChild(btn);
    });
  }
  showQuizQuestion();
}

// ----- 謎解きゲーム（ノアネガ戦） -----
function startRiddleGame(modal) {
  const riddleQuestions = [
    {
      type: "text",
      question: "以下の言葉を正しく並べ替えよ： またごきや",
      answer: "たまごやき"
    },
    {
      type: "image",
      question: "今の画像から増えた(消えた)物は？",
      imageStart: "images/ten.jpg",
      imageEnd: "images/ten_alt.jpg",
      transitionTime: 10000, // 10秒
      answer: "ゴリラ"
    },
    {
      type: "text",
      question: "数字パズル: １＋４＝５　２＋５＝１２　３＋６＝２１　８＋１１＝□　答えは？",
      answer: "96"
    }
  ];
  let currentRiddleIndex = 0;

  function showRiddleQuestion() {
    modal.innerHTML = "";
    if (currentRiddleIndex >= riddleQuestions.length) {
      alert("全問正解！ エリア3ゲームクリア！");
      document.body.removeChild(modal);
      showEndingLines();
      return;
    }
    const currentRiddle = riddleQuestions[currentRiddleIndex];

    const questionText = document.createElement("p");
    questionText.style.color = "#fff";
    questionText.style.fontSize = "1.5rem";
    questionText.style.marginBottom = "20px";
    modal.appendChild(questionText);

    if (currentRiddle.type === "text") {
      questionText.textContent = currentRiddle.question;
      createRiddleAnswerInput();
    } else if (currentRiddle.type === "image") {
  // 画像切替用コンテナを作成
  const imgContainer = document.createElement("div");
  imgContainer.style.position = "relative";
  imgContainer.style.width = "80%";  // 必要に応じて調整
  imgContainer.style.height = "auto";
  modal.appendChild(imgContainer);

  // スタート画像の生成
  const startImg = document.createElement("img");
  startImg.src = currentRiddle.imageStart;
  startImg.style.position = "absolute";
  startImg.style.top = "0";
  startImg.style.left = "0";
  startImg.style.width = "100%";
  startImg.style.height = "auto";
  startImg.style.objectFit = "contain";
  startImg.style.zIndex = "1";
  imgContainer.appendChild(startImg);

  // エンド画像の生成（初期は透明）
  const endImg = document.createElement("img");
  endImg.src = currentRiddle.imageEnd;
  endImg.style.position = "absolute";
  endImg.style.top = "0";
  endImg.style.left = "0";
  endImg.style.width = "100%";
  endImg.style.height = "auto";
  endImg.style.objectFit = "contain";
  endImg.style.zIndex = "2";
  endImg.style.opacity = "0";
  // opacity を transitionTime ミリ秒かけて線形で変化
  endImg.style.transition = "opacity " + currentRiddle.transitionTime + "ms linear";
  imgContainer.appendChild(endImg);

  // 関数：画像切替（フェードイン）を開始する
  function startTransition() {
    // まず endImg を初期状態に戻す
    endImg.style.transition = "none";
    endImg.style.opacity = "0";
    // 強制再描画（reflow）
    void endImg.offsetWidth;
    // transition を再設定してフェードイン開始
    endImg.style.transition = "opacity " + currentRiddle.transitionTime + "ms linear";
    setTimeout(() => {
      endImg.style.opacity = "1";
    }, 0);
  }

  // 初回実行
  startTransition();

  // transitionTime + 500ms 後に、問題文と解答欄、および「もう一度見る」ボタンを表示
  setTimeout(() => {
    // ここで画像切替用コンテナはそのまま残しておく（リプレイ可能にする）
    questionText.textContent = currentRiddle.question;
    createRiddleAnswerInput();

    // 「もう一度見る」ボタンを作成
    const replayButton = document.createElement("button");
    replayButton.textContent = "もう一度見る";
    replayButton.style.marginTop = "10px";
    // replayButton を modal 内の適切な場所に追加（ここでは最後尾に追加）
    modal.appendChild(replayButton);

    replayButton.addEventListener("click", () => {
      // 「もう一度見る」を押すと再度画像のフェードインを実行
      startTransition();
    });
  }, currentRiddle.transitionTime + 500);
}

      // 強制リフローしてからフェードイン開始
      /*endImg.offsetHeight;
      setTimeout(() => {
        endImg.style.opacity = "1";
      }, 0);

      // 15秒後＋余裕500msで画像コンテナを削除して問題文を表示
      setTimeout(() => {
        imgContainer.remove();
        questionText.textContent = currentRiddle.question;
        createRiddleAnswerInput();
      }, currentRiddle.transitionTime + 500);
    }
  }*/

  function createRiddleAnswerInput() {
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "答えを入力";
    inputField.style.marginTop = "10px";
    inputField.style.fontSize = "1rem";
    modal.appendChild(inputField);

    const submitButton = document.createElement("button");
    submitButton.textContent = "送信";
    submitButton.style.marginTop = "10px";
    submitButton.style.fontSize = "1rem";
    modal.appendChild(submitButton);

    submitButton.addEventListener("click", () => {
      const answer = inputField.value.trim();
      if (currentRiddleIndex < riddleQuestions.length) {
        const current = riddleQuestions[currentRiddleIndex];
        if (current.type === "image") {
          if (answer.indexOf("ゴリラ") !== -1) {
            alert("正解！");
            currentRiddleIndex++;
            showRiddleQuestion();
          } else {
            alert("間違いだよ、もう一度考えなよ");
          }
        } else {
          if (answer === current.answer) {
            alert("正解！");
            currentRiddleIndex++;
            showRiddleQuestion();
          } else {
            alert("間違いだよ、もう一度考えなよ");
          }
        }
      }
    });
  }
  showRiddleQuestion();
}

    // 最初の行を表示
    showNextLine();
  }
 
});

//==============================
// エリア3シナリオデータ（外部ファイルを使わず、ここに定義）
// ==============================
const area3MainLines = [
  {
    characters: [
      { name: "ロベリア", role: "話者", anim: "jump" },
      { name: "ノア", role: "非話者", anim: "" }
    ],
    text: "くっは！助かったよ、団長。メルシィ！"
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
    text: "君はどちらと戦う？"
  }
];

const linesAfterChoiceA = [
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" }
    ],
    text: "クイズで勝負だ！"
  }
];

const linesAfterChoiceB = [
  {
    characters: [
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "僕は謎解きの星晶獣...謎解きで勝負！"
  }
];

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
    text: "GRAN BLUE ESCAPE〜完〜"
  }
];

// ==============================
// エリア3ナレーション実装
// ==============================
/*function startArea3Narration() {
  // シーン生成
  const scene = document.createElement("div");
  scene.id = "narration-screen3";
  scene.className = "scene";
  scene.style.position = "absolute";
  scene.style.top = "0";
  scene.style.left = "0";
  scene.style.width = "100%";
  scene.style.height = "100%";
  scene.style.backgroundImage = "url('images/bg3.jpg')";
  scene.style.backgroundSize = "contain";
  scene.style.backgroundPosition = "center";
  scene.style.backgroundRepeat = "no-repeat";
  // ※必ず display を "block" に設定しておく
  scene.style.display = "block";
  document.body.appendChild(scene);
  
  // テキストフレーム（log.png）を下部に配置
  const logFrame = document.createElement("img");
  logFrame.src = "images/log.png";
  logFrame.style.position = "absolute";
  logFrame.style.bottom = "0";
  logFrame.style.left = "50%";
  logFrame.style.transform = "translateX(-50%)";
  logFrame.style.width = "100%";
  logFrame.style.height = "auto";
  logFrame.style.zIndex = "10";
  scene.appendChild(logFrame);
  
  // テキスト表示領域
  const textContainer = document.createElement("div");
  textContainer.id = "narration-text3";
  textContainer.style.position = "absolute";
  textContainer.style.bottom = "10%";
  textContainer.style.left = "50%";
  textContainer.style.transform = "translateX(-50%)";
  textContainer.style.width = "80%";
  textContainer.style.color = "#fff";
  textContainer.style.fontSize = "1.2rem";
  textContainer.style.textAlign = "center";
  textContainer.style.zIndex = "11";
  scene.appendChild(textContainer);
  
  // キャラクター表示用コンテナ
  const characterContainer = document.createElement("div");
  characterContainer.id = "character-container";
  characterContainer.style.position = "absolute";
  characterContainer.style.bottom = "20%";
  characterContainer.style.left = "0";
  characterContainer.style.width = "100%";
  characterContainer.style.height = "50%";
  characterContainer.style.zIndex = "9";
  scene.appendChild(characterContainer);
  
  // シナリオ進行用変数
  let currentLineIndex = 0;
  const lines = area3MainLines.slice();
  
  // クリック（およびタッチ）で次へ進むためのイベントリスナーを登録
  function onClickNext(e) {
    e.stopPropagation();
    showNextLine();
  }
  scene.addEventListener("click", onClickNext);
  scene.addEventListener("touchstart", onClickNext);
  
  function showNextLine() {
    if (currentLineIndex >= lines.length) {
      scene.removeEventListener("click", onClickNext);
      scene.removeEventListener("touchstart", onClickNext);
      showChoice();
      return;
    }
    const line = lines[currentLineIndex++];
    updateCharacters(line.characters);
    textContainer.innerHTML = `<p>${line.text}</p>`;
  }
  
  function updateCharacters(charDefs) {
    characterContainer.innerHTML = "";
    if (!charDefs || charDefs.length === 0) return;
    if (charDefs.length === 1) {
      const c = createCharacterElement(charDefs[0]);
      c.style.position = "absolute";
      c.style.left = "50%";
      c.style.transform = "translateX(-50%)";
      characterContainer.appendChild(c);
    } else if (charDefs.length === 2) {
      const c1 = createCharacterElement(charDefs[0]);
      const c2 = createCharacterElement(charDefs[1]);
      c1.style.position = "absolute";
      c1.style.left = "15%";
      c2.style.position = "absolute";
      c2.style.right = "15%";
      characterContainer.appendChild(c1);
      characterContainer.appendChild(c2);
    }
  }
  
  function createCharacterElement(charDef) {
    const img = document.createElement("img");
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
    img.style.filter = (charDef.role === "話者") ? "brightness(1)" : "brightness(0.5)";
    if (charDef.anim === "jump") {
      img.classList.add("jump");
    } else if (charDef.anim === "shake") {
      img.classList.add("shake");
    } else if (charDef.anim === "fadeout") {
      img.classList.add("fadeout");
    }
    return img;
  }
  
  function showChoice() {
    scene.removeEventListener("click", onClickNext);
    scene.removeEventListener("touchstart", onClickNext);
    textContainer.innerHTML = `<p>君はどちらと戦う？</p>`;
    
    const choiceModal = document.createElement("div");
    choiceModal.id = "choice-modal";
    choiceModal.style.position = "absolute";
    choiceModal.style.top = "0";
    choiceModal.style.left = "0";
    choiceModal.style.width = "100%";
    choiceModal.style.height = "100%";
    choiceModal.style.backgroundColor = "rgba(0,0,0,0.5)";
    choiceModal.style.zIndex = "999";
    scene.appendChild(choiceModal);
    
    const choiceContainer = document.createElement("div");
    choiceContainer.id = "choice-container";
    choiceContainer.style.position = "absolute";
    choiceContainer.style.top = "50%";
    choiceContainer.style.left = "50%";
    choiceContainer.style.transform = "translate(-50%, -50%)";
    choiceContainer.style.display = "flex";
    choiceContainer.style.flexDirection = "column";
    choiceContainer.style.gap = "20px";
    choiceModal.appendChild(choiceContainer);
    
    const btnA = document.createElement("button");
    btnA.textContent = "ロベリアネガと戦う(クイズ)";
    choiceContainer.appendChild(btnA);
    btnA.addEventListener("click", () => {
      scene.removeEventListener("click", onClickNext);
      scene.removeEventListener("touchstart", onClickNext);
      choiceModal.remove();
      showBranchLines(linesAfterChoiceA, () => {
        startArea3Game("A");
      });
    });
    
    const btnB = document.createElement("button");
    btnB.textContent = "ノアネガと戦う(謎解き)";
    choiceContainer.appendChild(btnB);
    btnB.addEventListener("click", () => {
      scene.removeEventListener("click", onClickNext);
      scene.removeEventListener("touchstart", onClickNext);
      choiceModal.remove();
      showBranchLines(linesAfterChoiceB, () => {
        startArea3Game("B");
      });
    });
  }
  
  function showBranchLines(branchLines, onFinish) {
    let idx = 0;
    const branchClickHandler = () => {
      if (idx >= branchLines.length) {
        scene.removeEventListener("click", branchClickHandler);
        scene.removeEventListener("touchstart", branchClickHandler);
        if (onFinish) onFinish();
        return;
      }
      const line = branchLines[idx++];
      updateCharacters(line.characters);
      textContainer.innerHTML = `<p>${line.text}</p>`;
    };
    scene.addEventListener("click", branchClickHandler);
    scene.addEventListener("touchstart", branchClickHandler);
    branchClickHandler();
  }
  
  function showEndingLines() {
    let idx = 0;
    const endClickHandler = () => {
      if (idx >= endingLines.length) {
        scene.removeEventListener("click", endClickHandler);
        scene.removeEventListener("touchstart", endClickHandler);
        showEndingImage();
        return;
      }
      const line = endingLines[idx++];
      updateCharacters(line.characters);
      textContainer.innerHTML = `<p>${line.text}</p>`;
    };
    scene.addEventListener("click", endClickHandler);
    scene.addEventListener("touchstart", endClickHandler);
    endClickHandler();
  }
  
  function showEndingImage() {
    scene.innerHTML = "";
    scene.style.backgroundImage = "url('images/title.jpg')";
    scene.style.backgroundSize = "contain";
    scene.style.backgroundPosition = "center";
    scene.style.backgroundRepeat = "no-repeat";
    const endText = document.createElement("div");
    endText.className = "end-text";
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
  
  function startArea3Game(choice) {
    alert("エリア3ゲーム開始: 選択肢 " + choice);
    // 選択肢に応じたゲームシーンへの遷移処理をここに追加
    // 今回はエンディングナレーションへ直接遷移する
    showEndingLines();
  }
  
  function showNextLine() {
    if (currentLineIndex >= area3MainLines.length) {
      scene.removeEventListener("click", onClickNext);
      scene.removeEventListener("touchstart", onClickNext);
      showChoice();
      return;
    }
    const line = area3MainLines[currentLineIndex++];
    updateCharacters(line.characters);
    textContainer.innerHTML = `<p>${line.text}</p>`;
  }
  
  // 最初の行を表示
  showNextLine();
}

// ==============================
// エリア3シナリオデータ（そのまま埋め込み）
const linesAfterChoiceA = [
  {
    characters: [
      { name: "ロベリアネガ", role: "話者", anim: "" }
    ],
    text: "クイズで勝負だ！"
  }
];

const linesAfterChoiceB = [
  {
    characters: [
      { name: "ノアネガ", role: "話者", anim: "" }
    ],
    text: "僕は謎解きの星晶獣...謎解きで勝負！"
  }
];

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
    text: "GRAN BLUE ESCAPE〜完〜"
  }
];*/