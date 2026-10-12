"""Builds riyad-portfolio-single-file.html by inlining the CSS and JS into index.html."""
import re, pathlib
root = pathlib.Path(__file__).parent
html = (root / "index.html").read_text(encoding="utf-8")
css = (root / "css/styles.css").read_text(encoding="utf-8")
html = html.replace('<link rel="stylesheet" href="css/styles.css">', "<style>\n" + css + "</style>")
for name in ("site-config", "main"):
    js = (root / f"js/{name}.js").read_text(encoding="utf-8")
    assert "</script" not in js
    html = html.replace(f'<script src="js/{name}.js"></script>', "<script>\n" + js + "</script>")
(root / "riyad-portfolio-single-file.html").write_text(html, encoding="utf-8")
print("built", len(html) // 1024, "KB")
