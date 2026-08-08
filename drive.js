/* =========================================================
   INTÉGRATION GOOGLE DRIVE
   Récupère la liste des fichiers d'un dossier Drive public
   via l'API v3, puis fait correspondre chaque produit
   (product.image) au fichier du même nom.
   Si la clé API / le dossier ne sont pas configurés, ou en
   cas d'échec réseau, on retombe sur des vignettes générées
   localement (mode démo) — le site reste toujours utilisable.
   ========================================================= */

const DriveImages = (() => {
  let fileMap = {};   // nom de fichier (sans extension, minuscule) -> id Drive
  let ready = false;

  // Couleurs de repli par catégorie pour les vignettes générées
  const CATEGORY_COLORS = {
    menus: "#DA291C", burgers: "#B71F14", poulet: "#E8A800",
    snacks: "#1E8E3E", desserts: "#8E5FD9", boissons: "#1C7ED6",
    kids: "#FFC72C",
  };

  function stripExt(filename) {
    return filename.replace(/\.[a-zA-Z0-9]+$/, "").toLowerCase().trim();
  }

  async function init() {
    const { API_KEY, FOLDER_ID } = DRIVE_CONFIG;
    if (!API_KEY || !FOLDER_ID) {
      ready = true;
      return { connected: false, count: 0 };
    }
    try {
      const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
        `'${FOLDER_ID}' in parents and trashed = false`
      )}&fields=files(id,name)&key=${API_KEY}&pageSize=1000`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Drive API HTTP ${res.status}`);
      const data = await res.json();
      (data.files || []).forEach((f) => {
        fileMap[stripExt(f.name)] = f.id;
      });
      ready = true;
      return { connected: true, count: (data.files || []).length };
    } catch (err) {
      console.warn("Google Drive indisponible, mode démo activé.", err);
      ready = true;
      return { connected: false, count: 0, error: err.message };
    }
  }

  // Vignette de repli : SVG généré à la volée, avec le nom du produit
  function placeholder(label, category) {
    const color = CATEGORY_COLORS[category] || "#DA291C";
    const initials = (label || "?").slice(0, 2).toUpperCase();
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
        <rect width="400" height="400" fill="${color}"/>
        <circle cx="200" cy="170" r="90" fill="rgba(255,255,255,.15)"/>
        <text x="200" y="195" font-family="Poppins, sans-serif" font-size="70"
              font-weight="800" fill="#fff" text-anchor="middle">${initials}</text>
      </svg>`;
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function getUrl(imageKey, label, category) {
    const id = fileMap[(imageKey || "").toLowerCase()];
    if (id) {
      return `https://drive.google.com/thumbnail?id=${id}&sz=w600`;
    }
    return placeholder(label, category);
  }

  function isConnected() {
    return Object.keys(fileMap).length > 0;
  }

  return { init, getUrl, isConnected };
})();
