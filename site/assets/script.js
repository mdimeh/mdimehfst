/* =========================================================
   Dr. Raja Messou — blog citoyen | JS
   - Shared header / footer
   - Article rendering (cards, single post, filters)
   - Agenda rendering
   - Dossiers terrain
   - Forms (réclamations, contact, newsletter)
   ========================================================= */

(function () {
  "use strict";

  const SITE = {
    name: "Dr. Raja Messou",
    tagline: "Agadir d'abord, et toujours",
    sub: "Blog citoyen · Agadir · Proximité · Redevabilité",
    email: "contact@rajamessou.ma",
    phone: "+212 (0) 5 28 — — — —",
    whatsapp: "212600000000",
    address: "Permanence citoyenne, Agadir",
    socials: [
      { label: "FB", href: "#", name: "Facebook" },
      { label: "IG", href: "#", name: "Instagram" },
      { label: "X",  href: "#", name: "X" },
      { label: "YT", href: "#", name: "YouTube" },
    ],
  };

  const NAV = [
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
  ];

  /* ---------- HEADER ---------- */
  function buildHeader() {
    const mount = document.querySelector("[data-header]");
    if (!mount) return;
    const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const links = NAV.map(n => {
      const active = n.href.toLowerCase() === here ? "active" : "";
      return `<li><a class="${active}" href="${n.href}">${n.label}</a></li>`;
    }).join("");

    mount.innerHTML = `
      <div class="topbar">
        <div class="container">
          <div>
            <strong>${SITE.name}</strong>
            <span class="dot">·</span>
            <span>${SITE.sub}</span>
          </div>
          <div>
            <a href="reclamations.html">Déposer une remarque</a>
            <span class="dot">·</span>
            <a href="contact.html">Demander un rendez-vous</a>
          </div>
        </div>
      </div>
      <header class="header">
        <div class="container nav">
          <a class="brand" href="index.html">
            <span class="brand__logo">RM</span>
            <span>
              <span class="brand__name">Dr. Raja Messou</span><br>
              <span class="brand__sub">Blog citoyen · Agadir</span>
            </span>
          </a>
          <button class="nav__toggle" aria-label="Ouvrir le menu" data-nav-toggle>
            <span></span><span></span><span></span>
          </button>
          <ul class="nav__menu" data-nav>
            ${links}
          </ul>
          <div class="nav__cta">
            <a class="btn btn--ghost btn--sm" href="contact.html">Écrire</a>
            <a class="btn btn--primary btn--sm" href="reclamations.html">Réclamation</a>
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
    const social = SITE.socials.map(s =>
      `<a href="${s.href}" title="${s.name}" aria-label="${s.name}">${s.label}</a>`
    ).join("");

    mount.innerHTML = `
      <footer class="footer">
        <div class="container footer__grid">
          <div class="footer__brand">
            <a class="brand" href="index.html" style="color:#fff;">
              <span class="brand__logo">RM</span>
              <span>
                <span class="brand__name" style="color:#fff;">Dr. Raja Messou</span><br>
                <span class="brand__sub" style="color:#cfb8de;">Blog citoyen · Agadir</span>
              </span>
            </a>
            <p>${SITE.tagline} — un espace d'écoute, d'information, de proximité et de redevabilité citoyenne.</p>
            <div class="footer__social">${social}</div>
          </div>
          <div>
            <h4>Le blog</h4>
            <ul>
              <li><a href="actualites.html">Actualités</a></li>
              <li><a href="blog.html">Analyses</a></li>
              <li><a href="terrain.html">Terrain</a></li>
              <li><a href="agenda.html">Agenda</a></li>
              <li><a href="mediatheque.html">Médiathèque</a></li>
            </ul>
          </div>
          <div>
            <h4>Espace citoyen</h4>
            <ul>
              <li><a href="reclamations.html">Déposer une réclamation</a></li>
              <li><a href="reclamations.html">Proposer une idée</a></li>
              <li><a href="contact.html">Demander un rendez-vous</a></li>
              <li><a href="redevabilite.html">Redevabilité</a></li>
              <li><a href="engagements.html">Engagements</a></li>
            </ul>
          </div>
          <div>
            <h4>À propos</h4>
            <ul>
              <li><a href="a-propos.html">Parcours</a></li>
              <li><a href="contact.html">Contact</a></li>
              <li><a href="contact.html">Permanences</a></li>
              <li><a href="#mentions">Mentions légales</a></li>
              <li><a href="#donnees">Loi 09-08</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer__bottom">
          <div>© ${new Date().getFullYear()} ${SITE.name} — Tous droits réservés.</div>
          <div>Conçu pour informer, écouter, expliquer et rendre compte.</div>
        </div>
      </footer>
    `;
  }

  /* ---------- DATA ---------- */
  async function loadJSON(path) {
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
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  }
  function dayMonth(iso) {
    const d = new Date(iso);
    return {
      day: String(d.getDate()).padStart(2, "0"),
      month: d.toLocaleDateString("fr-FR", { month: "short" }).replace(".", ""),
    };
  }
  function initials(title) {
    return title.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || "").join("");
  }

  /* ---------- ARTICLE CARD ---------- */
  function articleCard(a) {
    const tags = (a.tags || []).slice(0, 3).map(t => `<span class="tag">#${t}</span>`).join("");
    const img = a.image
      ? `<img src="${a.image}" alt="${a.title}">`
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
          <a class="card__more" href="article.html?id=${encodeURIComponent(a.id)}">Lire la suite</a>
        </div>
      </article>
    `;
  }

  /* ---------- LATEST ARTICLES (home) ---------- */
  async function renderLatest() {
    const mount = document.querySelector("[data-latest]");
    if (!mount) return;
    const limit = parseInt(mount.dataset.latest || "6", 10);
    const arts = (await loadJSON("data/articles.json"))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit);
    mount.innerHTML = arts.map(articleCard).join("") ||
      `<div class="empty">Aucune publication pour l'instant.</div>`;
  }

  /* ---------- FEATURED (home) ---------- */
  async function renderFeatured() {
    const mount = document.querySelector("[data-featured]");
    if (!mount) return;
    const arts = await loadJSON("data/articles.json");
    const a = arts.find(x => x.featured) || arts[0];
    if (!a) { mount.innerHTML = ""; return; }
    mount.innerHTML = `
      <div class="featured">
        <div class="featured__img"><div class="ph">${initials(a.title)}</div></div>
        <div class="featured__body">
          <span class="eyebrow">À la une · ${a.category}</span>
          <h2>${a.title}</h2>
          <p>${a.excerpt}</p>
          <p class="muted">${fmtDate(a.date)}</p>
          <div>
            <a class="btn btn--primary" href="article.html?id=${encodeURIComponent(a.id)}">Lire l'article</a>
          </div>
        </div>
      </div>
    `;
  }

  /* ---------- ALL ARTICLES + FILTERS ---------- */
  async function renderArticlesList() {
    const mount = document.querySelector("[data-articles]");
    if (!mount) return;
    const filterMount = document.querySelector("[data-filters]");
    const searchInput = document.querySelector("[data-search]");
    const all = (await loadJSON("data/articles.json"))
      .sort((a, b) => b.date.localeCompare(a.date));

    const cats = ["Toutes", ...Array.from(new Set(all.map(a => a.category)))];
    if (filterMount) {
      filterMount.innerHTML = cats.map((c, i) =>
        `<button class="filter ${i === 0 ? "active" : ""}" data-cat="${c}">${c}</button>`
      ).join("");
    }

    let activeCat = "Toutes";
    let query = "";

    function paint() {
      const out = all.filter(a => {
        const okCat = activeCat === "Toutes" || a.category === activeCat;
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
        : `<div class="empty">Aucun article ne correspond à votre recherche.</div>`;
    }

    filterMount?.addEventListener("click", (e) => {
      const t = e.target.closest(".filter");
      if (!t) return;
      filterMount.querySelectorAll(".filter").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      activeCat = t.dataset.cat;
      paint();
    });

    searchInput?.addEventListener("input", (e) => {
      query = e.target.value;
      paint();
    });

    paint();
  }

  /* ---------- SINGLE POST ---------- */
  async function renderPost() {
    const mount = document.querySelector("[data-post]");
    if (!mount) return;
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const all = await loadJSON("data/articles.json");
    const a = all.find(x => x.id === id) || all[0];
    if (!a) {
      mount.innerHTML = `<div class="empty">Article introuvable.</div>`;
      return;
    }
    const tags = (a.tags || []).map(t => `<span class="tag">#${t}</span>`).join("");
    const url = location.href;
    const shareW = `https://wa.me/?text=${encodeURIComponent(a.title + " — " + url)}`;
    const shareF = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    const shareX = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(a.title)}`;

    const related = all
      .filter(x => x.id !== a.id && (x.category === a.category || (x.tags || []).some(t => (a.tags || []).includes(t))))
      .slice(0, 3);

    document.title = `${a.title} — Dr. Raja Messou`;

    mount.innerHTML = `
      <article class="post">
        <div class="post__meta">
          <span class="post__cat">${a.category}</span>
          <span>${fmtDate(a.date)}</span>
          <span>·</span>
          <span>par ${a.author || "Dr. Raja Messou"}</span>
        </div>
        <h1>${a.title}</h1>
        <p class="muted">${a.excerpt || ""}</p>
        <div class="post__hero"><div class="ph">${initials(a.title)}</div></div>
        <div class="post__body">
          ${a.content.split(/\n+/).map(p => `<p>${p}</p>`).join("")}
        </div>
        <div class="card__tags">${tags}</div>
        <div class="post__share">
          <strong>Partager</strong>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareW}">WhatsApp</a>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareF}">Facebook</a>
          <a class="share-btn" target="_blank" rel="noopener" href="${shareX}">X</a>
          <a class="share-btn" href="reclamations.html?sujet=${encodeURIComponent(a.title)}">Envoyer une remarque sur ce sujet</a>
        </div>
      </article>
      ${related.length ? `
        <section class="section">
          <h2>À lire aussi</h2>
          <div class="cards">${related.map(articleCard).join("")}</div>
        </section>` : ""}
    `;
  }

  /* ---------- AGENDA ---------- */
  async function renderAgenda() {
    const mount = document.querySelector("[data-agenda]");
    if (!mount) return;
    const limit = parseInt(mount.dataset.agenda || "10", 10);
    const items = (await loadJSON("data/events.json"))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit);
    if (!items.length) { mount.innerHTML = `<div class="empty">Aucun événement programmé pour le moment.</div>`; return; }
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

  /* ---------- DOSSIERS TERRAIN ---------- */
  async function renderDossiers() {
    const mount = document.querySelector("[data-dossiers]");
    if (!mount) return;
    const items = await loadJSON("data/quartiers.json");
    const statusCls = (s) => {
      const k = (s || "").toLowerCase();
      if (k.includes("reçu")) return "status--info";
      if (k.includes("cours") || k.includes("suivi")) return "status--wait";
      if (k.includes("réponse")) return "status--ok";
      if (k.includes("signalé")) return "status--warn";
      return "status--info";
    };
    if (!items.length) { mount.innerHTML = `<div class="empty">Aucun dossier pour le moment.</div>`; return; }
    mount.innerHTML = `<div class="dossier">${items.map(d => `
      <div class="dossier__item">
        <div class="dossier__head">
          <div class="dossier__quartier">${d.quartier}</div>
          <span class="status ${statusCls(d.statut)}">${d.statut}</span>
        </div>
        <div class="dossier__row"><span>Sujet</span><span>${d.sujet}</span></div>
        <div class="dossier__row"><span>Action</span><span>${d.action}</span></div>
        <div class="dossier__row"><span>Date</span><span>${fmtDate(d.date)}</span></div>
      </div>
    `).join("")}</div>`;
  }

  /* ---------- DASHBOARD STATS ---------- */
  async function renderDashboard() {
    const mount = document.querySelector("[data-dashboard]");
    if (!mount) return;
    const arts = await loadJSON("data/articles.json");
    const quartiers = await loadJSON("data/quartiers.json");
    const events = await loadJSON("data/events.json");
    const uniqQ = new Set(quartiers.map(q => q.quartier));
    const stats = [
      { num: arts.length, lbl: "Articles publiés" },
      { num: events.length, lbl: "Rencontres programmées" },
      { num: uniqQ.size, lbl: "Quartiers visités" },
      { num: quartiers.length, lbl: "Dossiers suivis" },
    ];
    mount.innerHTML = `<div class="dash">${stats.map(s => `
      <div class="dash__item">
        <div class="dash__num">${s.num}</div>
        <div class="dash__lbl">${s.lbl}</div>
      </div>`).join("")}</div>`;
  }

  /* ---------- FORMS ---------- */
  function wireForms() {
    document.querySelectorAll("form[data-form]").forEach(form => {
      const success = form.querySelector(".form__success");
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        try {
          const key = "rm_" + (form.dataset.form || "form");
          const arr = JSON.parse(localStorage.getItem(key) || "[]");
          arr.push({ ...data, _at: new Date().toISOString() });
          localStorage.setItem(key, JSON.stringify(arr));
        } catch (_) {}
        form.reset();
        if (success) {
          success.classList.add("show");
          success.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => success.classList.remove("show"), 8000);
        } else {
          alert("Merci, votre message a bien été enregistré. Il sera lu et classé.");
        }
      });
    });

    // Pre-fill "sujet" on réclamations from query string
    const params = new URLSearchParams(location.search);
    const sujet = params.get("sujet");
    if (sujet) {
      const f = document.querySelector('[name="sujet"]');
      if (f) f.value = sujet;
    }
  }

  /* ---------- BOOT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    buildHeader();
    buildFooter();
    renderLatest();
    renderFeatured();
    renderArticlesList();
    renderPost();
    renderAgenda();
    renderDossiers();
    renderDashboard();
    wireForms();
  });
})();
