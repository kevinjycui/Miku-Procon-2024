import { CharData, IBeat, IChord, IRepetitiveSegment, Player } from "textalive-app-api";

// TextAlive Player を初期化
const player = new Player({
      app: { 
          appName: "Magical Mirai 2024",
          appAuthor: "Junferno",
          token: "test" 
      },
      mediaElement: document.querySelector("#media")! as HTMLElement,
      mediaBannerPosition: "bottom left"
});

const control = document.querySelector("#control")!;
const textContainer = document.querySelector("#text-container")!;
let b: IBeat | null
let c
let ch: IChord | null;
let seg: IRepetitiveSegment | null;
let isFirstNoun = true;
let phraseCount = 0;

let songQueued = -1;
let isPaused = false;

const images : HTMLImageElement[] = [
  document.querySelector("#static-leek2")!,
  document.querySelector("#static-leek4")!,
  document.querySelector("#static-leek6")!,
  document.querySelector("#static-leek8")!,
  document.querySelector("#static-leek1")!,
  document.querySelector("#static-leek3")!,
  document.querySelector("#static-leek5")!,
  document.querySelector("#static-leek7")!,
];
let imageIndex = 0;
let citationNumber = 1;

const title = document.querySelector("#title")!;
const box = document.querySelector("#box")!;
const boxTitle = document.querySelector("#box-title")!;
const boxImage : HTMLImageElement = document.querySelector("#box-image")!;
const artist = document.querySelector("#artist")!;
const backingImage = document.querySelector("#backing-image")!;

let newBeat = false;

function playQueuedSong() {
  if (songQueued === 1) {
    // SUPERHERO / めろくる
    player.createFromSongUrl("https://piapro.jp/t/hZ35/20240130103028", {
      video: {
        // 音楽地図訂正履歴
        beatId: 4592293,
        chordId: 2727635,
        repetitiveSegmentId: 2824326,
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2FhZ35%2F20240130103028
        lyricId: 59415,
        lyricDiffId: 13962
      }
    });
  }
  else if (songQueued === 2) {
    // いつか君と話したミライは / タケノコ少年
    player.createFromSongUrl("https://piapro.jp/t/--OD/20240202150903", {
      video: {
        // 歌詞タイミング訂正履歴: https://textalive.jp/lyrics/piapro.jp%2Ft%2F--OD%2F20240202150903
        lyricId: 59416,
        lyricDiffId: 13963
      }
    });
  }
  else if (songQueued === 3) {
    // フューチャーノーツ / shikisai
    player.createFromSongUrl("https://piapro.jp/t/XiaI/20240201203346", {
      video: {
        // https://textalive.jp/lyrics/piapro.jp%2Ft%2FXiaI%2F20240201203346
        lyricId: 59417,
        lyricDiffId: 13964
      }
    });
  }
  else if (songQueued === 4) {
    // 未来交響曲 / ヤマギシコージ
    player.createFromSongUrl("https://piapro.jp/t/Rejk/20240202164429", {
      video: {
        // https://textalive.jp/lyrics/piapro.jp%2Ft%2FRejk%2F20240202164429
        lyricId: 59418,
        lyricDiffId: 13965
      }
    });
  }
  else if (songQueued === 5) {
    // リアリティ / 歩く人 & sober bear
    player.createFromSongUrl("https://piapro.jp/t/ELIC/20240130010349", {
      video: {
        // https://textalive.jp/lyrics/piapro.jp%2Ft%2FELIC%2F20240130010349
        lyricId: 59419,
        lyricDiffId: 13966
      }
    });
  }
  else if (songQueued === 6) {
    // The Marks / 2ouDNS
    player.createFromSongUrl("https://piapro.jp/t/xEA7/20240202002556", {
      video: {
        // https://textalive.jp/lyrics/piapro.jp%2Ft%2FxEA7%2F20240202002556
        lyricId: 59420,
        lyricDiffId: 14589
      }
    });
  }
}

function queueSong(index : number) {
  if (songQueued === -1 || !player || (!player.isPlaying && isPaused)) {
    songQueued = index;
    playQueuedSong();
  }
  else {
    songQueued = index;
    player.requestStop();
  }
  document.querySelector("#loading")!.className = "";
  document.querySelector("#instructions")!.className = "hidden";
}

document.querySelector("#song1")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 1) {
    return;
  }
  queueSong(1);
})

document.querySelector("#song2")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 2) {
    return;
  }
  queueSong(2);
})

document.querySelector("#song3")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 3) {
    return;
  }
  queueSong(3);
})

document.querySelector("#song4")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 4) {
    return;
  }
  queueSong(4);
})

document.querySelector("#song5")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 5) {
    return;
  }
  queueSong(5);
})

document.querySelector("#song6")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (songQueued === 6) {
    return;
  }
  queueSong(6);
})

player.addListener({
    onAppReady(app) {
      if (app.managed) {
        control.className = "not-interactable";
      }
    },

    onAppMediaChange() {
      endSong();
    },

    onVideoReady(video) {
      title.textContent = "";
      boxTitle.textContent = player.data.song.name;
      artist.textContent = player.data.song.name + " / " + player.data.song.artist.name;
      resetChars();
    },

    onTimerReady() {
      control.className = "";
      player.requestPlay();
    },

    onTimeUpdate(position : number) {
      let beat = player.findBeat(position);
      if (b !== beat) {
        if (beat && textContainer.children.length > 0) {
          const lastChild = textContainer.children[textContainer.children.length-1];
          console.log(lastChild)
          if (!lastChild.classList.contains("line-break") ||
            lastChild.tagName === "SUP"
          ) {
            let citation = document.createElement("sup");
            citation.textContent = "[" + citationNumber + "]"
            citationNumber++;
            textContainer.appendChild(citation);
          }
        }
        b = beat;
      }

      let chord = player.findChord(position);
      if (ch !== chord) {
        if (chord) {
        }
        ch = chord;
      }

      let chorus = player.findChorus(position);
      if (seg !== chorus) {
        if (c) {
          if(c === c.parent.parent.firstChar) {
            resetChars();
            c = c.previous;
          }
          else if (c == c.parent.parent.lastChar) {
            resetChars();
          }
        }
        if (chorus) {
          box.className = "";
          boxImage.src = images[imageIndex].src;
          imageIndex = (imageIndex + 1) % images.length;
        }
        else {
          box.className = "hidden";
        }
        seg = chorus;
      }

      if (!player.video.firstChar) {
        return;
      }

      if (c && c.startTime > position + 1000) {
        resetChars();

        if (c === player.video.lastChar) {
          endSong();
        }
      }
      else if (position >= player.data.song.length * 1000 - 500)
      {
        endSong();
      }
      
      let current = c || player.video.firstChar;

      while (current && current.startTime < position + 500) {
        if (c !== current) {
          c = current;
          newChar(c);
        }

        current = current.next;
      }
    
    },

    onPlay() {
      endSong()
      document.querySelector("#control > #play")!.className = "hidden";
      document.querySelector("#control > #pause")!.className = "";
      document.querySelector("#control > #stop")!.className = "";
      isPaused = false;
      document.querySelector("#loading")!.className = "hidden";
      backingImage.className = "";
    },

    onPause() {
      document.querySelector("#control > #play")!.className = "";
      document.querySelector("#control > #pause")!.className = "hidden";
      document.querySelector("#control > #stop")!.className = "";
      isPaused = true;
    },

    onStop() {
      document.querySelector("#control > #stop")!.className = "not-interactable";
      endSong();
      playQueuedSong();
      isPaused = false;
    }
});

function endSong()
{
  resetChars();
  box.className = "hidden";
  c = null;
  b = null;
  ch = null;
  seg = null;
  isFirstNoun = true;
  phraseCount = 0;
  imageIndex = 0;
  citationNumber = 1;
  backingImage.className = "hidden";
}

function newChar(current)
{
  if (current.parent.parent.firstChar === current &&
    current.previous &&
    current.startTime > current.previous.endTime + 1000) {
      resetChars();
  }

  const classes : string[] = [];
  const charClasses : string[] = [];
  var pre = document.createElement("p");
  var suf = document.createElement("p");
  var longWord = "";
  var longWordEnd = false;

  var isNumeric : boolean = /^[+-]?\d+(\.\d+)?$/.test(current.text);
  if (isNumeric) {
    charClasses.push("numeric");
  }

  var isPunct : boolean = /[.!?。、，...．．．？⁈⁇！‼]+/.test(current.text)
  if (isPunct) {
    charClasses.push("punctuation");
  }
  
  // First character in phrase
  if (current.parent.parent.firstChar === current) {
    var phrase = "";
    var iterChar = current;
    while (iterChar && iterChar.parent.parent === current.parent.parent) {
      if (iterChar === iterChar.parent.lastChar && 
        iterChar.parent.language === "en" && 
        iterChar.parent.next &&
        iterChar.parent.next.language == "en") {
        phrase += iterChar.text + " ";
      }
      else {
        phrase += iterChar;
      }
      iterChar = iterChar.next;
    }

    phraseCount++;
    if (phraseCount > 8) {
      resetChars();
    }

    title.textContent = phrase;
  }

  // First character in word
  if (current.parent.firstChar === current) {
    charClasses.push("first-char");

    if (current.parent.pos === "N") {
      classes.push("noun");
  
      var charCount : number = current.parent.charCount;
      longWord = current.parent.text;

      var firstChar = current.parent.firstChar;
      var previous = current.parent.previous;
      while (previous && previous.pos === "N" && previous.parent === current.parent.parent) {
        charCount += previous.charCount;
        longWord = previous.text + longWord;
        firstChar = previous.firstChar;
        previous = previous.previous;
      }
      var lastChar = current.parent.lastChar;
      var next = current.parent.next;
      while (next && next.pos === "N" && next.parent === current.parent.parent) {
        charCount += next.charCount;
        longWord += next.text;
        lastChar = next.lastChar;
        next = next.next;
      }
  
      if (charCount >= 2 && lastChar.endTime - firstChar.startTime >= 350) {
        if (isFirstNoun) {
          classes.push("first-noun");
          isFirstNoun = false;
        }
        else {
          classes.push("long-word");
        }

        if (lastChar === current) {
          longWordEnd = true;
        }
      }
      else {
        longWord = "";
      }
    }
  
    if (current.parent.pos === "PN") classes.push("pronoun");
    if (current.parent.pos === "V") classes.push("verb");
    if (current.parent.pos === "R") classes.push("adverb");
    if (current.parent.pos === "J") classes.push("adjective");
    if (current.parent.pos === "A") classes.push("adnominal-adjective");
    if (current.parent.pos === "P") classes.push("particle");
    if (current.parent.pos === "M") classes.push("modal");
    if (current.parent.pos === "w") classes.push("wh");
    if (current.parent.pos === "D") classes.push("determiner");
    if (current.parent.pos === "I") classes.push("conjunction");
    if (current.parent.pos === "U") classes.push("interjection");
    if (current.parent.pos === "F") classes.push("prefix");
    if (current.parent.pos === "S") classes.push("symbol");
    if (current.parent.pos === "X") classes.push("other");
  
  
    if (current.parent.language === "en") {
      classes.push("english");
    }
  
    if (current.parent.language === "ja") {
      classes.push("japanese");
    }
  }

  // Last character in word
  if (current.parent.parent.lastChar === current) {
    charClasses.push("last-char");

    if (current.parent.parent.lastWord === current.parent && !isPunct) {
      classes.push("last-word");
    }
  }

  const spans = textContainer.querySelectorAll("span");
  var span : Element;

  var popupWrapper : Element | null = null;

  if (spans.length > 0 && 
        ((longWord.length !== 0 && spans[spans.length-1].id === longWord) || 
        current.parent.firstChar !== current)) {
    span = spans[spans.length-1];
    popupWrapper = span.querySelector(".popup-wrapper");
    if (popupWrapper) popupWrapper.className = "popup-wrapper";
    while (textContainer.contains(span)) {
      textContainer.removeChild(textContainer.lastChild!);
    }
  }
  else if (longWord.length !== 0 && current.parent.firstChar === current && 
    (spans.length == 0 || spans[spans.length-1].id !== longWord)) {

    if (spans.length > 0 && spans[spans.length-1].classList.contains("recent")) {
      spans[spans.length-1].classList.remove("recent");
    }

    span = document.createElement("span");
    classes.push("recent");
    span.className = classes.join(" ");
    span.id = longWord;
    
    popupWrapper = document.createElement("div");
    popupWrapper.className = "popup-wrapper animated";
    const popup = document.createElement("div");
    popup.className = "popup";
    popup.textContent = longWord;
    let popupImage = document.createElement("img");
    popupImage.src = images[imageIndex].src;
    imageIndex = (imageIndex + 1) % images.length;
    popup.appendChild(popupImage);
    popupWrapper.appendChild(popup);
  }
  else {
    if (spans.length > 0 && spans[spans.length-1].classList.contains("recent")) {
      spans[spans.length-1].classList.remove("recent");
    }

    span = document.createElement("span");
    span.className = classes.join(" ");
  }

  if (pre.childNodes.length !== 0) {
    pre.className = "presuf";
    span.appendChild(pre);
  }

  const betweenEnglish = current.parent.lastChar === current &&
    current.parent.language === "en" && current.next.parent.language === "en";

  const p = document.createElement("p");
  p.className = charClasses.join(" ");
  p.appendChild(document.createTextNode(current.text));
  if (longWord.length > 0 && !longWordEnd && betweenEnglish) {
      const wsp = document.createElement("p");
      wsp.className = "whitespace";
      wsp.textContent = "\u00A0";
      textContainer.appendChild(wsp);
  }
  span.appendChild(p);
  if (popupWrapper) {
    span.appendChild(popupWrapper);
  }

  if (suf.childNodes.length !== 0) {
    suf.className = "presuf";
    span.appendChild(suf);
  }

  textContainer.appendChild(span);

  if ((longWordEnd || longWord.length === 0) && betweenEnglish) {
    const wsp = document.createElement("p");
    wsp.className = "whitespace";
    wsp.textContent = "\u00A0";
    textContainer.appendChild(wsp);
  }

  if (current.parent.parent.lastChar === current) {
    const linebreak = document.createElement("div");
    linebreak.className = "line-break";
    textContainer.appendChild(linebreak);
  }

}

function resetChars() {
  title.textContent = "";
  isFirstNoun = true;
  phraseCount = 0;
  while (textContainer.firstChild) {
    textContainer.removeChild(textContainer.firstChild);
  }
}

document.querySelector("#control > #play > a")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (player && !player.isPlaying && !player.isLoading) {
    player.requestPlay();
  }
  return false;
});

document.querySelector("#control > #pause > a")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (player && player.isPlaying && !player.isLoading) {
    player.requestPause();
  }
  return false;
});

document.querySelector("#control > #stop > a")!.addEventListener("click", (e) => {
  e.preventDefault();
  if (player && !player.isLoading) {
    player.requestStop();
  }
  return false;
});

document.querySelector("a#jp")!.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#logo-text-jp")!.className = "";
  document.querySelector("#logo-text-en")!.className = "hidden";
  document.querySelector("#logo-text-cn")!.className = "hidden";
  document.querySelector("#language")!.textContent = "言語";
  document.querySelector("#control > #play > a")!.textContent = "再生";
  document.querySelector("#control > #pause > a")!.textContent = "一時停止";
  document.querySelector("#control > #stop > a")!.textContent = "停止";
  document.querySelector("#instructions")!.textContent = "左側で楽曲を選んでください";
  document.querySelector("#loading")!.textContent = "ちょっと待ってください．．．";
})

document.querySelector("a#en")!.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#logo-text-jp")!.className = "hidden";
  document.querySelector("#logo-text-en")!.className = "";
  document.querySelector("#logo-text-cn")!.className = "hidden";
  document.querySelector("#language")!.textContent = "Language";
  document.querySelector("#control > #play > a")!.textContent = "Play";
  document.querySelector("#control > #pause > a")!.textContent = "Pause";
  document.querySelector("#control > #stop > a")!.textContent = "Stop";
  document.querySelector("#instructions")!.textContent = "Please select a song from the left!";
  document.querySelector("#loading")!.textContent = "Please wait just a moment...";
})

document.querySelector("a#cn")!.addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#logo-text-jp")!.className = "hidden";
  document.querySelector("#logo-text-en")!.className = "hidden";
  document.querySelector("#logo-text-cn")!.className = "";
  document.querySelector("#language")!.textContent = "语言";
  document.querySelector("#control > #play > a")!.textContent = "播放";
  document.querySelector("#control > #pause > a")!.textContent = "暂停";
  document.querySelector("#control > #stop > a")!.textContent = "停止";
  document.querySelector("#instructions")!.textContent = "请从左边选一首歌曲!";
  document.querySelector("#loading")!.textContent = "请稍等...";
})
