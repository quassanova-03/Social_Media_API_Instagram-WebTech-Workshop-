import { prisma } from "../lib/prisma";
export async function listPosts(limit, offset) {
    const where = { isHidden: false };
    const posts = await prisma.post.findMany({
        where,
        orderBy: [
            { createdAt: "desc" },
            { id: "desc" }
        ],
        take: limit,
        skip: offset,
        include: {
            User: {
                select: {
                    id: true,
                    username: true,
                    profilePicture: true
                }
            },
            _count: {
                select: {
                    Like: true,
                    Comment: true
                }
            }
        }
    });
    const total = await prisma.post.count({ where });
    return { posts, total };
}
export async function findPost(id) {
    return prisma.post.findFirst({
        where: { id, isHidden: false },
        include: {
            User: {
                select: { id: true, username: true }
            },
            _count: {
                select: { Like: true, Comment: true }
            }
        }
    });
}
export async function listComments(postId, limit, offset) {
    return prisma.comment.findMany({
        where: { postId },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        take: limit,
        skip: offset,
        include: {
            User: {
                select: { id: true, username: true }
            }
        }
    });
}
