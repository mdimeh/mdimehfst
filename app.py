import streamlit as st
import anthropic
import base64
import json
import re
from pathlib import Path

st.set_page_config(page_title="Container & Seal Verifier", page_icon="🔍", layout="wide")

st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;600&display=swap');
:root{--bg:#0d0f14;--surface:#161a22;--border:#252b38;--accent:#00e5a0;--text:#e2e8f0;--muted:#64748b;--ok:#22c55e;--warn:#f59e0b;--err:#ef4444;}
html,body,.stApp{background:var(--bg)!important;color:var(--text)!important;font-family:'DM Sans',sans-serif;}
.title{font-family:'Space Mono',monospace;font-size:1.8rem;font-weight:700;color:var(--accent);}
.sub{color:var(--muted);font-size:0.82rem;}
.label{font-family:'Space Mono',monospace;font-size:0.62rem;color:var(--accent);letter-spacing:3px;text-transform:uppercase;margin-bottom:0.4rem;}
.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1rem 1.3rem;margin-bottom:0.6rem;}
.mono{font-family:'Space Mono',monospace;}
.badge{display:inline-block;padding:2px 8px;border-radius:20px;font-size:0.62rem;font-family:'Space Mono',monospace;font-weight:700;}
.b-ok{background:#16231e;color:var(--ok);border:1px solid #22c55e44;}
.b-err{background:#2d1515;color:var(--err);border:1px solid #ef444444;}
.b-warn{background:#2d2010;color:var(--warn);border:1px solid #f59e0b44;}
.b-na{background:#1a1f2e;color:var(--muted);border:1px solid #252b3866;}
.ibox{padding:0.5rem 1rem;border-radius:0 8px 8px 0;margin:0.25rem 0;font-family:'Space Mono',monospace;font-size:0.73rem;}
.ibox-e{background:#2d1515;border-left:3px solid var(--err);}
.ibox-g{background:#16231e;border-left:3px solid var(--ok);}
.ibox-w{background:#2d2010;border-left:3px solid var(--warn);}
.stat{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:1rem;text-align:center;}
.snum{font-family:'Space Mono',monospace;font-size:2rem;font-weight:700;line-height:1;}
.slbl{font-size:0.65rem;color:var(--muted);margin-top:0.2rem;text-transform:uppercase;letter-spacing:1px;}
.stButton>button{background:var(--accent)!important;color:#0d0f14!important;font-family:'Space Mono',monospace!important;font-weight:700!important;border:none!important;border-radius:8px!important;padding:0.6rem 2rem!important;font-size:0.85rem!important;width:100%;}
hr.d{border:none;border-top:1px solid var(--border);margin:1rem 0;}
table.detail{width:100%;border-collapse:collapse;font-size:0.75rem;margin-bottom:0.5rem;}
table.detail th{font-family:'Space Mono',monospace;font-size:0.6rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;padding:6px 10px;border-bottom:2px solid var(--border);text-align:left;background:var(--bg);}
table.detail td{padding:6px 10px;border-bottom:1px solid #1a1f2a;font-family:'Space Mono',monospace;font-size:0.73rem;vertical-align:middle;}
table.detail tr:last-child td{border-bottom:none;}
table.detail tr:hover td{background:#1a1f2a;}
.s-ok{color:var(--ok);font-weight:700;font-size:0.7rem;}
.s-err{color:var(--err);font-weight:700;font-size:0.7rem;}
.diff{color:var(--err);background:#2d1515;padding:2px 6px;border-radius:4px;font-size:0.68rem;}
</style>
""", unsafe_allow_html=True)

PROMPT = """You are a shipping document specialist. Extract ALL container numbers and seal numbers from this document.

CRITICAL RULES:

1. CONTAINER NUMBER — 4 uppercase letters + 6-7 digits. Always normalize to pure alphanumeric:
   - "FDCU0313319" → FDCU0313319
   - "FDCU 031 331/9" → FDCU0313319  (remove spaces, remove /digit check digit)
   - "BEAU5703528/40'HC/3700" → BEAU5703528  (ignore /40'HC, /3700, /3840, /20GP etc.)
   - "MSDU 583 112/0" → MSDU5831120
   OUTPUT: 4 letters + digits only, no spaces, no suffixes.

2. SEAL NUMBER — Always "EU" + 8 digits (e.g. EU26088261).
   Forms: "EU26088261", "Seal:EU26088261", "Seal: EU26088274", "CONTAINER/EU26088261"
   NEVER confuse /40'HC /3700 /3840 with seals.

3. FORMATS BY DOCUMENT TYPE:
   - Packing List: table CONTAINER / SEAL
   - SGS Report: table with spaces and check digits
   - Health Certificate: "CONTAINER/SEAL ;" semicolons
   - Certificate of Origin: containers ONLY (no seals — normal)
   - Bill of Lading: "CONTAINER/40HC/SIZE" then "Seal:EU..."

4. Blank template with no cargo → empty lists.

Return ONLY this JSON (no markdown):
{
  "document_type": "Packing List / SGS Report / Health Certificate / Certificate of Origin / Bill of Lading / Other",
  "has_seals": true or false,
  "pairs": [{"container": "FDCU0313319", "seal": "EU26088261"}],
  "containers_only": [],
  "note": ""
}"""


def to_b64(data):
    return base64.standard_b64encode(data).decode()

def extract(client, data, name):
    ext = Path(name).suffix.lower()
    if ext == ".pdf":
        content = [
            {"type": "document", "source": {"type": "base64", "media_type": "application/pdf", "data": to_b64(data)}},
            {"type": "text", "text": PROMPT}
        ]
    else:
        mt = {"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","webp":"image/webp"}.get(ext[1:], "image/jpeg")
        content = [
            {"type": "image", "source": {"type": "base64", "media_type": mt, "data": to_b64(data)}},
            {"type": "text", "text": PROMPT}
        ]
    resp = client.messages.create(model="claude-opus-4-5", max_tokens=2000,
                                   messages=[{"role": "user", "content": content}])
    raw = re.sub(r"^```[a-z]*\n?", "", resp.content[0].text.strip())
    raw = re.sub(r"\n?```$", "", raw)
    try:
        return json.loads(raw)
    except Exception:
        return {"document_type":"error","has_seals":False,"pairs":[],"containers_only":[],"note":raw[:200]}

def norm(s):
    return re.sub(r"[\s\-_./]", "", s).upper()

def build_report(results):
    seal_docs  = {f: d for f, d in results.items() if d.get("has_seals") and d.get("pairs")}
    co_docs    = {f: d for f, d in results.items() if not d.get("has_seals") and (d.get("containers_only") or d.get("pairs"))}
    empty_docs = {f: d for f, d in results.items() if not d.get("pairs") and not d.get("containers_only")}
    seal_fnames = list(seal_docs.keys())

    # container -> {fname -> seal}
    container_data = {}
    # seal -> {container -> [files]}
    seal_map = {}

    for fname, data in seal_docs.items():
        for p in data.get("pairs", []):
            c, s = norm(p["container"]), norm(p["seal"])
            container_data.setdefault(c, {})[fname] = s
            seal_map.setdefault(s, {}).setdefault(c, []).append(fname)

    all_containers = sorted(container_data.keys())
    all_seals      = sorted(seal_map.keys())

    # Container rows
    container_rows = []
    for c in all_containers:
        doc_seals    = container_data[c]
        unique_seals = list(set(doc_seals.values()))
        missing_from = [f for f in seal_fnames if f not in doc_seals]
        if len(unique_seals) == 1 and not missing_from:
            status = "OK"
        elif len(unique_seals) > 1:
            status = "SEAL_CONFLICT"
        else:
            status = "MISSING"
        container_rows.append({
            "container": c, "status": status,
            "seals_by_doc": doc_seals, "unique_seals": unique_seals,
            "present_in": list(doc_seals.keys()), "missing_from": missing_from,
        })

    # Seal rows
    seal_rows = []
    for s in all_seals:
        cont_dict = seal_map[s]
        containers = list(cont_dict.keys())
        status = "OK" if len(containers) == 1 else "CONTAINER_CONFLICT"
        seal_rows.append({
            "seal": s, "status": status,
            "containers": containers,
            "files": [f for flist in cont_dict.values() for f in flist],
        })

    # CO check
    co_issues = {}
    for fname, data in co_docs.items():
        co_c = [norm(c) for c in data.get("containers_only",[])] + [norm(p["container"]) for p in data.get("pairs",[])]
        nf = [c for c in co_c if c not in all_containers]
        ex = [c for c in all_containers if c not in co_c]
        if nf or ex:
            co_issues[fname] = {"not_in_seal_docs": nf, "missing_from_co": ex}

    ok_c  = [r for r in container_rows if r["status"] == "OK"]
    bad_c = [r for r in container_rows if r["status"] != "OK"]
    ok_s  = [r for r in seal_rows if r["status"] == "OK"]
    bad_s = [r for r in seal_rows if r["status"] != "OK"]

    total_issues = len(bad_c) + len(bad_s) + sum(
        len(v["not_in_seal_docs"]) + len(v["missing_from_co"]) for v in co_issues.values()
    )

    return dict(
        seal_fnames=seal_fnames, co_docs=list(co_docs.keys()), empty_docs=list(empty_docs.keys()),
        container_rows=container_rows, seal_rows=seal_rows,
        ok_containers=ok_c, bad_containers=bad_c,
        ok_seals=ok_s, bad_seals=bad_s,
        co_issues=co_issues, total_issues=total_issues,
        all_containers=all_containers, all_seals=all_seals,
    )


# ── UI ────────────────────────────────────────────────────────────────────────
st.markdown('<p class="title">⬡ CONTAINER & SEAL VERIFIER</p>', unsafe_allow_html=True)
st.markdown('<p class="sub">Vérification croisée intelligente — PDF texte · PDF scan · Photos</p>', unsafe_allow_html=True)

api_key = st.secrets["ANTHROPIC_API_KEY"]

st.markdown('<hr class="d">', unsafe_allow_html=True)
st.markdown('<p class="label">📂 Documents</p>', unsafe_allow_html=True)
files = st.file_uploader("", type=["pdf","jpg","jpeg","png","webp"],
                         accept_multiple_files=True, label_visibility="collapsed")
if files:
    st.markdown(f'<p style="font-size:0.78rem;color:var(--muted);">{len(files)} fichier(s) prêt(s)</p>', unsafe_allow_html=True)

st.markdown("<br>", unsafe_allow_html=True)
go = st.button("🔍  VÉRIFIER", disabled=not files)

if go:

    client = anthropic.Anthropic(api_key=api_key)
    prog = st.progress(0); stat_txt = st.empty()
    results = {}
    for i, f in enumerate(files):
        stat_txt.markdown(f'<p style="font-size:0.75rem;color:var(--muted);">⚙️ {f.name}…</p>', unsafe_allow_html=True)
        try:
            results[f.name] = extract(client, f.read(), f.name)
        except Exception as e:
            results[f.name] = {"document_type":"error","has_seals":False,"pairs":[],"containers_only":[],"note":str(e)}
        prog.progress((i+1)/len(files))
    stat_txt.empty(); prog.empty()

    report = build_report(results)
    tc = len(report["all_containers"]); ts = len(report["all_seals"])
    ok_c = len(report["ok_containers"]); bad_c = len(report["bad_containers"])
    ok_s = len(report["ok_seals"]);      bad_s = len(report["bad_seals"])
    ti = report["total_issues"]
    seal_fnames = report["seal_fnames"]

    # ── SECTION 1: Extraction par document ──────────────────────────────────
    st.markdown('<hr class="d">', unsafe_allow_html=True)
    st.markdown('<p class="label">📄 Extraction par document</p>', unsafe_allow_html=True)
    cols = st.columns(len(results))
    for col, (fname, d) in zip(cols, results.items()):
        n  = len(d.get("pairs",[])) or len(d.get("containers_only",[]))
        hs = d.get("has_seals", False)
        color = "#00e5a0" if n else "#ef4444"
        lbl = f"{n} paires" if hs else (f"{n} conteneurs" if n else "vide")
        with col:
            st.markdown(f"""<div class="stat">
            <div class="snum" style="color:{color}">{n or "—"}</div>
            <div class="slbl">{d.get('document_type','?')}</div>
            <div style="font-size:0.58rem;color:var(--muted);margin-top:0.3rem;word-break:break-all;">{fname}</div>
            <div style="margin-top:0.3rem;"><span class="badge {'b-ok' if n else 'b-na'}">{lbl}</span></div>
            </div>""", unsafe_allow_html=True)

    # ── SECTION 2: Stats globales ────────────────────────────────────────────
    st.markdown('<hr class="d">', unsafe_allow_html=True)
    st.markdown('<p class="label">📊 Résumé global</p>', unsafe_allow_html=True)
    cols = st.columns(6)
    for col, (num, lbl, color) in zip(cols, [
        (tc,   "Conteneurs total",    "#e2e8f0"),
        (ok_c, "Conteneurs ✅ OK",    "#22c55e"),
        (bad_c,"Conteneurs ❌ erreur","#ef4444" if bad_c else "#22c55e"),
        (ts,   "Scellés total",       "#e2e8f0"),
        (ok_s, "Scellés ✅ OK",       "#22c55e"),
        (bad_s,"Scellés ❌ erreur",   "#ef4444" if bad_s else "#22c55e"),
    ]):
        with col:
            st.markdown(f'<div class="stat"><div class="snum" style="color:{color}">{num}</div><div class="slbl">{lbl}</div></div>', unsafe_allow_html=True)

    # ── VERDICT ─────────────────────────────────────────────────────────────
    st.markdown("<br>", unsafe_allow_html=True)
    if ti == 0 and tc > 0:
        st.markdown("""<div style="background:#16231e;border:1px solid #22c55e44;border-radius:10px;padding:1rem 1.3rem;display:flex;align-items:center;gap:1rem;">
        <span style="font-size:1.6rem;">✅</span>
        <div><div style="font-family:'Space Mono',monospace;font-weight:700;color:#22c55e;">TOUT EST CONFORME</div>
        <div style="color:var(--muted);font-size:0.78rem;margin-top:0.2rem;">Tous les numéros correspondent parfaitement dans tous les documents.</div>
        </div></div>""", unsafe_allow_html=True)
    elif tc == 0:
        st.warning("Aucune donnée extraite.")
    else:
        st.markdown(f"""<div style="background:#2d1515;border:1px solid #ef444444;border-radius:10px;padding:1rem 1.3rem;display:flex;align-items:center;gap:1rem;">
        <span style="font-size:1.6rem;">⚠️</span>
        <div><div style="font-family:'Space Mono',monospace;font-weight:700;color:var(--err);">{ti} PROBLÈME(S) DÉTECTÉ(S)</div>
        <div style="color:var(--muted);font-size:0.78rem;">Voir le détail ci-dessous.</div></div></div>""", unsafe_allow_html=True)

    # ── SECTION 3: Tableau conteneurs ───────────────────────────────────────
    st.markdown('<hr class="d">', unsafe_allow_html=True)
    st.markdown('<p class="label">📦 Conteneurs — Liste complète</p>', unsafe_allow_html=True)

    th = "".join(f"<th>{Path(f).stem}</th>" for f in seal_fnames)
    tbl = f'<table class="detail"><thead><tr><th>#</th><th>Conteneur</th><th>N° Scellé</th><th>Statut</th>{th}</tr></thead><tbody>'
    for i, row in enumerate(report["container_rows"], 1):
        c = row["container"]
        us = row["unique_seals"]
        seal_disp = us[0] if len(us)==1 else f"⚠️ {len(us)} valeurs"
        if row["status"] == "OK":
            st_html = '<span class="s-ok">✅ OK</span>'
            cc, sc = "var(--text)", "var(--accent)"
        elif row["status"] == "SEAL_CONFLICT":
            st_html = '<span class="s-err">❌ Conflit scellé</span>'
            cc, sc = "var(--err)", "var(--err)"
        else:
            st_html = '<span class="s-err">❌ Manquant</span>'
            cc, sc = "var(--warn)", "var(--muted)"

        doc_cells = ""
        for fname in seal_fnames:
            sv = row["seals_by_doc"].get(fname, "—")
            if sv == "—":
                doc_cells += '<td style="color:var(--muted);">—</td>'
            elif len(us) > 1 and sv != us[0]:
                doc_cells += f'<td><span class="diff">{sv}</span></td>'
            else:
                doc_cells += f'<td style="color:var(--accent);">{sv}</td>'

        tbl += f'<tr><td style="color:var(--muted);">{i}</td><td style="color:{cc};font-weight:700;">{c}</td><td style="color:{sc};">{seal_disp}</td><td>{st_html}</td>{doc_cells}</tr>'

    st.markdown(tbl + "</tbody></table>", unsafe_allow_html=True)

    if report["bad_containers"]:
        st.markdown('<p class="label" style="color:var(--err);margin-top:0.8rem;">🚨 Détail des problèmes — Conteneurs</p>', unsafe_allow_html=True)
        for row in report["bad_containers"]:
            c = row["container"]
            if row["status"] == "SEAL_CONFLICT":
                seals_txt = " | ".join(f'{Path(f).stem}: <b style="color:var(--err);">{s}</b>' for f,s in row["seals_by_doc"].items())
                st.markdown(f'<div class="ibox ibox-e">❌ <b>{c}</b> — Numéros de scellé différents:<br><span style="font-size:0.7rem;">{seals_txt}</span></div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="ibox ibox-w">⚠️ <b>{c}</b> — Absent de: {" · ".join(row["missing_from"])}</div>', unsafe_allow_html=True)

    # ── SECTION 4: Tableau scellés ───────────────────────────────────────────
    st.markdown('<hr class="d">', unsafe_allow_html=True)
    st.markdown('<p class="label">🔒 Scellés — Liste complète</p>', unsafe_allow_html=True)

    tbl2 = '<table class="detail"><thead><tr><th>#</th><th>N° Scellé</th><th>Conteneur associé</th><th>Statut</th><th>Documents</th></tr></thead><tbody>'
    for i, row in enumerate(report["seal_rows"], 1):
        s = row["seal"]
        if row["status"] == "OK":
            st_html = '<span class="s-ok">✅ OK</span>'
            sc = "var(--accent)"
            c_disp = row["containers"][0]
        else:
            st_html = '<span class="s-err">❌ Conflit</span>'
            sc = "var(--err)"
            c_disp = " / ".join(f'<span class="diff">{c}</span>' for c in row["containers"])
        files_txt = " · ".join(Path(f).stem for f in set(row["files"]))
        tbl2 += f'<tr><td style="color:var(--muted);">{i}</td><td style="color:{sc};font-weight:700;">{s}</td><td>{c_disp}</td><td>{st_html}</td><td style="font-size:0.65rem;color:var(--muted);">{files_txt}</td></tr>'

    st.markdown(tbl2 + "</tbody></table>", unsafe_allow_html=True)

    if report["bad_seals"]:
        st.markdown('<p class="label" style="color:var(--err);margin-top:0.8rem;">🚨 Détail des problèmes — Scellés</p>', unsafe_allow_html=True)
        for row in report["bad_seals"]:
            st.markdown(f'<div class="ibox ibox-e">❌ Scellé <b>{row["seal"]}</b> lié à plusieurs conteneurs: {" | ".join(f"<b style=\'color:var(--err);\'>{c}</b>" for c in row["containers"])}</div>', unsafe_allow_html=True)

    # CO issues
    if report["co_issues"]:
        st.markdown('<hr class="d">', unsafe_allow_html=True)
        st.markdown('<p class="label" style="color:var(--warn);">⚠️ Écarts — Certificat d\'Origine</p>', unsafe_allow_html=True)
        for fname, info in report["co_issues"].items():
            for c in info["not_in_seal_docs"]:
                st.markdown(f'<div class="ibox ibox-e">❌ <b>{c}</b> présent dans CO mais absent des autres documents</div>', unsafe_allow_html=True)
            for c in info["missing_from_co"]:
                st.markdown(f'<div class="ibox ibox-w">⚠️ <b>{c}</b> absent du Certificat d\'Origine</div>', unsafe_allow_html=True)

    # ── EXPORT ───────────────────────────────────────────────────────────────
    st.markdown('<hr class="d">', unsafe_allow_html=True)
    lines = [
        "RAPPORT DE VÉRIFICATION — CONTENEURS & SCELLÉS",
        "="*60,"",
        f"Documents analysés : {len(files)}",
        f"Total conteneurs   : {tc}  (✅ {ok_c} OK  |  ❌ {bad_c} problèmes)",
        f"Total scellés      : {ts}  (✅ {ok_s} OK  |  ❌ {bad_s} problèmes)",
        f"Problèmes détectés : {ti}","",
        "LISTE DES CONTENEURS","-"*60,
    ]
    for row in report["container_rows"]:
        seal = row["unique_seals"][0] if row["unique_seals"] else "?"
        flag = "✅" if row["status"]=="OK" else "❌"
        lines.append(f"  {flag}  {row['container']}  →  Scellé: {seal}  [{row['status']}]")
        if row["status"] == "SEAL_CONFLICT":
            for f,s in row["seals_by_doc"].items():
                lines.append(f"        {Path(f).stem}: {s}")
    lines += ["","LISTE DES SCELLÉS","-"*60]
    for row in report["seal_rows"]:
        flag = "✅" if row["status"]=="OK" else "❌"
        lines.append(f"  {flag}  {row['seal']}  →  Conteneur: {row['containers'][0] if row['containers'] else '?'}  [{row['status']}]")
        if row["status"] != "OK":
            lines.append(f"        ⚠️ Conteneurs en conflit: {', '.join(row['containers'])}")
    if report["bad_containers"] or report["bad_seals"]:
        lines += ["","PROBLÈMES DÉTECTÉS","-"*60]
        for row in report["bad_containers"]:
            lines.append(f"  CONTENEUR {row['container']}: {row['status']}")
            if row["status"]=="SEAL_CONFLICT":
                for f,s in row["seals_by_doc"].items():
                    lines.append(f"    {Path(f).stem} → {s}")
        for row in report["bad_seals"]:
            lines.append(f"  SCELLÉ {row['seal']}: associé à {', '.join(row['containers'])}")

    st.download_button("⬇  Télécharger le rapport complet", "\n".join(lines), "rapport_verification.txt", "text/plain")
