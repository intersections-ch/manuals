/* Progressive enhancement for the manuals site.
   Everything here decorates HTML that kramdown already produced — the page
   is readable without it, and the Markdown sources stay plain. */
(function () {
  "use strict";

  var T = window.SITE_I18N || {};
  var body = document.querySelector(".article [data-manual-body]");
  var anyBody = document.querySelector("[data-manual-body]");

  /* ---------- 1. mermaid fences -> framed panel ---------- */
  function mermaidPanels(scope) {
    if (!scope) return;
    var blocks = scope.querySelectorAll("div.language-mermaid, code.language-mermaid");
    var nodes = [];
    Array.prototype.forEach.call(blocks, function (el) {
      var host = el.closest("div.highlighter-rouge") || el.closest("pre") || el;
      var panel = document.createElement("div");
      panel.className = "diagram-panel";
      var bar = document.createElement("div");
      bar.className = "diagram-bar";
      bar.textContent = (T.diagram || "Diagram") + " · Mermaid";
      var pre = document.createElement("pre");
      pre.className = "mermaid";
      pre.textContent = el.textContent.replace(/\s+$/, "");
      panel.appendChild(bar);
      panel.appendChild(pre);
      host.replaceWith(panel);
      nodes.push(pre);
    });
    if (nodes.length) {
      window.dispatchEvent(new CustomEvent("site:mermaid-ready", { detail: nodes }));
    }
  }

  /* ---------- 2. first blockquote -> dark meta strip ---------- */
  function metaStrip() {
    if (!body) return;
    var bq = body.querySelector(":scope > blockquote");
    if (!bq) return;
    var inner = bq.querySelector("p") || bq;
    var chunks = inner.innerHTML.split("·");
    var cells = [];
    chunks.forEach(function (chunk) {
      if (/<strong>/i.test(chunk) || !cells.length) cells.push(chunk);
      else cells[cells.length - 1] += "·" + chunk;
    });

    var strip = document.createElement("div");
    strip.className = "meta-strip";
    var made = 0;

    cells.forEach(function (html) {
      var probe = document.createElement("div");
      probe.innerHTML = html.trim();
      var strong = probe.querySelector("strong");
      var label = "";
      if (strong && probe.firstElementChild === strong) {
        label = strong.textContent.replace(/:\s*$/, "");
        strong.remove();
      }
      var value = probe.innerHTML.replace(/\s+/g, " ").trim();
      if (!value && !label) return;
      var cell = document.createElement("div");
      cell.className = "meta-cell";
      if (label) {
        var l = document.createElement("span");
        l.className = "meta-label";
        l.textContent = label;
        cell.appendChild(l);
      }
      var v = document.createElement("span");
      v.className = "meta-value";
      v.innerHTML = value;
      cell.appendChild(v);
      strip.appendChild(cell);
      made++;
    });

    if (made) bq.replaceWith(strip);
  }

  /* ---------- 3. remaining blockquotes -> note boxes ---------- */
  function noteBoxes(scope) {
    if (!scope) return;
    Array.prototype.forEach.call(scope.querySelectorAll("blockquote"), function (bq) {
      var note = document.createElement("div");
      note.className = "note";
      var first = bq.querySelector("p");
      var strong = first && first.firstElementChild;
      if (strong && strong.tagName === "STRONG" && first.firstChild === strong) {
        var label = document.createElement("span");
        label.className = "note-label";
        label.textContent = strong.textContent.replace(/:\s*$/, "");
        strong.remove();
        if (first.firstChild && first.firstChild.nodeType === 3) {
          first.firstChild.nodeValue = first.firstChild.nodeValue.replace(/^\s+/, "");
        }
        note.appendChild(label);
      }
      var text = document.createElement("div");
      text.className = "note-text";
      while (bq.firstChild) text.appendChild(bq.firstChild);
      note.appendChild(text);
      bq.replaceWith(note);
    });
  }

  /* ---------- 4. link-only paragraph after an h3 -> pills ---------- */
  function stepPills(scope) {
    if (!scope) return;
    Array.prototype.forEach.call(scope.querySelectorAll("p"), function (p) {
      var prev = p.previousElementSibling;
      if (!prev || prev.tagName !== "H3") return;
      var links = p.querySelectorAll("a");
      if (!links.length) return;
      if (p.children.length !== links.length) return;
      if (p.textContent.replace(/\s+/g, "") !== Array.prototype.map.call(links, function (a) {
        return a.textContent.replace(/\s+/g, "");
      }).join("")) return;
      p.className = "step-links";
    });
  }

  /* ---------- 5. wrap each h3 run into a numbered step ---------- */
  function wrapSteps() {
    if (!body || !body.classList.contains("is-stepped")) return;
    var kids = Array.prototype.slice.call(body.children);
    var auto = 0;

    kids.forEach(function (node) {
      if (node.tagName !== "H3" || !node.parentNode) return;
      auto++;

      var num = String(auto);
      var t = node.firstChild;
      if (t && t.nodeType === 3) {
        var m = t.nodeValue.match(/^\s*(\d+)[.)]\s+/);
        if (m) {
          num = m[1];
          t.nodeValue = t.nodeValue.slice(m[0].length);
        }
      }

      var run = [];
      var sib = node.nextElementSibling;
      while (sib && sib.tagName !== "H2" && sib.tagName !== "H3") {
        run.push(sib);
        sib = sib.nextElementSibling;
      }

      var step = document.createElement("div");
      step.className = "step";
      var rail = document.createElement("div");
      rail.className = "step-rail";
      rail.innerHTML = '<span class="step-badge">' + num + '</span><span class="step-line"></span>';
      var bodyCol = document.createElement("div");
      bodyCol.className = "step-body";

      node.replaceWith(step);
      bodyCol.appendChild(node);
      run.forEach(function (el) { bodyCol.appendChild(el); });
      step.appendChild(rail);
      step.appendChild(bodyCol);
      node.dataset.step = num;
    });

    Array.prototype.forEach.call(body.querySelectorAll(".step"), function (s) {
      var next = s.nextElementSibling;
      if (!next || !next.classList.contains("step")) {
        var line = s.querySelector(".step-line");
        if (line) line.remove();
      }
    });
  }

  /* ---------- 6. code blocks: language bar + copy ---------- */
  function codeBars(scope) {
    if (!scope) return;
    Array.prototype.forEach.call(scope.querySelectorAll("div.highlighter-rouge"), function (box) {
      if (box.querySelector(".code-bar")) return;
      var lang = "";
      Array.prototype.forEach.call(box.classList, function (c) {
        if (c.indexOf("language-") === 0) lang = c.slice(9);
      });
      if (lang === "mermaid") return;
      if (lang === "plaintext" || !lang) lang = "text";

      var bar = document.createElement("div");
      bar.className = "code-bar";
      var name = document.createElement("span");
      name.className = "code-lang";
      name.textContent = lang;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.textContent = T.copy || "copy";
      bar.appendChild(name);
      bar.appendChild(btn);
      box.insertBefore(bar, box.firstChild);

      btn.addEventListener("click", function () {
        var pre = box.querySelector("pre");
        if (!pre) return;
        navigator.clipboard.writeText(pre.innerText.replace(/\s+$/, "")).then(function () {
          btn.textContent = T.copied || "copied";
          btn.classList.add("is-done");
          setTimeout(function () {
            btn.textContent = T.copy || "copy";
            btn.classList.remove("is-done");
          }, 1200);
        });
      });
    });
  }

  /* ---------- 7. sidebar TOC + scrollspy ---------- */
  function slug(s) {
    return s.toLowerCase().trim()
      .replace(/[‘’“”]/g, "")
      .replace(/[^a-z0-9à-ÿ]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section";
  }

  function buildToc() {
    var nav = document.querySelector("[data-toc]");
    if (!nav || !body) return;
    var list = nav.querySelector(".toc-list");
    var heads = body.querySelectorAll("h2, h3");
    if (heads.length < 2) return;

    var seen = {};
    var links = [];
    Array.prototype.forEach.call(heads, function (h) {
      if (!h.id) {
        var base = slug(h.textContent);
        seen[base] = (seen[base] || 0) + 1;
        h.id = seen[base] > 1 ? base + "-" + seen[base] : base;
      }
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.className = h.tagName === "H2" ? "is-h2" : "is-h3";
      a.textContent = h.dataset.step
        ? h.dataset.step + " · " + h.textContent.trim()
        : h.textContent.trim();
      list.appendChild(a);
      links.push({ a: a, h: h });
    });

    nav.hidden = false;

    if (!("IntersectionObserver" in window)) return;
    var visible = new Set();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target);
      });
      var active = null;
      for (var i = 0; i < links.length; i++) {
        if (visible.has(links[i].h)) { active = links[i]; break; }
      }
      links.forEach(function (l) { l.a.classList.toggle("is-active", l === active); });
    }, { rootMargin: "-72px 0px -70% 0px" });
    links.forEach(function (l) { io.observe(l.h); });
  }

  mermaidPanels(anyBody);
  metaStrip();
  noteBoxes(anyBody);
  stepPills(anyBody);
  wrapSteps();
  codeBars(anyBody);
  buildToc();
})();
