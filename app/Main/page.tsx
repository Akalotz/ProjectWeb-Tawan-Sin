'use client';

import { useState } from 'react';
import CartModal, { GameItem } from '../components/CartModal';
import { GAMES, CATEGORIES, Game } from '../Data/gameData';
import Link from 'next/link';
// 1. นำเข้า db และ auth จากไฟล์ firebase ของคุณ
import { db, auth } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function MainPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // State สำหรับจัดการตะกร้าสินค้า
  const [cartItems, setCartItems] = useState<GameItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredGames = GAMES.filter((game: Game) => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || game.catagory_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (game: Game) => {
    if (!cartItems.some((item) => item.game_id === game.game_id)) {
      setCartItems([...cartItems, game]);
    } else {
      alert(`เกม "${game.title}" อยู่ในตะกร้าเรียบร้อยแล้ว`);
    }
  };

  const handleRemoveFromCart = (gameId: string) => {
    setCartItems(cartItems.filter((item) => item.game_id !== gameId));
  };

  // 2. ปรับปรุงฟังก์ชัน Checkout ให้บันทึกลง Firebase Firestore จริง
  const handleCheckout = async (total: number) => {
    const user = auth.currentUser;

    // ตรวจสอบว่าผู้ใช้ล็อกอินหรือยัง
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน!');
      return;
    }

    try {
      // วนลูปบันทึกทุกเกมในตะกร้าลงใน Firestore ของ User คนนั้น
      // Path ใน Firestore: users / {uid} / library / {game_id}
      // วนลูปบันทึกทุกเกมในตะกร้าลงใน Firestore ของ User คนนั้น
      for (const game of cartItems) {
        await setDoc(doc(db, 'users', user.uid, 'library', String(game.game_id)), {
          game_id: game.game_id,
          title: game.title,
          price: game.price,
          cover_img: (game as any).cover_img || '', // เผื่อเคสที่ type ไม่มี
          purchasedAt: new Date(),
        });
      }

      // เคลียร์ตะกร้าและแจ้งเตือนเมื่อสำเร็จ
      setCartItems([]);
      setIsCartOpen(false);
      alert(`ชำระเงินยอดรวม ฿${total.toLocaleString()} สำเร็จ! เพิ่มเกมทั้งหมดลงคลังของคุณ เรียบร้อยแล้ว!`);
    } catch (error) {
      console.error("Error saving library to Firestore:", error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูลเกมลงคลัง');
    }
  };

  return (
    <div className="min-h-screen bg-[#1b2838] text-[#c7d5e0] font-sans antialiased">
      {/* Navbar */}
      <header className="bg-[#171a21] text-[#c7d5e0] border-b border-[#2a475e] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer">
              <span className="text-2xl font-black tracking-wider text-white uppercase italic bg-gradient-to-r from-[#1b2838] via-[#2a475e] to-[#66c0f4] px-3 py-1 rounded shadow">
                GAME <span className="text-xs text-[#66c0f4] font-normal">STORE</span>
              </span>
            </div>

            <nav className="hidden md:flex space-x-1">
                <button className="px-4 py-2 rounded text-sm font-semibold bg-[#2a475e] text-white">
                    STORE
                </button>
                <Link
                     href="/Library"
                    className="px-4 py-2 rounded text-sm font-semibold text-[#c7d5e0] hover:bg-[#2a475e]/50 hover:text-white transition cursor-pointer"
                    >
                    LIBRARY
                </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-[#2a475e] hover:bg-[#66c0f4] hover:text-[#171a21] text-white px-4 py-2 rounded flex items-center space-x-2 transition font-medium text-sm"
            >
              <span>🛒 ตะกร้า</span>
              {cartItems.length > 0 && (
                <span className="bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </button>
            <div className="text-xs text-gray-400 border border-[#2a475e] px-3 py-1.5 rounded bg-[#1b2838]">
              ผู้ใช้: <span className="text-white font-semibold">{auth.currentUser?.email || 'Tawan_Student'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Store Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-gradient-to-r from-[#171a21] via-[#2a475e] to-[#1b2838] p-6 rounded-xl border border-[#2a475e] shadow-lg flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">STORE</h1>
            <p className="text-[#c7d5e0] text-sm mt-1">ระบบจำลองการจัดจำหน่ายและคลังเกมดิจิทัล</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="ค้นหาชื่อเกม..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#171a21] border border-[#2a475e] text-white px-4 py-2 rounded text-sm focus:outline-none focus:border-[#66c0f4] w-full md:w-64"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#171a21] border border-[#2a475e] text-white px-3 py-2 rounded text-sm focus:outline-none focus:border-[#66c0f4]"
            >
              <option value="all">ทุกหมวดหมู่ (Categories)</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.catagory_id} value={cat.catagory_id}>
                  {cat.catagory_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Game List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredGames.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-400">
              ไม่พบเกมที่คุณค้นหา
            </div>
          ) : (
            filteredGames.map((game: Game) => {
              const category = CATEGORIES.find((c) => c.catagory_id === game.catagory_id);
              const isAdded = cartItems.some((item) => item.game_id === game.game_id);

              return (
                <div
                  key={game.game_id}
                  className="bg-[#171a21] border border-[#2a475e]/60 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#66c0f4] transition shadow-md group"
                >
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={game.cover_img}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {category && (
                        <span className="absolute top-2 left-2 bg-[#1b2838]/80 text-[#66c0f4] text-xs px-2.5 py-1 rounded font-semibold backdrop-blur">
                          {category.catagory_name}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <h3 className="text-white font-bold text-base truncate">{game.title}</h3>
                      <p className="text-gray-400 text-xs line-clamp-2">{game.description}</p>
                    </div>
                  </div>

                  <div className="p-4 pt-0 flex items-center justify-between mt-4">
                    <span className="text-[#66c0f4] font-bold text-lg">฿{game.price.toLocaleString()}</span>
                    <button
                      onClick={() => handleAddToCart(game)}
                      className={`px-4 py-1.5 rounded text-xs font-bold transition shadow ${
                        isAdded
                          ? 'bg-[#2a475e] text-gray-300'
                          : 'bg-[#66c0f4] hover:bg-[#4ba3d2] text-[#171a21]'
                      }`}
                    >
                      {isAdded ? 'อยู่ในตะกร้าแล้ว' : '+ ใส่ตะกร้า'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
}