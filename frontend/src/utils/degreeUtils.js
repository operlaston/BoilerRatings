export const aggregateCoreRequirementsIntoArray = (majors) => {
  let userAllCoreRequirements = [];

  majors.forEach(major => {
    const coreRequirements = major.requirements.filter((req) => req.name.includes("Core"));
    coreRequirements.forEach(core => {
      const filteredSubrequirements = core.subrequirements.filter((subreq) => subreq.courses.length === 1);
      filteredSubrequirements.forEach(subreq => {
        userAllCoreRequirements.push(subreq.courses[0]);
      });
    });
  });

  return userAllCoreRequirements;
};
