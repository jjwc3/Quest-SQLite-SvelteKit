import { json } from '@sveltejs/kit';
import db from '$lib/db.js';

// GET 요청: 사용자 목록 가져오기
export const GET = () => {
    const stmt = db.prepare(`SELECT * FROM scores ORDER BY score DESC, xten DESC`);
    const users = stmt.all();
    return json(users);
};

// POST 요청: 새 사용자 추가
export const POST = async ({ request }) => {
    const { username, contact, score, xten } = await request.json();

    try {
        const stmt = db.prepare('INSERT INTO scores (username, contact, score, xten) VALUES (?, ?, ?, ?)');
        stmt.run(username, contact, score, xten);
        return json({ success: true });
    } catch (err: any) {
        return json({ error: err.message }, { status: 500 });
    }
};
