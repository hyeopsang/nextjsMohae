import { NextResponse } from "next/server";
import { ResultSetHeader } from 'mysql2'; 
import pool from "../../libs/db";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('post_id');

        const db = await pool.promise().getConnection();
        let query = 'SELECT * FROM comments';
        const queryParams: any[] = [];

        if (postId) {
            query += ' WHERE post_id = ?';
            queryParams.push(postId);
        }

        const [rows] = await db.execute(query, queryParams);
        db.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const { post_id, user_id, content, user_nickname } = await request.json();

        // 필수 데이터가 제공되지 않은 경우 에러 응답
        if (!post_id || !user_id || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await pool.promise().getConnection();
        const query = 'INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)';
        const values = [post_id, user_id, content, user_nickname, new Date()]; 

        await db.execute(query, values);
        db.release();

        return NextResponse.json({ message: 'Comment added successfully!' });
    } catch (error) {
        console.error('Error adding comment:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ 
                error: 'ID is required' 
            }, { status: 400 });
        }

        const db = await pool.promise().getConnection();
        const query = 'DELETE FROM comments WHERE id = ?';
        const [result] = await db.execute<ResultSetHeader>(query, [id]);
        db.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({
                error: 'No post found with the given ID'
            }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully!' });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}

