function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const ALLOWED_TAGS = new Set(["华为", "苹果", "三星", "谷歌"]);
const COVER_COLORS = ["#dbeafe", "#fee2e2", "#dcfce7", "#fef3c7", "#ede9fe", "#ffe4e6"];
let allPosts = [];
let activeTag = "";

function pickColor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return COVER_COLORS[hash % COVER_COLORS.length];
}

function updateFilterStatus() {
  const status = document.getElementById("post-filter-status");
  if (!status) return;
  status.textContent = activeTag ? `当前筛选：${activeTag}` : "当前筛选：全部";
}

function getFilteredPosts(posts) {
  if (!activeTag) return posts;
  return posts.filter((post) => {
    const tags = Array.isArray(post.tags) ? post.tags : [];
    return tags.includes(activeTag);
  });
}

function renderPosts(posts) {
  const list = document.getElementById("post-list");
  if (!list) return;

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
  );

  list.innerHTML = sorted
    .map((post, index) => {
      const tags = Array.isArray(post.tags)
        ? post.tags.filter((tag) => ALLOWED_TAGS.has(tag))
        : [];

      const tagHtml = tags.length
        ? tags
            .map((tag) => {
              const activeClass = tag === activeTag ? " active" : "";
              return `<button type="button" class="post-tag-chip${activeClass}" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>`;
            })
            .join("")
        : '<span class="post-tag-chip muted">#未分类</span>';

      const coverColor = pickColor(`${post.file || ""}-${index}`);
      const dateText = post.date ? escapeHtml(post.date) : "";

      return `
        <li class="post-item">
          <div class="post-cover" style="background:${coverColor};"></div>
          <div class="post-body">
            <h3 class="post-title"><a href="post.html?file=${encodeURIComponent(post.file)}">${escapeHtml(post.title)}</a></h3>
            <div class="post-meta">${dateText}</div>
            <div class="post-tags">${tagHtml}</div>
          </div>
        </li>
      `;
    })
    .join("");
}

function bindTagFilter() {
  const list = document.getElementById("post-list");
  if (!list) return;

  list.addEventListener("click", (event) => {
    const chip = event.target.closest(".post-tag-chip[data-tag]");
    if (!chip) return;

    const tag = chip.dataset.tag || "";
    if (!ALLOWED_TAGS.has(tag)) return;

    activeTag = activeTag === tag ? "" : tag;
    renderPosts(getFilteredPosts(allPosts));
    updateFilterStatus();
  });
}

async function loadPosts() {
  const list = document.getElementById("post-list");
  if (!list) return;

  try {
    const res = await fetch("posts.json");
    const posts = await res.json();
    if (!Array.isArray(posts)) throw new Error("posts.json 格式错误");

    allPosts = posts;
    renderPosts(getFilteredPosts(allPosts));
    updateFilterStatus();
  } catch (error) {
    list.innerHTML = "<li class=\"post-item\"><div class=\"post-body\">文章加载失败</div></li>";
  }
}

bindTagFilter();
loadPosts();
