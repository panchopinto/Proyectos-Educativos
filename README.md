# Portafolio Privado — Liceo Bicentenario de Excelencia Polivalente San Nicolás

Repositorio público para mostrar a DAEM, SEREMI y potenciales aliados los **proyectos desarrollados y en funcionamiento** en el liceo: SIAMP (IoT piscícola), VR/AR educativo, Órtesis 3D, Hidroponía/Acuaponía, entre otros.

## Cómo publicar en GitHub Pages
1. Crea un repo (p.ej. `portafolio-privado`).
2. Sube todo el contenido de esta carpeta.
3. En **Settings → Pages**, selecciona **Deploy from branch** y elige la rama `main`, carpeta `/ (root)`.
4. La web quedará disponible en: `https://<tu-usuario>.github.io/portafolio-privado/`.

## Personalización rápida
- Edita `data/products.json` para cambiar textos, precios y enlaces.
- Reemplaza imágenes en `assets/img/` (usa el mismo nombre o actualiza las rutas).
- Para botones de pago, en `products/*.html` cambia `data-pay-*` por tus links de **Flow/MercadoPago/PayPal** o `mailto:`/WhatsApp.

## Estructura
```
index.html            # Landing + catálogo
products/*.html       # Detalle por producto (SIAMP, VR/AR, Órtesis, Hidroponía)
css/styles.css        # Estilos
js/app.js             # Lógica simple (UI y tracking)
data/products.json    # Datos de catálogo
assets/img/*          # Imágenes
```

## Autor
Profesor a cargo: **Francisco A. Pinto Aravena** — Departamento de Biología & Biotecnología. 
Con aval del Director del Liceo y del equipo PIE/INCAR (cartas disponibles bajo solicitud).
