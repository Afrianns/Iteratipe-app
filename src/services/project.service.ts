import { prisma } from "@/lib/db";
import { InitialProjectType } from "@/types/types";

export default async function saveProject(initialProject: InitialProjectType) {
    const result = await prisma.projects.create({
        data: {
            title: initialProject.title,
            summary: initialProject.summary,
            Type: {
                connect: initialProject.type
            },
            Status: {
                connect: initialProject.status
            },
            Project_tags: {
                create: initialProject.tags
            },
            Project_tools: {
                create: initialProject.tools
            },
            visibility: initialProject.visibility,
            disable_comments: initialProject.disable_comments,
            client_name: initialProject.client_name
        }
    });

    return result;
}