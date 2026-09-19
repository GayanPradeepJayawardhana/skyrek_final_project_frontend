import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import getFormattedPrice from "../../utils/price-formatter";
import formatTimestamp from "../../utils/date-formatter";
import AdminOrderDataModal from "../../components/orderDataModal";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            api
                .get("/orders/" + pageNumber + "/" + pageSize, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setOrders(res.data.orders);
                    setTotalOrders(res.data.totalOrders);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load orders:", err);
                    toast.error(
                        err?.response?.data?.message || "Failed to load orders"
                    );
                    setOrders([]);
                    setTotalPages(1);
                    setTotalOrders(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize]);

    return (
        <div className="w-full h-full flex flex-col items-center ">
            <div className="w-full h-[100px] bg-white shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">
                <h1 className="text-2xl font-semibold">All Orders</h1>
                <div className="h-full gap-4 flex items-center">
                    {totalOrders} Orders
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && orders.length === 0 && (
                <div className="w-full h-[200px] flex justify-center items-center text-gray-500 text-lg">
                    No orders found.
                </div>
            )}

            {!loading && orders.length > 0 && (
                <table className="w-full text-center rounded-lg overflow-hidden">
                    <thead className="bg-accent text-white h-[40px] ">
                        <tr>
                            <th className="w-[5%]">Order ID</th>
                            <th className="w-[7%]">Email</th>
                            <th className="w-[22%]">Name</th>
                            <th className="w-[9%]">City</th>
                            <th className="w-[9%]">Phone</th>
                            <th className="w-[7%]">Status</th>
                            <th className="w-[7%]">Date</th>
                            <th className="w-[9%]">totalAmount</th>
                            <th className="w-[15%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            return (
                                <tr
                                    className="odd:bg-gray-300 even:bg-white h-[60px]"
                                    key={order.orderId}
                                >
                                    <td>{order.orderId}</td>
                                    <td>{order.email}</td>
                                    <td>
                                        {order.firstName} {order.lastName}
                                    </td>
                                    <td>{order.city}</td>
                                    <td>{order.phone}</td>
                                    <td>{order.status}</td>
                                    <td>{formatTimestamp(order.date)}</td>
                                    <td>{getFormattedPrice(order.totalAmount)}</td>
                                    <td>
                                        <div className="w-full flex justify-center items-center gap-4">
                                            <AdminOrderDataModal
                                                isAdmin={true}
                                                order={order}
                                                refresh={() => setLoading(true)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}

            <div className="p-2 fixed bottom-4 bg-white shadow-2xl flex justify-center items-center">
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setPageNumber(1);
                        setLoading(true);
                    }}
                    className="h-full px-4 border-r"
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
                <div className="h-full flex items-center justify-center gap-4">
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => {
                            setPageNumber(pageNumber - 1);
                            setLoading(true);
                        }}
                        className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
                    >
                        Previous
                    </button>
                    <span>
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => {
                            setPageNumber(pageNumber + 1);
                            setLoading(true);
                        }}
                        className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-200"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}