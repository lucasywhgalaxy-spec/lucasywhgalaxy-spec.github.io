function updateTime() {
  const node = document.getElementById("time");
  if (!node) return;

  const now = new Date();
  const formatted = now.toLocaleTimeString("zh-CN", {
    hour12: false,
  });

  node.textContent = formatted;
}

const i18n = {
  zh: {
    langButton: "EN",
    tag: "Personal Homepage",
    heroTitle: "你好，我是汪沄",
    heroSubtitle: "英语语言学专业学生。",
    chipMajor: "专业：英语语言学",
    chipHobby: "爱好：游泳",
    aboutTitle: "关于我",
    aboutText: "我是汪沄，主修英语语言学，平时喜欢游泳，也喜欢尝试把创意做成网页。",
    contactTitle: "联系方式",
    goalTitle: "今天的目标",
    goal1: "完成一个结构清晰的个人主页",
    goal2: "掌握静态资源组织方式",
    goal3: "发布到 GitHub Pages",
    timeTitle: "实时时间",
    timeHint: "页面正在通过 JavaScript 实时更新时间。",
  },
  en: {
    langButton: "中文",
    tag: "Personal Homepage",
    heroTitle: "Hi, I'm Wang Yun",
    heroSubtitle: "An English Linguistics major.",
    chipMajor: "Major: English Linguistics",
    chipHobby: "Hobby: Swimming",
    aboutTitle: "About Me",
    aboutText:
      "I'm Wang Yun, majoring in English Linguistics. I enjoy swimming and turning ideas into webpages.",
    contactTitle: "Contact",
    goalTitle: "Today's Goals",
    goal1: "Build a clean personal homepage",
    goal2: "Practice static resource organization",
    goal3: "Publish it on GitHub Pages",
    timeTitle: "Live Time",
    timeHint: "This time is updated in real time with JavaScript.",
  },
};

let currentLang = "zh";

function setText(id, value) {
  const node = document.getElementById(id);
  if (!node) return;
  node.textContent = value;
}

function switchLanguage() {
  currentLang = currentLang === "zh" ? "en" : "zh";
  const t = i18n[currentLang];

  setText("lang-toggle", t.langButton);
  setText("tag", t.tag);
  setText("hero-title", t.heroTitle);
  setText("hero-subtitle", t.heroSubtitle);
  setText("chip-major", t.chipMajor);
  setText("chip-hobby", t.chipHobby);
  setText("about-title", t.aboutTitle);
  setText("about-text", t.aboutText);
  setText("contact-title", t.contactTitle);
  setText("goal-title", t.goalTitle);
  setText("goal-1", t.goal1);
  setText("goal-2", t.goal2);
  setText("goal-3", t.goal3);
  setText("time-title", t.timeTitle);
  setText("time-hint", t.timeHint);
  document.documentElement.lang = currentLang === "zh" ? "zh-CN" : "en";
}

const langToggle = document.getElementById("lang-toggle");
if (langToggle) {
  langToggle.addEventListener("click", switchLanguage);
}

const revealNodes = document.querySelectorAll(".reveal");
revealNodes.forEach((node, index) => {
  setTimeout(() => {
    node.classList.add("show");
  }, index * 120);
});

const avatarWrap = document.getElementById("avatar-wrap");
if (avatarWrap && window.matchMedia("(min-width: 761px)").matches) {
  window.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 10;
    const y = (event.clientY / window.innerHeight - 0.5) * 10;
    avatarWrap.style.transform = `translate(${x}px, ${y}px)`;
  });
}

updateTime();
setInterval(updateTime, 1000);

fetch('posts.json')
  .then(res => res.json())
  .then(posts => {
    const list = document.getElementById('post-list');
    list.innerHTML = posts
      .map(p => `
        <li>
          <a href="post.html?file=${p.file}">${p.title}</a>
          <span style="opacity:0.6; margin-left:8px;">${p.date}</span>
        </li>
      `)
      .join('');
  });
