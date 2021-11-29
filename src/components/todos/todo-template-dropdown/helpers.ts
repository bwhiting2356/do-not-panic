import { Template } from "../../../shared/template";

export const groupTemplatesByGroupName = (
  templates: Template[]
): Record<string, Template[]> => {
  return templates.reduce(
    (acc, curr) => {
      let { group } = curr;
      group = group ?? "";
      if (acc[group]) {
        acc[group].push(curr);
      } else {
        acc[group] = [curr];
      }

      return acc;
    },
    { "": [] } as Record<string, Template[]>
  );
};
