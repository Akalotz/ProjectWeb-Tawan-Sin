'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // สั่งสร้างบัญชีผู้ใช้ใหม่ด้วย Firebase Auth
      await createUserWithEmailAndPassword(auth, email, password);
      alert('สมัครสมาชิกสำเร็จ!');
      router.push('/Main'); // สมัครเสร็จพาไปหน้า Store หลักเลย
    } catch (err: any) {
      setError('ไม่สามารถสมัครสมาชิกได้ (อีเมลนี้อาจถูกใช้งานแล้ว หรือรหัสผ่านสั้นเกินไป)');
    }
  };

  return (
    <div className="min-h-screen bg-[#1b2838] text-white flex items-center justify-center">
      <div className="bg-[#171a21] p-8 rounded-xl border border-[#2a475e] w-full max-w-md shadow-xl space-y-6">
        <h1 className="text-2xl font-black text-center tracking-wider">CREATE ACCOUNT</h1>
        
        {error && <div className="bg-red-500/25 text-red-400 p-3 rounded text-sm">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">อีเมล</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1b2838] border border-[#2a475e] rounded px-3 py-2 text-white focus:outline-none focus:border-[#66c0f4]"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1b2838] border border-[#2a475e] rounded px-3 py-2 text-white focus:outline-none focus:border-[#66c0f4]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#66c0f4] hover:bg-[#4ba3d2] text-[#171a21] font-bold py-2.5 rounded transition"
          >
            สมัครสมาชิก
          </button>
        </form>

        <div className="text-center text-xs text-gray-400">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-[#66c0f4] hover:underline">
            เข้าสู่ระบบที่นี่
          </Link>
        </div>
      </div>
    </div>
  );
}