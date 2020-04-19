const db = require("../db-config");

module.exports = {
  find,
  findById,
  add,
};

function find() {
  return db("project");
}

function findById(id) {
  return db("project")
    .where({ id })
    .first()
    .then(async (project) => {
      const project_id = project.id;

      // find tasks for project_id
      const tasks = await db("task")
        .where({ project_id })
        .select("id", "description", "notes", "completed");

      //find resources for project_id
      const resources = await db("project_resource")
        .where({ project_id })
        .join("resource", "project_resource.resource_id", "resource.id")
        .join("project", "project.id", "project_resource.project_id")
        .select("resource.id", "resource.name", "resource.description");

      return { ...project, tasks, resources };
    });
}

function add(projectData) {
  return db("project")
    .insert(projectData)
    .then(([id]) => db("project").where({ id }).first());
}
