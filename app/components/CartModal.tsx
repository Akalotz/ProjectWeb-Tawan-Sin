'use client';

import generatePayload from 'promptpay-qr';
import { QRCodeSVG } from 'qrcode.react'; // หรือใช้ QRCodeCanvas

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: any[];
  onRemoveFromCart: (gameId: string) => void;
  onCheckout: (total: number) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onCheckout,
}: CartModalProps) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  // ใส่เบอร์โทรศัพท์พร้อมเพย์ หรือเลขประจำตัวผู้เสียภาษีของคุณตรงนี้ (เช่น เบอร์ทดสอบ)
  const promptPayNumber = '0820794999'; 

  // สร้าง Payload สำหรับพร้อมเพย์โดยผูกกับยอดเงินจริง (total)
  const qrPayload = generatePayload(promptPayNumber, { amount: total });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-[#1b2838] border border-[#2a475e] text-[#c7d5e0] w-full max-w-md p-6 rounded-xl shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#2a475e] pb-4">
          <h2 className="text-white font-bold text-lg">💳 ชำระเงินผ่าน PromptPay QR</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
        </div>

        {/* รายการเกมย่อ */}
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {cartItems.map((item) => (
            <div key={item.game_id} className="flex justify-between text-sm bg-[#171a21] p-2 rounded">
              <span className="truncate w-3/4 text-white">{item.title}</span>
              <span className="text-[#66c0f4]">฿{item.price.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* แสดงยอดรวมและ QR Code จริง */}
        <div className="flex flex-col items-center justify-center space-y-4 bg-[#171a21] p-6 rounded-xl border border-[#2a475e]">
          <div className="text-center">
            <p className="text-xs text-gray-400">ยอดชำระเงินรวมทั้งหมด</p>
            <p className="text-2xl font-black text-[#66c0f4]">฿{total.toLocaleString()}</p>
          </div>

          {/* แสดง QR Code จริงที่เจนตามยอดเงิน */}
          <div className="bg-white p-3 rounded-lg shadow-inner">
            <QRCodeSVG value={qrPayload} size={180} />
          </div>

          <p className="text-xs text-gray-400 text-center">
            * สแกนผ่านแอปพลิเคชันธนาคารเพื่อจำลองการชำระเงิน
          </p>
        </div>

        {/* ปุ่มยืนยัน */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="w-1/2 bg-[#2a475e] hover:bg-[#3a5d7c] text-white py-2.5 rounded font-bold text-sm transition"
          >
            ย้อนกลับ
          </button>
          <button
            onClick={() => onCheckout(total)}
            className="w-1/2 bg-green-600 hover:bg-green-500 text-white py-2.5 rounded font-bold text-sm transition shadow"
          >
            ยืนยันชำระเงิน (ส่ง Order)
          </button>
        </div>

      </div>
    </div>
  );
}