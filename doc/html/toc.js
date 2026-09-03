const chapters = [
  { href: "index.html", label: "Daftar Chapter" },
  { href: "chapter-01-gambaran-project.html", label: "01. Gambaran Project" },
  { href: "chapter-02-persiapan-komputer.html", label: "02. Persiapan Komputer" },
  { href: "chapter-03-membuat-project-vite.html", label: "03. Membuat Project Vite" },
  { href: "chapter-04-struktur-folder.html", label: "04. Struktur Folder" },
  { href: "chapter-05-routing-layout.html", label: "05. Routing dan Layout" },
  { href: "chapter-06-authentication.html", label: "06. Login dan Proteksi" },
  { href: "chapter-07-api-service.html", label: "07. API dengan Axios" },
  { href: "chapter-08-state-management.html", label: "08. State Management" },
  { href: "chapter-09-fitur-utama.html", label: "09. Fitur Utama" },
  { href: "chapter-10-testing-build.html", label: "10. Testing dan Build" },
  { href: "chapter-11-urutan-pengerjaan.html", label: "11. Urutan Pengerjaan" },
];

function currentFileName() {
  const fileName = window.location.pathname.split("/").pop();
  return fileName || "index.html";
}

function buildSidebar() {
  const activeFile = currentFileName();
  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <h1>Project Manager Frontend</h1>
    <p>Tutorial bertahap dari awal sampai project siap dijalankan.</p>
    <nav class="nav" aria-label="Daftar isi tutorial">
      ${chapters
        .map((chapter) => {
          const activeClass = chapter.href === activeFile ? " class=\"active\"" : "";
          return `<a${activeClass} href="${chapter.href}">${chapter.label}</a>`;
        })
        .join("")}
    </nav>
  `;
  return sidebar;
}

document.addEventListener("DOMContentLoaded", () => {
  const content = document.querySelector("main.page");
  if (!content) return;

  const layout = document.createElement("div");
  layout.className = "layout";

  content.classList.remove("page");
  content.classList.add("content");

  document.body.prepend(layout);
  layout.append(buildSidebar(), content);
});
