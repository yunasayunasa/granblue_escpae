document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript 読み込み完了");

  // ================================
  //  シーン管理
  // ================================
  const scenes = document.querySelectorAll('.scene');
  function showScene(sceneId) {
    scenes.forEach(scene => scene.style.display = "none");
    document.getElementById(sceneId).style.display = "block";
  }

  // 最初はタイトル画面
  showScene("title-screen");

  // タイトル画面をクリック → ナレーションシーン
  document.getElementById("title-screen").addEventListener("click", () => {
    showScene("narration-screen");
  });

  // ================================
  //  ナレーション進行
  // ================================
  const narrationTexts = [
    "君は目を覚ますと、自分の部屋にいた…",
    "部屋から出ようとするが、鍵がかかっている…",
    "どうやらこの鍵を開けないと出られないようだ。"
  ];
  let narrationIndex = 0;

  document.getElementById("narration-screen").addEventListener("click", () => {
    narrationIndex++;
    if (narrationIndex < narrationTexts.length) {
      document.getElementById("narration-content").innerHTML =
        `<p>${narrationTexts[narrationIndex]}</p>`;
    } else {
      showScene("game-screen");
    }
  });

  // ================================
  //  ゲーム進行（ベッド・キャスターなど）
  // ================================
  const bedArea    = document.getElementById("bed-area");
  const casterArea = document.getElementById("caster-area");
  const exitButton = document.getElementById("exit-button");

  // ベッド/キャスター用モーダル
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
    hintImage.src = "images/bg1_hint1.jpg"; // ヒント画像を差し替え
    hintTextInModal.textContent = "ベッドには謎の紙片が残されている…";
    hintModal.style.display = "flex";       // モーダル表示
  });

  // キャスターをタップ
  casterArea.addEventListener("click", (e) => {
    e.stopPropagation();
    hintImage.src = "images/bg1_hint2.jpg";
    hintTextInModal.textContent = "キャスターに妙な跡がある…";
    hintModal.style.display = "flex";
  });

  // モーダルをクリック → 閉じる
  hintModal.addEventListener("click", () => {
    hintModal.style.display = "none";
  });

  // 「部屋から出る」ボタン → 4桁入力モーダルを開く
  exitButton.addEventListener("click", (e) => {
    e.stopPropagation();
    exitModal.style.display = "flex";
    passwordInput.value = "";
  });

  // 4桁入力モーダル外をクリック → 閉じる
  exitModal.addEventListener("click", (event) => {
    if (event.target === exitModal) {
      exitModal.style.display = "none";
    }
  });

  // 4桁入力の判定
  passwordSubmit.addEventListener("click", () => {
    const input = passwordInput.value.trim();
    const correctPassword = "4593";
    if (/^\d{4}$/.test(input)) {
      if (input === correctPassword) {
        alert("鍵が開いた！\n本編は4/1実装予定！お楽しみに！");
        exitModal.style.display = "none";
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
  //  ヒントボタン（画面右上）と一時表示テキスト
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

  // ヒントボタンを押す → テキスト表示、3秒後に消える
  hintButton.addEventListener("click", () => {
    hintText.textContent = "くはっ！数字は別のヒントの色と連動しているよ！";
    hintText.style.display = "block";

    // 3秒後に自動で消える
    setTimeout(() => {
      hintText.style.display = "none";
    }, 3000);
  });

  // 画面のどこかをタップするとヒントテキストを消す
  document.addEventListener("click", (event) => {
    // ヒントボタン自身をクリックした場合は除外
    if (event.target !== hintButton) {
      hintText.style.display = "none";
    }
  });
});


  
  // 例：エリア１クリア後に次の処理として第二エリアのナレーションを開始する
  // ※エリア１クリア時に以下を呼び出す（例：onArea1Clear()内）
  // startArea2Narration();

  // ================================
  // 第二エリアナレーション（新規）
  // ================================
  // セリフは「*」で囲まれた各ブロックを1行として、グループで最大3行ずつ表示
  const narrationTextsArea2 = [
    "無事部屋を脱出した君は、操舵室にたどり着いた。",
    "なぜ自分の部屋にあんな鍵が...？考えても答えは出ない...",
    "その時ふと、あることに気がついた。",
    "━操舵室に、ノアが居ない。",
    "どこに行ったのだろう？探しに行こうとすると、声が聞こえた。",
    "団長さん！ここだよ！聞こえるかい！？",
    "声はするが、姿は見えず━、君はこの部屋を探すことにした。"
  ];
  let currentNarrationIndex = 0;
  const narrationGroupSize = 3; // 一度に表示する行数

  // グループ分けしてナレーション画面を更新する関数
  function updateNarrationGroup() {
    let groupHTML = "";
    // 最大3行分（残っている分だけ）を表示
    for (let i = 0; i < narrationGroupSize; i++) {
      if (currentNarrationIndex < narrationTextsArea2.length) {
        groupHTML += `<p>${narrationTextsArea2[currentNarrationIndex]}</p>`;
        currentNarrationIndex++;
      }
    }
    document.getElementById("narration-content").innerHTML = groupHTML;
  }

  // 第二エリアナレーション開始用関数
  function startArea2Narration() {
    currentNarrationIndex = 0; // 初期化
    updateNarrationGroup();
    showScene("narration-screen");
  }

  // ナレーション画面のタップイベント（第二エリア用）
  // ※このイベントリスナーは、startArea2Narration() を呼んだ後に有効になります。
  document.getElementById("narration-screen").addEventListener("click", () => {
    if (currentNarrationIndex < narrationTextsArea2.length) {
      // 次のグループを表示
      updateNarrationGroup();
    } else {
      // ナレーション終了 → 次のゲームシーンへ移行
      showScene("game-screen2");
    }
  });
  
  function startArea2Narration() {
  currentNarrationIndex = 0; // ナレーションインデックス初期化

  // 第二エリア用の背景画像とテキストフレームを設定
  document.querySelector('#narration-screen .narration-background').src = "images/bg2.jpg"; // 仮パス
  document.querySelector('#narration-screen .narration-frame').src = "images/log.png";       // 仮パス

  updateNarrationGroup();
  showScene("narration-screen");
}

  // ================================
  // 第二エリアゲームシーンなど（新規）
  // ================================
  // ※「game-screen2」は第二エリア用のゲームシーンのIDです。
  // ここに第二エリアのゲーム処理を追加してください。

  // ================================
  // ※また、既存のエリア１のナレーションやゲーム部分のコードと混ざらないよう、
  // 状態管理やシーンIDで分けることで、後から追加・変更がしやすくなります。
});