# STAURANT 1.0 - Guía de Diseño Minimalista

## Paleta de Colores: Blanco & Negro

### Colores Primarios
- **Negro Principal**: `#000000`
- **Negro Oscuro**: `#1A1A1A`
- **Blanco Puro**: `#FFFFFF`
- **Gris Claro**: `#F5F5F5`

### Colores Neutrales
- **Texto**: `#000000`
- **Borde**: `#D0D0D0`

## Principios de Diseño

### 1. Minimalismo Puro
- Sin box-shadows - solo bordes claros
- Espacios en blanco generoso
- Elementos simples y limpios
- Eliminación de decoraciones innecesarias
- Contraste blanco y negro

### 2. Bordes en lugar de Sombras
- Borde gris claro (`#D0D0D0`) por defecto
- Borde negro (`#000000`) en hover para interacción
- Espesor: 1px en cards y componentes

### 3. Tipografía
- Mantener Montserrat como fuente principal
- Jerarquía clara de tamaños
- Peso: 700 para títulos, 400 para textos

### 4. Interacción
- Transiciones suaves (0.12s ease)
- Cambio de borde en hover (gris a negro)
- Escalado controlado en hover (1.05 para FAB)
- Fondo: `#FFFFFF`
- Borde: `1px solid #D0D0D0`
- Borde en hover: `1px solid #000000`
- Border-radius: `18px`
- Sin shadow

### DishCard
- Fondo: `#FFFFFF`
- Borde: `1px solid #D0D0D0`
- Borde en hover: `1px solid #000000`
- Border-radius: `14px`
- Sin shadow

### Header
- Fondo: `#FFFFFF`
- Borde: `1px solid #D0D0D0`
- Sticky position
- Sin shadow

### FAB (Floating Action Button)
- Fondo: Negro (`#000000`)
- Color texto: Blanco
- Sin shadow
- Hover scale: `1.05`

### TabBar
- Tab inactivo: Borde `#D0D0D0`, fondo blanco
- Tab activo: Fondo negro, texto blanco
- Hover: Borde cambia a negro, texto a negro

### Rating Badges (v2)

✅ Paleta de colores cambiada a blanco y negro puro  
✅ Eliminación de TODAS las box-shadows  
✅ Bordes sutiles en lugar de sombras (`#D0D0D0`)  
✅ Estados de hover con cambio de borde a negro  
✅ Actualización de overlay con transparencia  
✅ Sincronización de scrollbar al tema  
✅ Alineación completa con minimalismo blanco & negro
- Color texto: Negro (`#000000`)
- Fondo: `#F5F5F5`
- Borde: `#D0D0D8F8F8` con borde `#E0E0E0`

### Pending Tag
- Color texto: Púrpura principal
- Fondo: `#F5E8F5`
- Borde: `#E0C0E0`

## Cambios Realizados

✅ Actualización de paleta de colores CSS  
✅ Simplificación de sombras  
✅ Mejora de overlay con transparencia más sutil  
✅ Actualización de scrollbar styling  
✅ Alineación con diseño púrpura minimalista  
