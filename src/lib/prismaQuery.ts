import { Prisma } from "@/generated/prisma/client"

export const previewCardDataQuery = (userId: number) => {
    return {
        select: {
        uid: true,
        title: true,
        Status: true,
        Type: true,
        created_at: true,
        _count: {
            select: {
                Nodes: true,
                Bookmarks: true,
                Likes: true
            }
        },
        Users: {
            select: {
                full_name: true,
                username: true,
            }
        },
        Bookmarks: {
            where: {
                user_id: userId
            },
            take: 1,
            select: {
                project_id: true,
            }
        },
        Likes: {
            where: {
                user_id: userId
            },
            take: 1,
            select: {
                project_id: true,
            }
        },
        visibility: true,
        Nodes: {
            where: {
                AND: [
                    {image_url: { gt: ""}},
                    {title: { gt: ""}},
                    {type: { gt: ""}},
                    {start_at: { gt: new Date(0)}},
                    {end_at: { gt: new Date(0)}},
                    {content: { gt: ""}}
                ]
            },
            orderBy: {
                published_at: 'asc',
            },
            select: {
                image_url: true
            },
            take: 1
        }
        } satisfies Prisma.ProjectsSelect
    }
}
