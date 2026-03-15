# ⛽ Medición de Tanques — PWA

Calculadora de volumen para tanques cilíndricos horizontales de combustible (Super, Regular y Diésel).

## 📱 Instalación como app

Esta es una **Progressive Web App (PWA)**. Puedes instalarla directamente desde el navegador:

- **Android (Chrome):** Abre la URL → menú ⋮ → *"Agregar a pantalla de inicio"*
- **iPhone (Safari):** Abre la URL → botón compartir → *"Agregar a pantalla de inicio"*
- **Escritorio (Chrome/Edge):** Aparece un ícono de instalación en la barra de direcciones

La app funciona **sin conexión a internet** después de la primera carga.

## 📂 Estructura del proyecto

```
medicion-tanques/
├── index.html          # App principal
├── manifest.json       # Configuración PWA
├── service-worker.js   # Cache offline
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## 🚀 Deploy en GitHub Pages

1. Sube todos los archivos a un repositorio en GitHub
2. Ve a **Settings → Pages**
3. En *Source*, selecciona la rama `main` y carpeta `/ (root)`
4. Guarda y espera unos segundos
5. Tu app estará en: `https://tu-usuario.github.io/nombre-repositorio/`

> ⚠️ **Importante:** GitHub Pages requiere HTTPS, lo cual es necesario para que el Service Worker funcione correctamente.

## ⚙️ Cómo funciona el cálculo

Cada tanque tiene dimensiones específicas (diámetro y largo en pulgadas). La medida ingresada se interpreta como pulgadas y octavos (ej: `65.4` = 65 y 4/8 pulgadas). Se le suman 2/8 de corrección y se calcula el volumen usando la fórmula de segmento cilíndrico horizontal:

```
V = L × [ R² × arccos((R−h)/R) − (R−h) × √(2Rh − h²) ]
```

El resultado se convierte de pulgadas³ a galones (÷ 231).
