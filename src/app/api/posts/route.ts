import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 
import pool from "../../libs/db";

interface PostRow extends RowDataPacket {
    id: number;
    user_id: string;
    title: string;
    content: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('user_id');

        const db = await pool.promise().getConnection();
        let query = 'SELECT * FROM posts';
        const queryParams: any[] = [];

        if (userid) {
            query += ' WHERE user_id = ?';
            queryParams.push(userid);
        }

        const [rows] = await db.execute<PostRow[]>(query, queryParams);
        db.release();

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = await pool.promise().getConnection();
        
        const { user_id, user_nickname, title, content } = await request.json(); 
        
        const query = 'INSERT INTO posts (user_id, user_nickname, title, content) VALUES (?, ?, ?, ?)';  
        const [result] = await db.execute<ResultSetHeader>(query, [user_id, user_nickname, title, content]);
        
        db.release();
        
        return NextResponse.json({ 
            message: 'Post created successfully!',
            id: result.insertId 
        });
    } catch (error) {
        console.error('Error creating post:', error); 
        return NextResponse.json({
            error: (error as Error).message
        }, { status: 500 });
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
        const query = 'DELETE FROM posts WHERE id = ?';
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
