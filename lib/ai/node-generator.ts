/**
 * Prompt para el Generador Dinámico de Nodos.
 * Se activa cuando el usuario solicita un tema fuera del Grafo Core.
 */
export const NODE_GENERATOR_PROMPT = `
Eres un Arquitecto de Grafos de Conocimiento. Tu tarea es expandir el Grafo de LearnOS.

**Tarea**: Dado un tema nuevo "{topic}", genera los 5-8 nodos fundamentales necesarios para dominarlo.

**Reglas**:
1. Identifica PRERREQUISITOS de otros dominios si existen (ej: "Marketing requiere Psicología Básica").
2. Define la dificultad de cada nodo (0.1 a 1.0).
3. Asegura que los nodos tengan un flujo lógico (Edge List).

**Salida (JSON)**:
{
  "new_nodes": [
    {
      "id": "slug-unico",
      "name": "Nombre legible",
      "domain": "...",
      "difficulty": 0.5,
      "prerequisites": ["id-existente-o-nuevo"]
    }
  ]
}
`;
