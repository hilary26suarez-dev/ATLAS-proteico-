# Atlas Proteico NP — Biotecnología al Alcance de Todos

Atlas interactivo de proteínas esenciales en **Nutrición Parenteral (NP)**, con visualización 3D y contexto clínico en tiempo real.

## 🎯 Propósito

Conectar la biología molecular con la práctica clínica. Cada proteína en este atlas tiene una historia: cómo se metaboliza en NP, qué pasa cuando falla, y por qué importa en el cuidado crítico del paciente.

## ✨ Características Principales

- **Visualización 3D Interactiva**: Estructuras cristalográficas del RCSB PDB con múltiples representaciones (Cartoon, Space Fill, Superficie, Ball+Stick, Licorice)
- **Modo Estudiante**: Explicaciones claras, visualización cartoon, contexto clínico
- **Modo Investigador**: Datos bioinformáticos avanzados, superficies electrostáticas, ligandos, integración con AlphaFold DB
- **Biblioprote**: Panel integrado con artículos PubMed relevantes, resumen y DOI directo
- **4 Módulos Metabólicos**: Organizados por proceso (no alfabéticamente):
  - ⚡ Canal de Alimentación (transportadores)
  - 🧪 Laboratorio Hepático (enzimas)
  - 🛡️ Sistema de Defensa (inmunidad)
  - 💬 Señalización Hormonal (reguladores)
- **Human Protein Atlas**: Datos de expresión en tejidos y patología
- **Búsqueda Completa**: Por nombre, gen, función, relevancia clínica
- **Datos Abiertos**: RCSB PDB, UniProt, AlphaFold DB, PubMed, Human Protein Atlas

## 🚀 Quick Start

### Desarrollo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Build para Producción

```bash
npm run build
npm start
```

## 📦 Stack Tecnológico

- **Framework**: Next.js 16.2.7 (App Router)
- **Runtime**: React 19.2.4
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript 5 (strict mode)
- **3D Viewer**: NGL 2.0.0-dev.40 (de CDN)
- **APIs Externas**:
  - RCSB PDB (cristalografía)
  - AlphaFold DB (predicción de estructuras)
  - PubMed (artículos científicos)
  - Human Protein Atlas (expresión)

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── page.tsx              # Página de inicio con hero
│   ├── modules/              # Listado de módulos metabólicos
│   ├── buscar/               # Búsqueda de proteínas
│   ├── proteina/[proteinId]/ # Detalle de proteína
│   ├── api/hpa/[gene]/       # Proxy para Human Protein Atlas
│   └── globals.css           # Estilos globales
├── components/
│   ├── ProteinViewer3D.tsx   # Visualizador 3D (NGL)
│   ├── ProteinDetailClient.tsx # Detalle con modos
│   ├── BiblioprotePanel.tsx  # Panel con artículos PubMed
│   ├── HPAPanel.tsx          # Panel Human Protein Atlas
│   ├── SearchClient.tsx      # Búsqueda clientside
│   ├── Navbar.tsx            # Navegación
│   ├── ModeToggle.tsx        # Toggle Estudiante/Investigador
│   └── ...
└── data/
    └── protein_atlas.json    # Dataset con 48 proteínas + metadata
```

## 🔬 Novedades Recientes

### v0.2.0 (06-2026)

#### ✅ Corrección: Cambios de Representación 3D
**Problema**: Al cambiar de `Cartoon` a `Space Fill` (u otra representación), no se podía volver a la representación anterior; quedaba atrapado.

**Solución**:
- Mejorada la lógica de recuperación en `ProteinViewer3D.tsx`
- Mejor manejo de errores con try-catch y fallback
- Validación de representaciones soportadas
- `repBusy` siempre reseteado, incluso en errores

#### 🆕 Feature: Biblioprote Panel
Nuevo panel `BiblioprotePanel` integrado en el modo **Investigador** de cada proteína.

**Características**:
- Consulta automática a PubMed (API efetch)
- Muestra: **Título** (clickable) + **Abstract** (primeros 600 caracteres) + **DOI** (enlace directo)
- Fallback elegante si no hay datos
- Solo aparece en modo Investigador (dato de investigación)

**Ejemplo**: En GLUT4 muestra artículos sobre GTPasas y proteínas de señalización.

## 📋 Requisitos Previos

- Node.js ≥18.0
- npm o yarn

## 🧪 Testing y QA

Cambios probados manualmente en:
- Múltiples cambios de representación (Cartoon ↔ Space Fill ↔ Superficie)
- Panel Biblioprote cargando datos desde PubMed
- Modos Estudiante e Investigador
- Búsqueda por nombre/gen/función

## 📖 Cómo Contribuir

1. Añadir nuevas proteínas en `src/data/protein_atlas.json`
2. Actualizar módulos si es necesario
3. Revisar el contenido clínico (context NP, relevancia)
4. Testing en modo Estudiante e Investigador

**Estructura esperada de proteína en JSON**:
```json
{
  "id": "unique-id",
  "name": "SYMBOL",
  "fullName": "Nombre Completo",
  "pdbId": "4XYZ",
  "alphafoldId": "P12345",
  "uniprotId": "P12345",
  "gene": "GENE_SYMBOL",
  "pubmedId": "12345678",
  "studentSummary": "Explicación clara para estudiantes",
  "researcherNotes": "Datos bioquímicos avanzados",
  "npRelevance": "Por qué importa en NP",
  "clinicalContext": "Escenarios clínicos reales"
}
```

## 🔗 Links Útiles

- [RCSB PDB](https://www.rcsb.org/) — Cristalografía de proteínas
- [AlphaFold DB](https://alphafold.ebi.ac.uk/) — Estructuras predichas por IA
- [UniProt](https://www.uniprot.org/) — Información de proteínas
- [Human Protein Atlas](https://www.proteinatlas.org/) — Expresión en humanos
- [PubMed](https://pubmed.ncbi.nlm.nih.gov/) — Literatura científica

## 📝 Licencia

© 2026 Atlas Proteico NP — Uso educativo libre

---

**Mantener vivo**: Este proyecto crece con cada proteína, cada módulo y cada caso clínico que se documenta. Ayuda a educar sin barreras.
