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

  // タイトル画面をクリック → ナレーション画面（エリア1）へ
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

  // エリア2のナレーション（グループで3行ずつ表示）
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

  // ※エリア1の最初のナレーションはHTMLに記述済みと仮定（narrationIndex = 0）
  narrationScreen.addEventListener("click", () => {
    if (currentArea === "area1") {
      narrationIndex++;
      if (narrationIndex < narrationTextsArea1.length) {
        narrationContent.innerHTML = `<p>${narrationTextsArea1[narrationIndex]}</p>`;
      } else {
        // エリア1のナレーション終了 → エリア1ゲーム画面へ
        showScene("game-screen");
      }
    } else if (currentArea === "area2") {
      // エリア2は3行ずつ表示
      if (narrationIndex < narrationTextsArea2.length) {
        let groupHTML = "";
        for (let i = 0; i < 3 && narrationIndex < narrationTextsArea2.length; i++) {
          groupHTML += `<p>${narrationTextsArea2[narrationIndex]}</p>`;
          narrationIndex++;
        }
        narrationContent.innerHTML = groupHTML;
      } else {
        alert("エリア2のナレーション終了。ゲームシーンは未実装です。");
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
    // 最初のグループ（最大3行）を表示
    let groupHTML = "";
    for (let i = 0; i < 1 && narrationIndex < narrationTextsArea2.length; i++) {
      groupHTML += `<p>${narrationTextsArea2[narrationIndex]}</p>`;
      narrationIndex++;
    }
    narrationContent.innerHTML = groupHTML;
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