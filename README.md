#!/usr/bin/env bash
# README.sh - Fancy interactive README for Shadow-Walker360/kenya-tourism
# chmod +x README.sh && ./README.sh
# or generate Markdown: ./README.sh --generate-md

set -euo pipefail
IFS=$'\n\t'

REPO_URL="https://github.com/Shadow-Walker360/kenya-tourism"
PROJECT_NAME="kenya-tourism"
OWNER="Shadow-Walker360"
LIVE_URL="https://shadow-walker360.github.io/kenya-tourism/"

# Colors (fallback-safe)
if command -v tput >/dev/null 2>&1; then
  bold=$(tput bold); reset=$(tput sgr0)
  red=$(tput setaf 1); green=$(tput setaf 2)
  yellow=$(tput setaf 3); blue=$(tput setaf 4)
  magenta=$(tput setaf 5); cyan=$(tput setaf 6)
else
  bold="\033[1m"; reset="\033[0m"
  red="\033[31m"; green="\033[32m"; yellow="\033[33m"
  blue="\033[34m"; magenta="\033[35m"; cyan="\033[36m"
fi

hr() { printf '%*s\n' "${1:-80}" '' | tr ' ' '-'; }

print_header() {
  clear || true
  cat <<EOF
${bold}${cyan}
██╗  ██╗███████╗███╗   ██╗██╗   ██╗ █████╗     ████████╗ ██████╗ ██╗   ██╗██████╗ ██╗███████╗
██║ ██╔╝██╔════╝████╗  ██║██║   ██║██╔══██╗    ╚══██╔══╝██╔═══██╗██║   ██║██╔══██╗██║██╔════╝
█████╔╝ █████╗  ██╔██╗ ██║██║   ██║███████║       ██║   ██║   ██║██║   ██║██████╔╝██║███████╗
██╔═██╗ ██╔══╝  ██║╚██╗██║██║   ██║██╔══██║       ██║   ██║   ██║██║   ██║██╔══██╗██║╚════██║
██║  ██╗███████╗██║ ╚████║╚██████╔╝██║  ██║       ██║   ╚██████╔╝╚██████╔╝██║  ██║██║███████║
╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝╚═╝╚══════╝
${reset}
${bold}${yellow}Project:${reset} ${magenta}${PROJECT_NAME}${reset}
${bold}${yellow}Repository:${reset} ${blue}${REPO_URL}${reset}
${bold}${yellow}Live Demo:${reset} ${green}${LIVE_URL}${reset}
EOF
  hr
}

about() {
  cat <<EOF

${bold}🌍 About${reset}
Kenya Tourism is a vibrant digital showcase of Kenya 🇰🇪 — 
built purely with HTML, CSS, and JS to highlight destinations, 
heritage, and culture in a visually stunning and fast-loading format.

EOF
}

features() {
  cat <<EOF

${bold}✨ Features${reset}
- Fully static front-end (no frameworks)
- Responsive modern layout
- Lightweight and offline-friendly
- Hosted via GitHub Pages
- Interactive Bash-powered README

EOF
}

quickstart() {
  cat <<EOF

${bold}⚡ Quickstart${reset}
Clone this project:
  ${green}git clone ${REPO_URL}${reset}
  ${green}cd ${PROJECT_NAME}${reset}

Open locally:
  ${green}open index.html${reset}
  or
  ${green}python3 -m http.server${reset}

View the live hosted version:
  ${cyan}${LIVE_URL}${reset}

EOF
}

contributing() {
  cat <<EOF

${bold}🤝 Contributing${reset}
We welcome all creatives, developers, and dreamers.  
1️⃣ Fork the repo  
2️⃣ Create a branch: ${green}git checkout -b feature/amazing-addition${reset}  
3️⃣ Commit your work: ${green}git commit -m "Add new feature"${reset}  
4️⃣ Push: ${green}git push origin feature/amazing-addition${reset}  
5️⃣ Open a Pull Request 🌍  

EOF
}

generate_md() {
  local out="${1:-README.md}"
  {
    echo "# 🇰🇪 Kenya Tourism"
    echo
    echo "[![Live Demo](https://img.shields.io/badge/Visit%20Live%20Site-%F0%9F%9A%80-orange?style=for-the-badge)](${LIVE_URL})"
    echo
    echo "### A digital showcase of Kenya built with HTML, CSS, and JS."
    echo
    echo "![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)"
    echo "![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)"
    echo "![JavaScript](https://img.shields.io/badge/JavaScript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)"
    echo
    echo "[![GitHub stars](https://img.shields.io/github/stars/${OWNER}/${PROJECT_NAME}?style=social)](${REPO_URL}/stargazers)"
    echo "[![GitHub forks](https://img.shields.io/github/forks/${OWNER}/${PROJECT_NAME}?style=social)](${REPO_URL}/network/members)"
    echo "[![GitHub last commit](https://img.shields.io/github/last-commit/${OWNER}/${PROJECT_NAME}?style=flat-square)](${REPO_URL}/commits/main)"
    echo
    echo "## 🌍 About"
    echo "Kenya Tourism is a clean and responsive static site designed to promote Kenyan travel destinations."
    echo
    echo "## ✨ Features"
    echo "- Static HTML/CSS/JS build"
    echo "- Responsive design and imagery"
    echo "- Hosted via GitHub Pages"
    echo "- Minimal dependencies, instant load"
    echo
    echo "## ⚡ Quickstart"
    echo '```bash'
    echo "git clone ${REPO_URL}"
    echo "cd ${PROJECT_NAME}"
    echo "open index.html"
    echo '```'
    echo
    echo "## 🤝 Contributing"
    echo "Fork → Branch → Commit → Push → Pull Request"
    echo
    echo "## 🚀 Live Site"
    echo "${LIVE_URL}"
    echo
    echo "---"
    echo "_Built with ❤️ by [${OWNER}](${REPO_URL})_"
  } > "${out}"
  printf "${green}✅ Successfully generated ${out}${reset}\n"
}

menu() {
  cat <<EOF

${bold}📘 MENU${reset}
1) About
2) Features
3) Quickstart
4) Contributing
5) Export README.md
6) Exit

EOF
}

interactive() {
  print_header
  while true; do
    menu
    read -rp "Select option (1-6): " choice || exit 0
    hr
    case "${choice}" in
      1) about ;;
      2) features ;;
      3) quickstart ;;
      4) contributing ;;
      5)
         read -rp "Output filename (default README.md): " fname
         fname=${fname:-README.md}
         generate_md "${fname}"
         ;;
      6) echo "👋 Asante! Safari njema 🌄"; exit 0 ;;
      *) echo "${red}Invalid choice.${reset}" ;;
    esac
    hr
    read -rp "Press Enter to return to menu..." _ || true
    hr
  done
}

[[ "${1:-}" == "--generate-md" ]] && { generate_md "${2:-README.md}"; exit 0; }

interactive
