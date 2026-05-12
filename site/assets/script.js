/* =========================================================
   Dr. Raja Messou — blog citoyen | JS (FR + AR)
   ========================================================= */

(function () {
  "use strict";

  /* ---------- LOCALE DETECTION ---------- */
  const IS_AR =
    document.documentElement.lang === "ar" ||
    document.documentElement.dir === "rtl" ||
    location.pathname.includes("/ar/");

  const ROOT = IS_AR ? "../" : "";        // path back to site root from /ar/
  const HERE = IS_AR ? "" : "";           // current dir prefix

  /* ---------- I18N ---------- */
  const T = IS_AR ? {
    name: "د. رجاء ميسو",
    sub: "مدونة مواطنة · أكادير · قُرب · مساءلة",
    tagline: "أكادير أولاً، ودائماً",
    nav: [
      { href: "index.html",        label: "الرئيسية" },
      { href: "actualites.html",   label: "الأخبار" },
      { href: "blog.html",         label: "تحاليل" },
      { href: "terrain.html",      label: "الميدان" },
      { href: "reclamations.html", label: "فضاء المواطنين" },
      { href: "agenda.html",       label: "الأجندة" },
      { href: "mediatheque.html",  label: "الوسائط" },
      { href: "engagements.html",  label: "الالتزامات" },
      { href: "redevabilite.html", label: "المساءلة" },
      { href: "a-propos.html",     label: "نبذة" },
      { href: "contact.html",      label: "اتصال" },
    ],
    topbarLeft1: "إرسال ملاحظة",
    topbarLeft2: "طلب موعد",
    ctaWrite: "اكتب",
    ctaClaim: "شكاية",
    readMore: "اقرأ المزيد",
    share: "شارك",
    shareOn: "شارك هذا الموضوع",
    sendOnSubject: "أرسل ملاحظة حول هذا الموضوع",
    relatedTitle: "اقرأ أيضاً",
    by: "بقلم",
    none: "لا توجد منشورات حالياً.",
    noEvent: "لا توجد مواعيد مبرمجة حالياً.",
    noMatch: "لا توجد نتائج مطابقة.",
    notFound: "المقال غير موجود.",
    success: "✓ شكراً لك. تم تسجيل رسالتك وستُقرأ وتُصنّف.",
    dashboardLabels: ["مقالات منشورة", "مواعيد مبرمجة", "أحياء تمت زيارتها", "ملفات قيد المتابعة"],
    blogFooter: "المدونة",
    citizenFooter: "فضاء المواطنين",
    aboutFooter: "نبذة",
    footerLines: {
      blog: ["الأخبار","تحاليل","الميدان","الأجندة","الوسائط"],
      citizen: ["تقديم شكاية","اقتراح فكرة","طلب موعد","المساءلة","الالتزامات"],
      about: ["المسار","اتصال","المداومات","شروط الاستخدام","قانون 09-08"],
    },
    footerTagline: "أكادير أولاً، ودائماً — فضاء للإصغاء، الإعلام، القُرب والمساءلة المواطنة.",
    footerRights: "© جميع الحقوق محفوظة.",
    footerSubtitle: "مصمَّم للإعلام، الإصغاء، الشرح، والمحاسبة.",
    cats: { "Toutes":"الكل", "Terrain":"ميدان", "Communiqués":"بلاغات", "Analyses":"تحاليل", "Conseil communal":"المجلس الجماعي", "Femmes":"النساء", "Jeunes":"الشباب", "Quartiers":"الأحياء", "Médias":"إعلام", "Redevabilité":"مساءلة" },
  } : {
    name: "Dr. Raja Messou",
    sub: "Blog citoyen · Agadir · Proximité · Redevabilité",
    tagline: "Agadir d'abord, et toujours",
    nav: [
      { href: "index.html",         label: "Accueil" },
      { href: "actualites.html",    label: "Actualités" },
      { href: "blog.html",          label: "Analyses" },
      { href: "terrain.html",       label: "Terrain" },
      { href: "reclamations.html",  label: "Espace citoyen" },
      { href: "agenda.html",        label: "Agenda" },
      { href: "mediatheque.html",   label: "Médiathèque" },
      { href: "engagements.html",   label: "Engagements" },
      { href: "redevabilite.html",  label: "Redevabilité" },
      { href: "a-propos.html",      label: "À propos" },
      { href: "contact.html",       label: "Contact" },
    ],
    topbarLeft1: "Déposer une remarque",
    topbarLeft2: "Demander un rendez-vous",
    ctaWrite: "Écrire",
    ctaClaim: "Réclamation",
    readMore: "Lire la suite",
    share: "Partager",
    shareOn: "Partager cet article",
    sendOnSubject: "Envoyer une remarque sur ce sujet",
    relatedTitle: "À lire aussi",
    by: "par",
    none: "Aucune publication pour l'instant.",
    noEvent: "Aucun événement programmé pour le moment.",
    noMatch: "Aucun article ne correspond à votre recherche.",
    notFound: "Article introuvable.",
    success: "✓ Merci, votre message a bien été enregistré. Il sera lu et classé.",
    dashboardLabels: ["Articles publiés", "Rencontres programmées", "Quartiers visités", "Dossiers suivis"],
    blogFooter: "Le blog",
    citizenFooter: "Espace citoyen",
    aboutFooter: "À propos",
    footerLines: {
      blog: ["Actualités","Analyses","Terrain","Agenda","Médiathèque"],
      citizen: ["Déposer une réclamation","Proposer une idée","Demander un rendez-vous","Redevabilité","Engagements"],
      about: ["Parcours","Contact","Permanences","Mentions légales","Loi 09-08"],
    },
    footerTagline: "Agadir d'abord, et toujours — un espace d'écoute, d'information, de proximité et de redevabilité citoyenne.",
    footerRights: "Tous droits réservés.",
    footerSubtitle: "Conçu pour informer, écouter, expliquer et rendre compte.",
    cats: {},
  };

  const SOCIALS = [
    { label: "FB", href: "#", name: "Facebook" },
    { label: "IG", href: "#", name: "Instagram" },
    { label: "X",  href: "#", name: "X" },
    { label: "YT", href: "#", name: "YouTube" },
  ];

  /* ---------- HEADER ---------- */
  function buildHeader() {
    const mount = document.querySelector("[data-header]");
    if (!mount) return;
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = T.nav.map(n => {
      const active = n.href.toLowerCase() === here ? "active" : "";
      return `<li><a class="${active}" href="${n.href}">${n.label}</a></li>`;
    }).join("");

    const altLang = IS_AR ? `${ROOT}index.html` : `ar/index.html`;
    const langSwitch = `
      <span class="lang-switch">
        <a href="${IS_AR ? '../index.html' : 'index.html'}" class="${IS_AR ? '' : 'active'}">FR</a>
        <a href="${IS_AR ? 'index.html' : 'ar/index.html'}" class="${IS_AR ? 'active' : ''}">ع</a>
      </span>`;

    mount.innerHTML = `
      <div class="topbar">
        <div class="container">
          <div>
            <strong>${T.name}</strong>
            <span class="dot">·</span>
            <span>${T.sub}</span>
          </div>
          <div>
            <a href="reclamations.html">${T.topbarLeft1}</a>
            <span class="dot">·</span>
            <a href="contact.html">${T.topbarLeft2}</a>
          </div>
        </div>
      </div>
      <header class="header">
        <div class="container nav">
          <a class="brand" href="index.html">
            <span class="brand__logo brand__logo--img"><img src="${ROOT}assets/images/logo-rose.png" alt="USFP"></span>
            <span>
              <span class="brand__name">${T.name}</span><br>
              <span class="brand__sub">${T.sub}</span>
            </span>
          </a>
          <button class="nav__toggle" aria-label="menu" data-nav-toggle>
            <span></span><span></span><span></span>
          </button>
          <ul class="nav__menu" data-nav>
            ${links}
          </ul>
          <div class="nav__cta">
            <a class="btn btn--ghost btn--sm" href="contact.html">${T.ctaWrite}</a>
            <a class="btn btn--primary btn--sm" href="reclamations.html">${T.ctaClaim}</a>
            ${langSwitch}
          </div>
        </div>
      </header>
    `;

    const tgl = mount.querySelector("[data-nav-toggle]");
    const menu = mount.querySelector("[data-nav]");
    tgl?.addEventListener("click", () => menu.classList.toggle("open"));
  }

  /* ---------- FOOTER ---------- */
  function buildFooter() {
    const mount = document.querySelector("[data-footer]");
    if (!mount) return;
    const social = SOCIALS.map(s =>
      `<a href="${s.href}" title="${s.name}" aria-label="${s.name}">${s.label}</a>`
    ).join("");

    const blogLinks   = ["actualites.html","blog.html","terrain.html","agenda.html","mediatheque.html"];
    const citizenLinks= ["reclamations.html","reclamations.html","contact.html","redevabilite.html","engagements.html"];
    const aboutLinks  = ["a-propos.html","contact.html","contact.html","#mentions","#donnees"];

    const list = (arr, labels) =>
      arr.map((href, i) => `<li><a href="${href}">${labels[i]}</a></li>`).join("");

    mount.innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <a class="brand" href="index.html" style="color:#fff;">
              <span class="brand__logo brand__logo--img"><img src="${ROOT}assets/images/logo-rose.png" alt="USFP"></span>
              <span>
                <span class="brand__name" style="color:#fff;">${T.name}</span><br>
                <span class="brand__sub" style="color:#cfb8de;">${T.sub}</span>
              </span>
            </a>
            <p>${T.footerTagline}</p>
            <div class="footer__social">${social}</div>
          </div>
          <div>
            <h4>${T.blogFooter}</h4>
            <ul>${list(blogLinks, T.footerLines.blog)}</ul>
          </div>
          <div>
            <h4>${T.citizenFooter}</h4>
            <ul>${list(citizenLinks, T.footerLines.citizen)}</ul>
          </div>
          <div>
            <h4>${T.aboutFooter}</h4>
            <ul>${list(aboutLinks, T.footerLines.about)}</ul>
          </div>
        </div>
        <div class="container footer__bottom">
          <div>© ${new Date().getFullYear()} ${T.name} — ${T.footerRights}</div>
          <div>
            ${T.footerSubtitle}
            <span class="dot">·</span>
            <a class="discreet" href="publier.html">${IS_AR ? "النشر" : "Publier"}</a>
            <span class="dot">·</span>
            <a class="discreet" href="admin.html">${IS_AR ? "إدارة" : "Admin"}</a>
          </div>
        </div>
      </footer>
    `;
  }

  /* ---------- DATA ---------- */
  async function loadJSON(name) {
    const path = `${ROOT}data/${name}${IS_AR ? ".ar" : ""}.json`;
    try {
      const r = await fetch(path, { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      return await r.json();
    } catch (e) {
      console.warn("Could not load", path, e);
      return [];
    }
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString(IS_AR ? "ar-MA" : "fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  }
  function dayMonth(iso) {
    const d = new Date(iso);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleDateString(IS_AR ? "ar-MA" : "fr-FR", { month: "short" }).replace(".", ""),
    };
  }
  function initials(title) {
    return title.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
  }

  /* ---------- ARTICLE CARD ---------- */
  function articleCard(a) {
    const tags = (a.tags || []).slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join("");
    const img = a.image
      ? `<img src="${ROOT}${a.image}" alt="${a.title}">`
      : `<div class="ph">${initials(a.title)}</div>`;
    return `
      <article class="card">
        <div class="card__img">
          ${img}
          <span class="card__cat">${a.category}</span>
        </div>
        <div class="card__body">
          <div class="card__date">${fmtDate(a.date)}</div>
          <h3 class="card__title"><a href="article.html?id=${encodeURIComponent(a.id)}">${a.title}</a></h3>
          <p class="card__excerpt">${a.excerpt || ""}</p>
          <div class="card__tags">${tags}</div>
          <a class="card__more" href="article.html?id=${encodeURIComponent(a.id)}">${T.readMore}</a>
        </div>
      </article>
    `;
  }

  async function renderLatest() {
    const mount = document.querySelector("[data-latest]");
    if (!mount) return;
    const limit = parseInt(mount.dataset.latest || "6", 10);
    const arts = (await loadJSON("articles"))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
    mount.innerHTML = arts.map(articleCard).join("") || `<div class="empty">${T.none}</div>`;
  }

  async function renderFeatured() {
    const mount = document.querySelector("[data-featured]");
    if (!mount) return;
    const arts = await loadJSON("articles");
    const a = arts.find(x => x.featured) || arts[0];
    if (!a) { mount.innerHTML = ""; return; }
    const img = a.image
      ? `<img src="${ROOT}${a.image}" alt="${a.title}">`
      : `<div class="ph">${initials(a.title)}</div>`;
    mount.innerHTML = `
      <div class="featured">
        <div class="featured__img">${img}</div>
        <div class="featured__body">
          <span class="eyebrow">${IS_AR ? "في الواجهة" : "À la une"} · ${a.category}</span>
          <h2>${a.title}</h2>
          <p>${a.excerpt}</p>
          <p class="muted">${fmtDate(a.date)}</p>
          <div>
            <a class="btn btn--primary" href="article.html?id=${encodeURIComponent(a.id)}">${T.readMore}</a>
          </div>
        </div>
      </div>
    `;
  }

  async function renderArticlesList() {
    const mount = document.querySelector("[data-articles]");
    if (!mount) return;
    const filterMount = document.querySelector("[data-filters]");
    const searchInput = document.querySelector("[data-search]");
    const all = (await loadJSON("articles"))
      .sort((a, b) => b.date.localeCompare(a.date));

    const cats = [IS_AR ? "الكل" : "Toutes", ...Array.from(new Set(all.map(a => a.category)))];
    if (filterMount) {
      filterMount.innerHTML = cats.map((c, i) =>
        `<button class="filter ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`
      ).join("");
    }

    let activeCat = cats[0];
    let query = "";

    function paint() {
      const out = all.filter(a => {
        const okCat = activeCat === cats[0] || a.category === activeCat;
        const q = query.toLowerCase();
        const okQ = !q || (
          a.title.toLowerCase().includes(q) ||
          (a.excerpt || "").toLowerCase().includes(q) ||
          (a.tags || []).join(" ").toLowerCase().includes(q)
        );
        return okCat && okQ;
      });
      mount.innerHTML = out.length
        ? out.map(articleCard).join("")
        : `<div class="empty">${T.noMatch}</div>`;
    }

    filterMount?.addEventListener("click", (e) => {
      const t = e.target.closest(".filter");
      if (!t) return;
      filterMount.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      activeCat = t.dataset.cat;
      paint();
    });

    searchInput?.addEventListener("input", (e) => { query = e.target.value; paint(); });
    paint();
  }

  async function renderPost() {
    const mount = document.querySelector("[data-post]");
    if (!mount) return;
    const id = new URLSearchParams(location.search).get("id");
    const all = await loadJSON("articles");
    const a = all.find(x => x.id === id) || all[0];
    if (!a) { mount.innerHTML = `<div class="empty">${T.notFound}</div>`; return; }

    const tags = (a.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");
    const url = location.href;
    const shareW = `https://wa.me/?text=${encodeURIComponent(a.title + " — " + url)}`;
    const shareF = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const shareX = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.title)}`;

    const related = all
      .filter(x => x.id !== a.id && (x.category === a.category || (x.tags || []).some(t => (a.tags || []).includes(t))))
      .slice(0, 3);

    document.title = `${a.title} — ${T.name}`;

    const heroImg = a.image
      ? `<img src="${ROOT}${a.image}" alt="${a.title}">`
      : `<div class="ph">${initials(a.title)}</div>`;

    mount.innerHTML = `
      <article class="post">
        <div class="post__meta">
          <span class="post__cat">${a.category}</span>
          <span>${fmtDate(a.date)}</span>
          <span>·</span>
          <span>${T.by} ${a.author || T.name}</span>
        </div>
        <h1>${a.title}</h1>
        <p class="muted">${a.excerpt || ""}</p>
        <div class="post__hero">${heroImg}</div>
        <div class="post__body">
          ${a.content.split(/\n+/).map(p => `<p>${p}</p>`).join("")}
        </div>
        <div class="card__tags">${tags}</div>
        <div class="post__share">
          <strong>${T.share}</strong>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareW}">WhatsApp</a>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareF}">Facebook</a>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareX}">X</a>
          <a class="share-btn" href="reclamations.html?sujet=${encodeURIComponent(a.title)}">${T.sendOnSubject}</a>
        </div>
      </article>
      ${related.length ? `
        <section class="section">
          <h2>${T.relatedTitle}</h2>
          <div class="cards">${related.map(articleCard).join("")}</div>
        </section>` : ""}
    `;
  }

  async function renderAgenda() {
    const mount = document.querySelector("[data-agenda]");
    if (!mount) return;
    const limit = parseInt(mount.dataset.agenda || "10", 10);
    const items = (await loadJSON("events"))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
    if (!items.length) { mount.innerHTML = `<div class="empty">${T.noEvent}</div>`; return; }
    mount.innerHTML = `<div class="agenda">${items.map(ev => {
      const dm = dayMonth(ev.date);
      return `
        <div class="agenda__item">
          <div class="agenda__date">
            <div class="agenda__day">${dm.day}</div>
            <div class="agenda__month">${dm.month}</div>
          </div>
          <div>
            <div class="agenda__title">${ev.title}</div>
            <div class="agenda__meta">${ev.time} · ${ev.place} · ${ev.quartier}</div>
          </div>
          <div class="agenda__type">${ev.type}</div>
        </div>
      `;
    }).join("")}</div>`;
  }

  async function renderDossiers() {
    const mount = document.querySelector("[data-dossiers]");
    if (!mount) return;
    const items = await loadJSON("quartiers");
    const statusCls = (s) => {
      const k = (s || "").toLowerCase();
      if (k.includes("reçu") || k.includes("توصلنا")) return "status--info";
      if (k.includes("cours") || k.includes("suivi") || k.includes("جار") || k.includes("متابعة")) return "status--wait";
      if (k.includes("réponse") || k.includes("جواب") || k.includes("مكتمل")) return "status--ok";
      if (k.includes("signalé") || k.includes("بلّغنا")) return "status--warn";
      return "status--info";
    };
    if (!items.length) { mount.innerHTML = `<div class="empty">—</div>`; return; }

    const labels = IS_AR
      ? { sujet: "الموضوع", action: "الإجراء", date: "التاريخ" }
      : { sujet: "Sujet", action: "Action", date: "Date" };

    mount.innerHTML = `<div class="dossier">${items.map(d => `
      <div class="dossier__item">
        <div class="dossier__head">
          <div class="dossier__quartier">${d.quartier}</div>
          <span class="status ${statusCls(d.statut)}">${d.statut}</span>
        </div>
        <div class="dossier__row"><span>${labels.sujet}</span><span>${d.sujet}</span></div>
        <div class="dossier__row"><span>${labels.action}</span><span>${d.action}</span></div>
        <div class="dossier__row"><span>${labels.date}</span><span>${fmtDate(d.date)}</span></div>
      </div>
    `).join("")}</div>`;
  }

  async function renderDashboard() {
    const mount = document.querySelector("[data-dashboard]");
    if (!mount) return;
    const arts = await loadJSON("articles");
    const quartiers = await loadJSON("quartiers");
    const events = await loadJSON("events");
    const uniqQ = new Set(quartiers.map(q => q.quartier));
    const nums = [arts.length, events.length, uniqQ.size, quartiers.length];
    mount.innerHTML = `<div class="dash">${nums.map((n, i) => `
      <div class="dash__item">
        <div class="dash__num">${n}</div>
        <div class="dash__lbl">${T.dashboardLabels[i]}</div>
      </div>`).join("")}</div>`;
  }

  /* ---------- MAGAZINE LAYOUT (actualités) ---------- */
  async function renderMagazine() {
    const heroMount   = document.querySelector("[data-mag-hero]");
    const secondaryMt = document.querySelector("[data-mag-secondary]");
    const recentMt    = document.querySelector("[data-mag-recent]");
    const tagsMt      = document.querySelector("[data-mag-tags]");
    if (!heroMount && !secondaryMt && !recentMt && !tagsMt) return;

    const all = (await loadJSON("articles")).sort((a, b) => b.date.localeCompare(a.date));
    const featured = all.find(a => a.featured) || all[0];
    const others = all.filter(a => a.id !== featured?.id);

    if (heroMount && featured) {
      const img = featured.image
        ? `<img src="${ROOT}${featured.image}" alt="${featured.title}">`
        : `<div class="ph">${initials(featured.title)}</div>`;
      heroMount.innerHTML = `
        ${img}
        <div class="mag__hero__body">
          <span class="mag__hero__cat">${IS_AR ? "في الواجهة" : "À la une"} · ${featured.category}</span>
          <h2 class="mag__hero__title"><a href="article.html?id=${encodeURIComponent(featured.id)}">${featured.title}</a></h2>
          <div class="mag__hero__meta">${fmtDate(featured.date)} — ${featured.excerpt || ""}</div>
        </div>
      `;
    }

    if (secondaryMt) {
      secondaryMt.innerHTML = others.slice(0, 2).map(articleCard).join("");
    }

    if (recentMt) {
      recentMt.innerHTML = all.slice(0, 6).map(a => `
        <li>
          <a href="article.html?id=${encodeURIComponent(a.id)}">${a.title}</a>
          <span class="meta">${fmtDate(a.date)} · ${a.category}</span>
        </li>
      `).join("");
    }

    if (tagsMt) {
      const counts = {};
      all.forEach(a => (a.tags || []).forEach(t => counts[t] = (counts[t] || 0) + 1));
      const tags = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
      tagsMt.innerHTML = tags.map(([t, n]) =>
        `<a href="#" data-tag-filter="${t}">#${t} <small>(${n})</small></a>`
      ).join("");
    }

    document.querySelectorAll("[data-cat-filter]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        const cat = a.dataset.catFilter;
        const target = document.querySelector("[data-articles]");
        if (!target) return;
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        document.querySelectorAll(".filter").forEach(f => {
          f.classList.toggle("active", f.dataset.cat === cat);
        });
        target.dispatchEvent(new CustomEvent("filter", { detail: cat }));
        const filterBtn = document.querySelector(`.filter[data-cat="${cat}"]`);
        filterBtn?.click();
      });
    });
  }

  /* ---------- FORMS (localStorage + optional webhook) ---------- */
  async function wireForms() {
    document.querySelectorAll("form[data-form]").forEach(form => {
      const success = form.querySelector(".form__success");
      const endpoint = form.dataset.endpoint || form.getAttribute("action") || "";
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        const record = { ...data, _at: new Date().toISOString(), _form: form.dataset.form };

        // Always store locally for the admin view
        try {
          const key = "rm_" + (form.dataset.form || "form");
          const arr = JSON.parse(localStorage.getItem(key) || "[]");
          arr.push(record);
          localStorage.setItem(key, JSON.stringify(arr));
        } catch (_) {}

        // If a webhook endpoint is configured, POST to it
        if (endpoint && /^https?:/i.test(endpoint)) {
          try {
            await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(record),
            });
          } catch (err) { console.warn("Webhook failed:", err); }
        }

        form.reset();
        if (success) {
          success.textContent = T.success;
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => success.classList.remove("show"), 8000);
        } else {
          alert(T.success);
        }
      });
    });

    const sujet = new URLSearchParams(location.search).get("sujet");
    if (sujet) {
      const f = document.querySelector('[name="sujet"]');
      if (f) f.value = sujet;
    }
  }

  /* ---------- ADMIN VIEW ---------- */
  function renderAdmin() {
    const mount = document.querySelector("[data-admin]");
    if (!mount) return;

    const KEYS = [
      { key: "rm_reclamation", label: IS_AR ? "الشكايات" : "Réclamations" },
      { key: "rm_contact",     label: IS_AR ? "رسائل الاتصال" : "Contact" },
      { key: "rm_newsletter",  label: IS_AR ? "الاشتراكات" : "Newsletter" },
    ];

    const PASSWORD_KEY = "rm_admin_unlocked";
    const isUnlocked = sessionStorage.getItem(PASSWORD_KEY) === "1";

    const lockHTML = `
      <div class="admin__login">
        <h2>${IS_AR ? "وصول مقيَّد" : "Accès restreint"}</h2>
        <p class="muted">${IS_AR ? "أدخل كلمة السر لعرض الرسائل المُستقبَلة." : "Entrez le mot de passe pour consulter les messages reçus."}</p>
        <form class="form" id="admin-login">
          <div class="field">
            <label>${IS_AR ? "كلمة السر" : "Mot de passe"}</label>
            <input type="password" name="pw" autofocus required>
          </div>
          <div><button class="btn btn--primary" type="submit">${IS_AR ? "دخول" : "Entrer"}</button></div>
        </form>
        <p class="muted" style="margin-top:1.4rem;font-size:.78rem;">
          ${IS_AR ? "ملاحظة: هذا الوصول محلي للقراءة من المتصفح فقط. للنشر الفعلي اربط استمارة بـ Webhook." : "Note : cet accès lit uniquement les soumissions stockées localement dans ce navigateur. Pour une production, branchez le formulaire à un webhook (data-endpoint)."}
        </p>
      </div>
    `;

    function renderUnlocked() {
      const tabs = KEYS.map((k, i) => {
        const arr = JSON.parse(localStorage.getItem(k.key) || "[]");
        return `<button class="admin__tab ${i === 0 ? "active" : ""}" data-tab="${k.key}">${k.label} (${arr.length})</button>`;
      }).join("");

      mount.innerHTML = `
        <div class="admin__tabs">${tabs}</div>
        <div class="admin__bar">
          <button class="btn btn--ghost btn--sm" id="export-json" style="color:#fff;border-color:#fff;">${IS_AR ? "تصدير JSON" : "Exporter (JSON)"}</button>
          <button class="btn btn--ghost btn--sm" id="export-csv" style="color:#fff;border-color:#fff;">${IS_AR ? "تصدير CSV" : "Exporter (CSV)"}</button>
          <button class="btn btn--ghost btn--sm" id="clear-tab" style="color:#fff;border-color:#fff;">${IS_AR ? "محو هذه الفئة" : "Effacer cette catégorie"}</button>
          <button class="btn btn--ghost btn--sm" id="logout" style="color:#fff;border-color:#fff;">${IS_AR ? "خروج" : "Verrouiller"}</button>
        </div>
        <div id="admin-content"></div>
      `;

      let activeKey = KEYS[0].key;

      function paint() {
        const content = document.getElementById("admin-content");
        const items = JSON.parse(localStorage.getItem(activeKey) || "[]");
        if (!items.length) {
          content.innerHTML = `<div class="admin__empty">${IS_AR ? "لا توجد إدخالات بعد." : "Aucune entrée pour l'instant."}</div>`;
          return;
        }
        const cols = Array.from(new Set(items.flatMap(o => Object.keys(o)))).filter(c => c !== "_form");
        content.innerHTML = `
          <div style="overflow-x:auto;">
            <table class="admin__table">
              <thead><tr>${cols.map(c => `<th>${c}</th>`).join("")}</tr></thead>
              <tbody>
                ${items.slice().reverse().map(it => `
                  <tr>${cols.map(c => `<td>${(it[c] ?? "").toString().slice(0, 240)}</td>`).join("")}</tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        `;
      }

      mount.addEventListener("click", (e) => {
        const tab = e.target.closest(".admin__tab");
        if (tab) {
          activeKey = tab.dataset.tab;
          mount.querySelectorAll(".admin__tab").forEach(x => x.classList.remove("active"));
          tab.classList.add("active");
          paint();
          return;
        }
        if (e.target.id === "logout") {
          sessionStorage.removeItem(PASSWORD_KEY);
          renderAdmin();
          return;
        }
        if (e.target.id === "export-json") {
          const data = JSON.parse(localStorage.getItem(activeKey) || "[]");
          downloadBlob(JSON.stringify(data, null, 2), `${activeKey}.json`, "application/json");
          return;
        }
        if (e.target.id === "export-csv") {
          const data = JSON.parse(localStorage.getItem(activeKey) || "[]");
          downloadBlob(toCSV(data), `${activeKey}.csv`, "text/csv");
          return;
        }
        if (e.target.id === "clear-tab") {
          if (confirm(IS_AR ? "هل أنت متأكد؟" : "Confirmer la suppression ?")) {
            localStorage.removeItem(activeKey);
            paint();
            renderAdmin();
          }
        }
      });

      paint();
    }

    function downloadBlob(content, name, type) {
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
    }
    function toCSV(arr) {
      if (!arr.length) return "";
      const cols = Array.from(new Set(arr.flatMap(o => Object.keys(o))));
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      return [cols.join(","), ...arr.map(r => cols.map(c => esc(r[c])).join(","))].join("\n");
    }

    if (!isUnlocked) {
      mount.innerHTML = lockHTML;
      document.getElementById("admin-login").addEventListener("submit", (e) => {
        e.preventDefault();
        const pw = new FormData(e.target).get("pw");
        // Local-only "lock". Default password is "agadir2026" — change it in publier.html guide.
        const expected = window.RM_ADMIN_PASSWORD || "agadir2026";
        if (pw === expected) {
          sessionStorage.setItem(PASSWORD_KEY, "1");
          renderUnlocked();
        } else {
          alert(IS_AR ? "كلمة سر خاطئة" : "Mot de passe incorrect");
        }
      });
    } else {
      renderUnlocked();
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    buildHeader();
    buildFooter();
    renderLatest();
    renderFeatured();
    renderArticlesList();
    renderPost();
    renderMagazine();
    renderAgenda();
    renderDossiers();
    renderDashboard();
    renderAdmin();
    wireForms();
  });
})();
