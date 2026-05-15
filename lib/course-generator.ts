
import { groq } from './groq';
import { Course, Module, Lesson } from './types';


/**
 * Stage 1: Decomposition Layer
 * Performs a cognitive topography of the topic.
 */
async function decomposeTopic(topic: string) {
  const prompt = `
    Analyze the topic: "${topic}" for a Learning Operating System (LearnOS).
    Identify the deep structural prerequisites and the ideal learning trajectory.
    
    Return ONLY a JSON object:
    {
      "taxonomy": ["concept 1", "concept 2", ...],
      "difficulty_model": "linear" | "adaptive",
      "estimated_duration": number,
      "assessment_strategy": {
        "frequency": "per_lesson" | "per_module",
        "type": "quiz" | "project" | "mixed"
      }
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

/**
 * Stage 2: Structural Pipeline
 * Designs the module sequence and dependency graph.
 */
async function structureCurriculum(topic: string, analysis: any) {
  const prompt = `
    Topic: ${topic}
    Analysis: ${JSON.stringify(analysis)}
    
    Task: Design a sequenced module pipeline. 
    Sequencing must follow strict pedagogical dependencies.
    
    Return ONLY a JSON object:
    {
      "title": "Strict Course Title",
      "description": "High-density overview",
      "modules": [
        {
          "id": "m1",
          "title": "Module Title",
          "difficulty": number (1-10)
        }
      ],
      "dependency_graph": [
        { "from": "m1", "to": "m2", "type": "requires" }
      ]
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

/**
 * Stage 3: Content Compiler
 * Generates the lesson granularity and pedagogical reasoning.
 */
async function compileCourse(topic: string, skeleton: any, analysis: any): Promise<Course> {
  const prompt = `
    Topic: ${topic}
    Skeleton: ${JSON.stringify(skeleton)}
    Analysis: ${JSON.stringify(analysis)}

    Task: Compile the full executable course program according to the LearnOS CORE SPECIFICATION.
    
    Constraint: Lesson types must be strictly "concept", "practice", or "assessment".
    Each lesson must include "pedagogical_reasoning".
    
    Return ONLY a JSON object conforming to the MANDATORY SCHEMA:
    {
      "topic": "${topic}",
      "title": "${skeleton.title}",
      "description": "${skeleton.description}",
      "difficulty_model": "${analysis.difficulty_model}",
      "estimated_duration": ${analysis.estimated_duration},
      "modules": [
        {
          "id": "module-id",
          "title": "Module Title",
          "difficulty": number,
          "lessons": [
            {
              "id": "lesson-id",
              "title": "Lesson Title",
              "type": "concept" | "practice" | "assessment",
              "prerequisites": ["list of lesson ids"],
              "content_spec": {
                "explanation_required": boolean,
                "example_required": boolean,
                "exercise_required": boolean
              },
              "pedagogical_reasoning": "Explicit string explaining why this lesson exists"
            }
          ]
        }
      ],
      "assessment_strategy": ${JSON.stringify(analysis.assessment_strategy)},
      "dependency_graph": ${JSON.stringify(skeleton.dependency_graph)}
    }
  `;

  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    response_format: { type: "json_object" },
  });

  const raw = JSON.parse(response.choices[0]?.message?.content || "{}");
  
  return {
    id: Math.random().toString(36).substring(7),
    ...raw,
    metadata: {
      generated_at: new Date().toISOString(),
      pipeline_version: "3.0-production-compiler"
    }
  } as Course;
}

export async function generateCourse(topic: string): Promise<Course> {
  try {
    console.log("[Compiler] Stage 1: Decomposition...");
    const analysis = await decomposeTopic(topic);
    
    console.log("[Compiler] Stage 2: Structural Pipeline...");
    const skeleton = await structureCurriculum(topic, analysis);
    
    console.log("[Compiler] Stage 3: Compilation...");
    const course = await compileCourse(topic, skeleton, analysis);
    
    return course;
  } catch (error) {
    console.error("Compilation Pipeline Failure:", error);
    throw new Error("Learning Compiler failed to synthesize the program.");
  }
}

/**
 * Adaptive Re-generation: Repairs the course based on detected gaps.
 */
export async function repairCoursePath(course: Course, gaps: string[]): Promise<Course> {
  const prompt = `
    The user is struggling with these concepts: ${JSON.stringify(gaps)}.
    Current Course: "${course.title}".
    
    Task: Re-compile the remaining course structure to address these gaps.
    1. Keep the core objective.
    2. Add a new "Remediation Module" or modify existing lessons to specifically target the gaps.
    3. Update the knowledge graph to show how the remediation connects to the overall goal.

    Return the FULL updated Course object in JSON.
  `;

  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const updatedCourse = JSON.parse(response.choices[0]?.message?.content || "{}");
    return {
      ...updatedCourse,
      metadata: {
        ...course.metadata,
        last_recompiled: new Date().toISOString(),
        recompilation_reason: "Gap remediation"
      }
    };
  } catch (error) {
    console.error("Recompilation Error:", error);
    return course; // Fallback to original
  }
}
