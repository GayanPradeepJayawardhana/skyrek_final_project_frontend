import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import ProductDeleteButton from "../../components/productDeleteButton";
import { CiEdit } from "react-icons/ci";
import getFormattedPrice from "../../utils/price-formatter";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (loading) {
			const token = localStorage.getItem("token");
			api
				.get("/products", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setProducts(res.data);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Failed to load products:", err);
					toast.error(
						err?.response?.data?.message || "Failed to load products"
					);
					setProducts([]);
					setLoading(false);
				});
		}
	}, [loading]);

	return (
		<div className="w-full h-full ">
			<div className="w-full h-[100px] bg-white shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">
				<h1 className="text-2xl font-semibold">All Products</h1>
				<div className="h-full gap-4 flex items-center">
					{products.length} Products
				</div>
			</div>

			{loading && <LoadingScreen />}

			{!loading && products.length === 0 && (
				<div className="w-full h-[200px] flex justify-center items-center text-gray-500 text-lg">
					No products found. Click the + button to add one.
				</div>
			)}

			{!loading && products.length > 0 && (
				<table className="w-full text-center rounded-lg overflow-hidden">
					<thead className="bg-accent text-white h-[40px] ">
						<tr>
							<th className="w-[5%]"></th>
							<th className="w-[7%]">Product ID</th>
							<th className="w-[22%]">Name</th>
							<th className="w-[9%]">Price</th>
							<th className="w-[9%]">Labelled Price</th>
							<th className="w-[7%]">Brand</th>
							<th className="w-[7%]">Model</th>
							<th className="w-[9%]">Category</th>
							<th className="w-[5%]">Availability</th>
							<th className="w-[5%]">Stock</th>
							<th className="w-[15%]">Actions</th>
						</tr>
					</thead>
					<tbody>
						{products.map((product) => {
							return (
								<tr
									className="odd:bg-gray-300 even:bg-white h-[60px]"
									key={product.productId}
								>
									<td>
										<img
											src={product.images[0]}
											alt={product.name}
											className="w-16 h-16  rounded"
										/>
									</td>
									<td>{product.productId}</td>
									<td>{product.name}</td>
									<td>{getFormattedPrice(product.price)}</td>
									<td>{getFormattedPrice(product.labelledPrice)}</td>
									<td>{product.brand}</td>
									<td>{product.model}</td>
									<td>{product.category}</td>
									<td>
										{product.isAvailable ? "Available" : "Out of Stock"}
									</td>
									<td>{product.stock}</td>
									<td>
										<div className="w-full flex justify-center items-center gap-4">
											<Link to="/admin/edit-product" state={product}>
												<CiEdit className="text-blue-600 text-xl rounded-full hover:border cursor-pointer " />
											</Link>
											<ProductDeleteButton
												productId={product.productId}
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

			<Link
				to="/admin/add-product"
				className="bg-accent w-[80px] h-[80px] rounded-full text-white text-2xl flex justify-center items-center fixed bottom-4 right-4 shadow-2xl hover:bg-white hover:text-accent"
			>
				<FaPlus />
			</Link>
		</div>
	);
}