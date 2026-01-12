import React, { useRef, useState, useEffect } from "react";
import { MessageSquare, Bot, X, Send } from "lucide-react";

const MoneyBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showHint, setShowHint] = useState(true);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, text: "Xin chào! Mình là Money Bot 🤖. Bạn có thể nhập nhanh giao dịch ví dụ: 'Ăn sáng 30000' hoặc 'Lương 10000000'", sender: 'bot' }
    ]);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Auto-hide hint after 15 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowHint(false), 15000);
        return () => clearTimeout(timer);
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        // User message
        const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        
        // Parse logic (Simple Regex)
        // Format: [Description] [Amount]
        const match = inputValue.match(/(.*?)\s+(\d+)(k?)/i);
        
        if (match) {
            let description = match[1].trim();
            let amount = parseInt(match[2]);
            if (match[3].toLowerCase() === 'k') amount *= 1000;

            // Guess category
            let category = "Khác";
            const lowerDesc = description.toLowerCase();
            if (lowerDesc.includes("ăn") || lowerDesc.includes("uống") || lowerDesc.includes("cafe")) category = "Ăn uống";
            else if (lowerDesc.includes("xe") || lowerDesc.includes("xăng")) category = "Di chuyển";
            else if (lowerDesc.includes("nhà") || lowerDesc.includes("điện") || lowerDesc.includes("nước")) category = "Nhà cửa";
            else if (lowerDesc.includes("lương") || lowerDesc.includes("thưởng")) category = "Lương"; // Though usually this is Income

            // Guess Type
            const type = (category === "Lương" || category === "Đầu tư") ? "income" : "expense";

            const newTx = {
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                description: description.charAt(0).toUpperCase() + description.slice(1),
                amount: amount,
                category: category,
                type: type
            };

            setTimeout(() => {
                // onAddTransaction(newTx);
                setMessages(prev => [...prev, { 
                    id: Date.now() + 1, 
                    text: `Đã thêm: ${newTx.description} - ${formatCurrency(newTx.amount)} (${newTx.category}) ✅`, 
                    sender: 'bot' 
                }]);
            }, 600);
        } else {
            setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now() + 1, text: "Mình không hiểu lắm. Hãy nhập theo cú pháp: [Tên] [Số tiền]. Ví dụ: Cơm trưa 35000", sender: 'bot' }]);
            }, 600);
        }
        setInputValue("");
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Hint Bubble - Show when bot is closed and hint is active */}
            {!isOpen && showHint && (
                <div className="mb-3 mr-1 bg-white p-3 rounded-xl shadow-xl border border-purple-100 relative animate-bounce-slow max-w-[220px]">
                    <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-purple-100 rounded-full shrink-0">
                            <Bot size={16} className="text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-800">Trợ lý ảo</p>
                            <p className="text-xs text-gray-600 mt-0.5">Chat để tạo giao dịch nhanh mà không cần nhập liệu!</p>
                        </div>
                    </div>
                    {/* Close hint button */}
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowHint(false); }} 
                        className="absolute -top-2 -left-2 bg-gray-200 text-gray-500 rounded-full p-0.5 hover:bg-gray-300 transition-colors"
                    >
                        <X size={10}/>
                    </button>
                    {/* Arrow pointing down */}
                    <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-purple-100 transform rotate-45"></div>
                </div>
            )}

            {isOpen && (
                <div className="mb-4 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-purple-100 overflow-hidden animate-fade-in-up flex flex-col" style={{height: '500px'}}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-2">
                            <Bot size={24} />
                            <div>
                                <h3 className="font-bold">Money Bot</h3>
                                <p className="text-xs text-purple-200">Trợ lý tài chính ảo</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded"><X size={20}/></button>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none shadow-sm'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Quick Actions / Recent */}
                    <div className="px-4 py-2 bg-white border-t border-gray-100">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-2">Gần đây</p>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {/* {recentTransactions.slice(0, 3).map(tx => (
                                <div key={tx.id} className="flex justify-between items-center text-xs p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 cursor-pointer" onClick={() => { setIsOpen(false); onEditTransaction(tx); }}>
                                    <span className="truncate max-w-[120px] font-medium text-gray-700">{tx.description}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-500'}>{formatCurrency(tx.amount)}</span>
                                        <Edit size={12} className="text-gray-400"/>
                                    </div>
                                </div>
                            ))} */}
                        </div>
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-200 flex gap-2">
                        <input 
                            type="text" 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập: Cơm 30k..." 
                            className="flex-grow px-3 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="submit" className="p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}
            
            <button 
                onClick={() => { setIsOpen(!isOpen); setShowHint(false); }}
                className="w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 animate-bounce-slow"
            >
                {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
            </button>
            <style>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default MoneyBot;