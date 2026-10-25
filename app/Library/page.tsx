'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Game } from '../Data/gameData';
import { db, auth } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function LibraryPage() {
  const [ownedGames, setOwnedGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('Tawan_Student');

  useEffect(() => {
    // 2. ใช้ onAuthStateChanged เพื่อรอเช็กสถานะผู้ใช้ที่ล็อกอินอยู่ปัจจุบัน
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email || 'Tawan_Student');
        try {
          // ดึงข้อมูลเกมจาก Firestore ใน sub-collection: users/{uid}/library
          const querySnapshot = await getDocs(collection(db, 'users', user.uid, 'library'));
          const gamesList: Game[] = [];
          
          querySnapshot.forEach((doc) => {
            gamesList.push(doc.data() as Game);
          });

          setOwnedGames(gamesList);
        } catch (error) {
          console.error("Error fetching library from Firestore:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handlePlayGame = (title: string) => {
    alert(`กำลังเปิดเกม "${title}"... ขอให้สนุกกับการเล่นเกมครับ! 🎮`);
  };

  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c7d5e0] font-sans antialiased">
      {/* Header / Navbar */}
      <header className="bg-[#171a21] text-[#c7d5e0] border-b border-[#2a475e] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/Main" className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-black tracking-wider text-white uppercase italic bg-gradient-to-r from-[#1b2838] via-[#2a475e] to-[#66c0f4] px-3 py-1 rounded shadow">
                GAME <span className="text-xs text-[#66c0f4] font-normal">STORE</span>
              </span>
            </Link>

            <nav className="hidden md:flex space-x-1">
              <Link
                href="/Main"
                className="px-4 py-2 rounded text-sm font-semibold text-[#c7d5e0] hover:bg-[#2a475e]/50 hover:text-white transition"
              >
                STORE
              </Link>
              <Link
                href="/Library"
                className="px-4 py-2 rounded text-sm font-semibold bg-[#2a475e] text-white"
              >
                LIBRARY
              </Link>
            </nav>
          </div>

          <div className="text-xs text-gray-400 border border-[#2a475e] px-3 py-1.5 rounded bg-[#1b2838]">
            ผู้ใช้: <span className="text-white font-semibold">{userEmail}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-r from-[#171a21] via-[#2a475e] to-[#1b2838] p-6 rounded-xl border border-[#2a475e] shadow-lg">
          <h1 className="text-3xl font-black text-white tracking-wide">MY LIBRARY</h1>
          <p className="text-[#c7d5e0] text-sm mt-1">
            คลังเกมส่วนตัวของคุณ (รายการเกมที่คุณเป็นเจ้าของและพร้อมเล่นบน Cloud)
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">กำลังโหลดคลังเกมของคุณ...</div>
        ) : ownedGames.length === 0 ? (
          <div className="bg-[#171a21] border border-[#2a475e] p-12 text-center rounded-xl text-gray-400 space-y-4">
            <p>คุณยังไม่มีเกมในคลังส่วนตัว กรุณาไปซื้อเกมที่หน้า Store</p>
            <Link
              href="/Main"
              className="inline-block bg-[#66c0f4] hover:bg-[#4ba3d2] text-[#171a21] px-5 py-2 rounded text-sm font-bold transition shadow"
            >
              ไปเลือกซื้อเกมที่หน้า Store
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ownedGames.map((game) => (
              <div
                key={game.game_id}
                className="bg-[#171a21] border border-[#2a475e] rounded-xl overflow-hidden shadow-lg flex flex-col justify-between hover:border-[#66c0f4] transition group"
              >
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={game.cover_img}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2.5 py-1 rounded font-bold shadow">
                      Ready to Play
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="text-white font-bold text-lg">{game.title}</h3>
                    <p className="text-gray-400 text-xs">{game.description}</p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handlePlayGame(game.title)}
                    className="w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded font-bold text-sm transition shadow flex items-center justify-center space-x-2"
                  >
                    <span>▶ PLAY</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}