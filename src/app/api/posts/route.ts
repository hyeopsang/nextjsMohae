import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 
import pool from "../../libs/db";

interface PostRow extends RowDataPacket {
    id: number;
    email: string;
    text: string;
    tags: string;
  }

  export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        const db = await pool.promise().getConnection();
        let query = 'SELECT * FROM posts';
        const queryParams: any[] = [];

        if (email) {
            query += ' WHERE email = ?';
            queryParams.push(email);
        }

        const [rows] = await db.execute(query, queryParams);
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
        
        const { email, text, tags } = await request.json(); 
        
        const query = 'INSERT INTO posts (email, text, tags) VALUES (?, ?, ?)';
        const [result] = await db.execute(query, [email, text, JSON.stringify(tags)]);
        
        db.release();
        
        return NextResponse.json({ message: 'Post created successfully!' });
    } catch (error) {
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

