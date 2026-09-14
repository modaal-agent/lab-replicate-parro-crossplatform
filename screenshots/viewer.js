// Builds the page of a screenshots/index-<device>.html file from manifest.js (spec 001 §17.5): one table row per
// screenshot name found in the folders of the page's device, a native-swift folder on the left and an
// ionic-capacitor folder on the right, shown side by side or overlaid with a divider that can be dragged.
//
// The page sets <body data-device="…">, and may set data-left and data-right to a folder or a folder prefix to
// choose the columns when the URL has no ?left= or ?right=.
(() => {
  "use strict";

  const FOLDERS = window.SCREENSHOTS;
  const PARTS = window.SCREENSHOT_PARTS;
  const LEFT_BUILD = "native-swift";
  const RIGHT_BUILD = "ionic-capacitor";
  const SURFACES = ["home", "calendar", "chat", "settings"];

  const body = document.body;
  const device = body.dataset.device;

  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value == null || value === false) continue;
      if (key === "class") node.className = value;
      else if (key === "style") node.style.cssText = value;
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter((child) => child != null && child !== false));
    return node;
  }

  if (!FOLDERS || !PARTS) {
    body.append(el("p", {}, "manifest.js did not load. Run ./screenshots/build-index.sh."));
    return;
  }

  // Spec 001 §17.2: remove -v<N> from the end, match a build name at the start, give each remaining value to the
  // part whose list holds it. Values in no list are the device; no device value means the iPhone.
  function parse(name) {
    const match = name.match(/^(.*)-v(\d+)$/);
    if (!match) return null;
    const prefix = match[1];
    const build = PARTS.builds.find((b) => prefix === b || prefix.startsWith(`${b}-`));
    if (!build) return null;
    const values = prefix.slice(build.length).split("-").filter(Boolean);
    const style = values.find((v) => PARTS.styles.includes(v)) || "";
    const appearance = values.find((v) => PARTS.appearances.includes(v)) || "";
    const deviceValue = values.filter((v) => v !== style && v !== appearance).join("-") || "iphone";
    return { name, prefix, version: Number(match[2]), build, style, appearance, device: deviceValue };
  }

  const folders = Object.keys(FOLDERS).map(parse).filter(Boolean);
  const devices = [...new Set(folders.map((f) => f.device))].sort((a, b) =>
    a === "iphone" ? -1 : b === "iphone" ? 1 : a.localeCompare(b));

  function versionsOf(prefix) {
    return folders.filter((f) => f.prefix === prefix).sort((a, b) => b.version - a.version);
  }

  // A choice is a folder name, a folder prefix, or "". A prefix takes each screenshot from the highest version that
  // has it, as spec 001 §17.2 says a later version holds only the screens retaken in its round.
  function isChoice(value) {
    return value === "" || Boolean(FOLDERS[value]) || folders.some((f) => f.prefix === value);
  }

  function resolve(choice, screen) {
    if (!choice) return null;
    const candidates = FOLDERS[choice] ? folders.filter((f) => f.name === choice) : versionsOf(choice);
    for (const folder of candidates) {
      const size = FOLDERS[folder.name][screen];
      if (size) {
        return { folder: folder.name, path: `${folder.name}/${screen}.png`, width: size[0], height: size[1] };
      }
    }
    return null;
  }

  function label(choice) {
    if (!choice) return "none";
    if (FOLDERS[choice]) return choice;
    const versions = versionsOf(choice);
    if (versions.length === 1) return versions[0].name;
    return `${choice}, v${versions.map((v) => v.version).join(" then v")}`;
  }

  function defaultChoice(build, style) {
    const own = folders.filter((f) => f.build === build && f.device === device && !f.appearance);
    const pick = own.find((f) => f.style === style) || own[0];
    return pick ? pick.prefix : "";
  }

  const params = new URLSearchParams(location.search);
  const fromUrl = (key) => (params.has(key) && isChoice(params.get(key)) ? params.get(key) : null);
  const fromPage = (key) => (key in body.dataset && isChoice(body.dataset[key]) ? body.dataset[key] : null);
  const state = {
    mode: params.get("mode") === "split" ? "split" : "side",
    left: fromUrl("left") ?? fromPage("left") ?? defaultChoice(LEFT_BUILD, ""),
    right: fromUrl("right") ?? fromPage("right") ?? defaultChoice(RIGHT_BUILD, "matched"),
  };

  function surfaceIndex(screen) {
    const index = SURFACES.indexOf(screen.split("-")[0]);
    return index < 0 ? SURFACES.length : index;
  }
  const screens = [...new Set(folders.filter((f) => f.device === device).flatMap((f) => Object.keys(FOLDERS[f.name])))]
    .sort((a, b) => surfaceIndex(a) - surfaceIndex(b) || a.localeCompare(b));

  // Navigation between the device pages; the view mode carries over.
  const nav = el("nav", { class: "devices", "aria-label": "Devices" });
  function renderNav() {
    const query = state.mode === "split" ? "?mode=split" : "";
    nav.replaceChildren(...devices.map((d) =>
      el("a", { href: `index-${d}.html${query}`, "aria-current": d === device ? "page" : null }, d)));
  }

  // Toolbar.
  function folderSelect(build, chosen) {
    const select = el("select");
    select.append(el("option", { value: "" }, "none"));
    const group = (title, list) => {
      const optgroup = el("optgroup", { label: title });
      for (const prefix of [...new Set(list.map((f) => f.prefix))].sort()) {
        optgroup.append(el("option", { value: prefix }, label(prefix)));
        const versions = versionsOf(prefix);
        if (versions.length > 1) for (const v of versions) optgroup.append(el("option", { value: v.name }, v.name));
      }
      return optgroup;
    };
    const own = folders.filter((f) => f.build === build && f.device === device);
    const other = folders.filter((f) => f.build === build && f.device !== device);
    if (own.length) select.append(group(device, own));
    if (other.length) select.append(group("other devices", other));
    select.value = chosen;
    return select;
  }

  const modeSwitch = el("div", { class: "segmented", role: "radiogroup", "aria-label": "View" },
    ...[["side", "Side by side"], ["split", "Split"]].map(([value, text]) =>
      el("label", {}, el("input", { type: "radio", name: "mode", value, checked: state.mode === value }), el("span", {}, text))));
  const leftSelect = folderSelect(LEFT_BUILD, state.left);
  const rightSelect = folderSelect(RIGHT_BUILD, state.right);
  const toolbar = el("div", { class: "toolbar" },
    modeSwitch,
    el("label", {}, "Left", leftSelect),
    el("label", {}, "Right", rightSelect),
    el("span", { class: "count" }, `${screens.length} screens`));

  const table = el("table", { class: "shots" });

  // Cells.
  function missing(text, other) {
    const ratio = other ? other.width / other.height : 3 / 4;
    return el("div", { class: "missing", style: `--ar: ${ratio}` }, text);
  }

  function missingText(choice, screen) {
    return choice ? `No ${screen}.png in ${label(choice)}` : "No folder chosen";
  }

  function shot(own, other, choice, screen) {
    if (!own) return missing(missingText(choice, screen), other);
    return el("figure", { class: "shot" },
      el("a", { href: own.path, target: "_blank", title: "Open at full size" },
        el("img", { src: own.path, width: own.width, height: own.height, loading: "lazy", alt: `${screen}, ${own.folder}` })),
      el("figcaption", { class: "caption" }, `${own.folder} · ${own.width} × ${own.height} px`));
  }

  function split(left, right, screen) {
    if (!left || !right) {
      const text = !left && !right
        ? `${missingText(state.left, screen)}; ${missingText(state.right, screen)}`
        : `${left ? missingText(state.right, screen) : missingText(state.left, screen)}; the other side is shown alone`;
      return el("div", {}, el("p", { class: "note" }, text), left || right ? shot(left || right, null, "", screen) : null);
    }

    const divider = el("div", {
      class: "divider", role: "slider", tabindex: 0,
      "aria-label": `Divider between ${left.folder} and ${right.folder}`,
      "aria-valuemin": 0, "aria-valuemax": 100,
    }, el("span", { class: "knob", "aria-hidden": "true" }, "◀▶"));
    const box = el("div", { class: "split", style: `--ar: ${left.width / left.height}` },
      el("img", { class: "left", src: left.path, alt: `${screen}, ${left.folder}`, loading: "lazy", draggable: "false" }),
      el("img", { class: "right", src: right.path, alt: `${screen}, ${right.folder}`, loading: "lazy", draggable: "false" }),
      el("span", { class: "tag left" }, left.folder),
      el("span", { class: "tag right" }, right.folder),
      divider);

    let position = 50;
    const set = (value) => {
      position = Math.max(0, Math.min(100, value));
      box.style.setProperty("--pos", `${position}%`);
      divider.setAttribute("aria-valuenow", Math.round(position));
      divider.setAttribute("aria-valuetext", `${Math.round(position)}% ${left.folder}`);
    };
    set(position);

    const follow = (event) => {
      const rect = box.getBoundingClientRect();
      set(((event.clientX - rect.left) / rect.width) * 100);
    };
    box.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      // On touch, only the divider starts a drag, so a swipe over the picture scrolls the page.
      if (event.pointerType === "touch" && !divider.contains(event.target)) return;
      event.preventDefault();
      divider.focus({ preventScroll: true });
      box.setPointerCapture(event.pointerId);
      follow(event);
    });
    box.addEventListener("pointermove", (event) => {
      if (box.hasPointerCapture(event.pointerId)) follow(event);
    });
    const release = (event) => {
      if (box.hasPointerCapture(event.pointerId)) box.releasePointerCapture(event.pointerId);
    };
    box.addEventListener("pointerup", release);
    box.addEventListener("pointercancel", release);
    divider.addEventListener("keydown", (event) => {
      const step = event.shiftKey ? 10 : 2;
      const next = {
        ArrowLeft: position - step, ArrowDown: position - step,
        ArrowRight: position + step, ArrowUp: position + step,
        Home: 0, End: 100,
      }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      set(next);
    });

    const sizes = left.width === right.width && left.height === right.height
      ? `${left.width} × ${left.height} px`
      : `${left.width} × ${left.height} px and ${right.width} × ${right.height} px`;
    return el("figure", {},
      box,
      el("figcaption", { class: "caption" },
        el("a", { href: left.path, target: "_blank" }, left.folder), " ◀ ▶ ",
        el("a", { href: right.path, target: "_blank" }, right.folder), ` · ${sizes}`));
  }

  function renderTable() {
    const head = state.mode === "split"
      ? el("tr", {}, el("th", { scope: "col" }, "screen"),
        el("th", { scope: "col", colspan: 2 }, `left of the divider: ${label(state.left)}; right: ${label(state.right)}`))
      : el("tr", {}, el("th", { scope: "col" }, "screen"),
        el("th", { scope: "col" }, label(state.left)),
        el("th", { scope: "col" }, label(state.right)));
    const rows = screens.map((screen) => {
      const left = resolve(state.left, screen);
      const right = resolve(state.right, screen);
      const name = el("td", { class: "name" }, el("code", {}, screen));
      if (state.mode === "split") {
        return el("tr", { "data-screen": screen }, name, el("td", { class: "pair", colspan: 2 }, split(left, right, screen)));
      }
      return el("tr", { "data-screen": screen }, name,
        el("td", {}, shot(left, right, state.left, screen)),
        el("td", {}, shot(right, left, state.right, screen)));
    });
    table.replaceChildren(
      el("colgroup", {}, el("col", { class: "name" }), el("col"), el("col")),
      el("thead", {}, head),
      el("tbody", {}, ...rows));
  }

  // Re-renders and keeps the first row below the toolbar at the same place on screen.
  function update() {
    const toolbarBottom = toolbar.getBoundingClientRect().bottom;
    const anchor = [...table.querySelectorAll("tbody tr")].find((row) => row.getBoundingClientRect().bottom > toolbarBottom);
    const anchorTop = anchor ? anchor.getBoundingClientRect().top : 0;

    try {
      const query = new URLSearchParams();
      if (state.mode === "split") query.set("mode", "split");
      query.set("left", state.left);
      query.set("right", state.right);
      history.replaceState(null, "", `?${query}`);
    } catch {
      // Some browsers refuse history changes on file:// pages; the page works without them.
    }

    renderNav();
    renderTable();

    if (anchor) {
      const row = table.querySelector(`tr[data-screen="${anchor.dataset.screen}"]`);
      if (row) window.scrollBy(0, row.getBoundingClientRect().top - anchorTop);
    }
  }

  modeSwitch.addEventListener("change", (event) => { state.mode = event.target.value; update(); });
  leftSelect.addEventListener("change", () => { state.left = leftSelect.value; update(); });
  rightSelect.addEventListener("change", () => { state.right = rightSelect.value; update(); });

  const header = document.querySelector("header");
  body.prepend(nav);
  const main = el("main", {}, toolbar, table);
  if (header) header.after(main); else nav.after(main);
  renderNav();
  renderTable();
})();
