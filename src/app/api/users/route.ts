import { NextResponse } from 'next/server';
import { ResultSetHeader, RowDataPacket, QueryResult } from 'mysql2';
import pool from '../../libs/db'; // 데이터베이스 연결 설정


// GET 메서드: 이메일로 사용자 조회
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await pool.promise().getConnection();
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        ) as [any[], any];
        db.release();

        if (rows.length === 0) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { email } = await request.json(); 

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await pool.promise().getConnection();

        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]) as [any[], any];

        if (rows.length === 0) {
            await db.execute(
                'INSERT INTO users (email, created_at) VALUES (?, ?)',
                [email, new Date()]
            );
        }

        db.release();
        return NextResponse.json({ message: 'User processed successfully!' });
    } catch (error) {
        console.error('Error processing user:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const db = await pool.promise().getConnection();
        const [result] = await db.execute<ResultSetHeader>(
            'DELETE FROM users WHERE email = ?',
            [email]
        );
        db.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
