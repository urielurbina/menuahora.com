'use client'

export default function CartPreview() {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-[#c4704b] text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-4">
        <span className="text-lg">Tu pedido</span>
        <span className="bg-[#a35e3f] px-3 py-1 rounded-full text-sm">1 item</span>
        <span className="text-lg">$ 0,00</span>
      </div>
    </div>
  )
} 