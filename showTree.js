// showTree.js
const fs = require('fs');
const path = require('path');

function printTree(dir, prefix = "") {
  const items = fs.readdirSync(dir);
  items.forEach((item, index) => {
    const fullPath = path.join(dir, item);
    const isLast = index === items.length - 1;
    const isDir = fs.lstatSync(fullPath).isDirectory();
    const connector = isLast ? "└── " : "├── ";

    console.log(prefix + connector + item);

    if (isDir) {
      printTree(fullPath, prefix + (isLast ? "    " : "│   "));
    }
  });
}

// 📍 Point d'entrée : src/ (modifie ici si besoin)
const startDir = path.join(__dirname, 'src');
console.log("📁 Arborescence de /src :\n");
printTree(startDir);
