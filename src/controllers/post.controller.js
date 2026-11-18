import { listPosts, findPost, listComments } from "../services/post.service";
export async function getPosts(req, res) {
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    if (!Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100 ||
        !Number.isInteger(offset) ||
        offset < 0) {
        res.status(400).json({
            success: false,
            message: "limit must be 1–100 and offset must be 0 or greater"
        });
        return;
    }
    try {
        const { posts, total } = await listPosts(limit, offset);
        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                total,
                limit,
                offset
            }
        });
    }
    catch (error) {
        console.error("Failed to fetch posts:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch posts"
        });
    }
}
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function getPost(req, res) {
    const id = String(req.params.id);
    if (!uuidPattern.test(id)) {
        res.status(400).json({ success: false, message: "Invalid post ID" });
        return;
    }
    try {
        const post = await findPost(id);
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        res.json({ success: true, data: post });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch post"
        });
    }
}
export async function getComments(req, res) {
    const id = String(req.params.id);
    const limit = Number(req.query.limit ?? 10);
    const offset = Number(req.query.offset ?? 0);
    if (!uuidPattern.test(id) ||
        !Number.isInteger(limit) ||
        limit < 1 ||
        limit > 100 ||
        !Number.isInteger(offset) ||
        offset < 0) {
        res.status(400).json({
            success: false,
            message: "Invalid post ID or pagination"
        });
        return;
    }
    try {
        const post = await findPost(id);
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        const comments = await listComments(id, limit, offset);
        res.json({
            success: true,
            data: comments,
            pagination: { limit, offset }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch comments"
        });
    }
}
