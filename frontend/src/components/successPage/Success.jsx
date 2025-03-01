import { useParams, useLocation, useNavigate } from "react-router-dom";

const SuccessPage = () => {
    const { orderId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const paymentData = location.state;

    console.log("Order ID from useParams:", orderId); // Debugging ✅

    // ✅ Query Parameters Extract Karna
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get("success");
    const verify = searchParams.get("verify");

    if (!paymentData) {
        return <h2 className="text-center mt-10">No Payment Data Available</h2>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-[#fdf2e3] via-[#fcd5a5] to-[#ffd39c]">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center w-3/4">
                <h2 className="text-2xl font-bold text-green-600">Payment Successful! ✅</h2>
                <p className="mt-4 text-lg">Thank you for your purchase.</p>

                {/* ✅ Query Params Check karna */}
                {success === "true" && verify === "done" && (
                    <p className="text-green-500 font-semibold">Payment Verified Successfully! ✅</p>
                )}

                <div className="mt-6 text-left flex flex-col gap-2">
                    <p><strong>Order ID:</strong> {orderId}</p> {/* ✅ Fix applied */}
                    <p><strong>Payment ID:</strong> {paymentData.razorpay_payment_id}</p>
                    <p><strong>Total Amount:</strong> ₹{paymentData.amount/100}</p>
                   
                </div>

                {/* 🔥 Ordered Products Table */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold">Ordered Products</h3>
                    <table className="w-full mt-4 border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="p-2 border">Product</th>
                                <th className="p-2 border">Quantity</th>
                                <th className="p-2 border">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentData.cartItems.map((item, index) => (
                                <tr key={index} className="border">
                                    <td className="p-2 border">{item.title}</td>
                                    <td className="p-2 border">{item.quantity}</td>
                                    <td className="p-2 border">₹{item.price * item.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
<div className="flex gap-10 justify-center">
                <button
                    onClick={() => navigate("/")}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Go to Home
                </button>
                <button
                    onClick={() => navigate("/orderpage")}
                    className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Go to order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
