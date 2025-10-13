"use client";

import { useEffect, useState } from "react";
import Link from 'next/link';

type Order = {
    id: number;
    quantity: number;
    createdAt: string;
    product: {
        id: number;
        name_jp: string;
        price: number;
    };
};

export default function OrdersDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/orders');
            const data = await res.json();
            setOrders(data);
        } catch (error) {
            console.error('注文データの取得に失敗しました:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('この注文を削除しますか？')) return;
        try {
            const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchOrders();
            }
        } catch (error) {
            console.error('注文の削除に失敗しました:', error);
        }
    };

    if (loading) return <div className="p-8">読み込み中...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">注文管理ダッシュボード</h1>

                <div className="flex gap-2">
                    <Link
                        href="/dashboard"
                        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    >
                        商品管理ダッシュボード
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">注文ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">商品名</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">数量</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">合計金額</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">日時</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {order.product?.name_jp || '（商品不明）'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ¥{(order.product?.price || 0) * order.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.createdAt).toLocaleString('ja-JP')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => handleDelete(order.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {orders.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        注文はまだありません
                    </div>
                )}
            </div>
        </div>
    );
}