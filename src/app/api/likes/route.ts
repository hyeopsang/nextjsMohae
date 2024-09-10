import pool from "@/app/libs/db";
import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('post_id');

        const db = await pool.promise().getConnection();
        let query = 'SELECT * FROM likes';
        const queryParams: any[] = [];

        if (postId) {
            query += ' WHERE post_id = ?';
            queryParams.push(postId);
        }

        const [rows] = await db.execute(query, queryParams);
        db.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching likes:', error);
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const { user_id, user_nickname, post_id } = await request.json();

        if (!post_id || !user_id || !user_nickname) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await pool.promise().getConnection();

        // 먼저 해당 사용자의 좋아요 여부를 확인
        const checkQuery = 'SELECT * FROM likes WHERE user_id = ? AND post_id = ?';
        const [rows] = await db.execute<RowDataPacket[]>(checkQuery, [user_id, post_id]);

        let result;
        if (rows.length > 0) {
            // 이미 좋아요를 눌렀다면 삭제
            const deleteQuery = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';
            [result] = await db.execute<ResultSetHeader>(deleteQuery, [user_id, post_id]);
            
            if (result.affectedRows === 0) {
                db.release();
                return NextResponse.json({ error: 'Failed to remove like' }, { status: 500 });
            }
            
            db.release();
            return NextResponse.json({ message: 'Like removed successfully!' });
        } else {
            // 좋아요를 누르지 않았다면 추가
            const insertQuery = 'INSERT INTO likes (user_id, user_nickname, post_id, created_at) VALUES (?, ?, ?, ?)';
            const values = [user_id, user_nickname, post_id, new Date()];
            
            [result] = await db.execute<ResultSetHeader>(insertQuery, values);
            
            if (result.affectedRows === 0) {
                db.release();
                return NextResponse.json({ error: 'Failed to add like' }, { status: 500 });
            }
            
            db.release();
            return NextResponse.json({ message: 'Like added successfully!' });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
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
        const query = 'DELETE FROM likes WHERE id = ?';
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

