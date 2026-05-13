export const UNIVERSAL_SKILL_GRAPH = {
  "version": "0.2",
  "name": "Learning OS - Skill Graph General",
  "description": "Grafo de conocimiento extensible para cualquier tema",
  "nodes": [
    {
      "id": "js-fundamentals",
      "name": "Fundamentos de JavaScript",
      "domain": "Frontend Web",
      "difficulty": 0.1,
      "type": "concept",
      "prerequisites": []
    },
    {
      "id": "js-closures",
      "name": "Closures y Scope Avanzado",
      "domain": "Frontend Web",
      "difficulty": 0.45,
      "type": "concept",
      "prerequisites": ["js-fundamentals"]
    },
    {
      "id": "python-basics",
      "name": "Fundamentos de Python",
      "domain": "Python",
      "difficulty": 0.1,
      "type": "concept",
      "prerequisites": []
    },
    {
      "id": "linear-algebra",
      "name": "Álgebra Lineal Básica",
      "domain": "Matemáticas",
      "difficulty": 0.3,
      "type": "concept",
      "prerequisites": []
    }
  ]
};
