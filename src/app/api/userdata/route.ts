import { NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from 'mysql2'; 
import pool from "../../libs/db";
import bcrypt from 'bcrypt';


interface UserDataRow extends RowDataPacket {
    user_id: string;
    user_password: string;
    user_nickname: string;
  }
  
  export async function GET(request: Request) {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('user_id');
      const userPassword = searchParams.get('user_password');
  
      if (!userId || !userPassword) {
        return NextResponse.json({ error: 'User ID and password are required' }, { status: 400 });
      }
  
      const db = await pool.promise().getConnection();
      const query = 'SELECT * FROM userdata WHERE user_id = ?';
      const [rows] = await db.execute<UserDataRow[]>(query, [userId]);
      db.release();
  
      if (rows.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      const user = rows[0];
      const passwordMatch = await bcrypt.compare(userPassword, user.user_password);
  
      if (!passwordMatch) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
  
      const { user_password, ...userInfo } = user;
      return NextResponse.json(userInfo);
  
    } catch (error) {
      console.error('Error during authentication:', error);
      return NextResponse.json({
        error: 'An error occurred during authentication'
      }, { status: 500 });
    }
  }

export async function POST(request: Request) {
    try {
        const db = await pool.promise().getConnection();
        
        const { user_id, user_password, user_nickname } = await request.json();

        const [existingUsers] = await db.execute('SELECT * FROM userdata WHERE user_id = ?', [user_id]);
        if ((existingUsers as any[]).length > 0) {
            db.release();
            return NextResponse.json({ error: 'User ID already exists' }, { status: 409 });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user_password, saltRounds);
        
        const query = 'INSERT INTO userdata (user_id, user_password, user_nickname) VALUES (?, ?, ?)';  
        const [result] = await db.execute<ResultSetHeader>(query, [user_id, hashedPassword, user_nickname]);  
        
        db.release();
        
        return NextResponse.json({ 
            message: 'User created successfully!',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({
            error: 'An error occurred while creating the user'
        }, { status: 500 });
    }
}

// 회원 탈퇴
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const user_id = searchParams.get('user_id');

        if (!user_id) {
            return NextResponse.json({ 
                error: 'User ID is required' 
            }, { status: 400 });
        }

        const db = await pool.promise().getConnection();
        
        // 사용자 존재 여부 확인
        const [users] = await db.execute('SELECT * FROM userdata WHERE user_id = ?', [user_id]);
        if ((users as any[]).length === 0) {
            db.release();
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        // 사용자 삭제
        const query = 'DELETE FROM userdata WHERE user_id = ?';
        const [result] = await db.execute<ResultSetHeader>(query, [user_id]); 
        db.release();

        if (result.affectedRows === 0) {
            return NextResponse.json({
                error: 'Failed to delete user'
            }, { status: 500 });
        }

        return NextResponse.json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({
            error: 'An error occurred while deleting the user'
        }, { status: 500 });
    }
}
