'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // ล็อกอินสำเร็จ เปลี่ยนหน้าไปที่หน้า Store หลัก
      router.push('/Main');
    } catch (err: any) {
      console.error(err);
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c7d5e0] flex items-center justify-center font-sans antialiased px-4">
      <div className="bg-[#171a21] border border-[#2a475e] w-full max-w-md p-8 rounded-xl shadow-2xl space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black tracking-wider text-white uppercase italic">
            GameStore <span className="text-sm text-[#66c0f4] font-normal">LOGIN</span>
          </h1>
          <p className="text-xs text-gray-400">กรุณากรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-xs p-3 rounded text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">อีเมล</label>
            <input
              type="email"
              placeholder="ttt@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#1b2838] border border-[#2a475e] text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#66c0f4]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">รหัสผ่าน</label>
            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1b2838] border border-[#2a475e] text-white px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#66c0f4]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#66c0f4] hover:bg-[#4ba3d2] text-[#171a21] py-2.5 rounded font-bold text-sm transition shadow mt-2"
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* Register Link */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t border-[#2a475e]">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <Link href="/register" className="text-[#66c0f4] hover:underline font-semibold">
            คลิกที่นี่
          </Link>
        </div>

      </div>
    </div>
  );
}