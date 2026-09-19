import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import { BiRefresh } from "react-icons/bi";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            api
                .get("/users/all/" + pageNumber + "/" + pageSize, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.users);
                    setTotalUsers(res.data.totalUsers);
                    setTotalPages(res.data.totalPages);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load users:", err);
                    toast.error(
                        err?.response?.data?.message || "Failed to load users"
                    );
                    setUsers([]);
                    setTotalPages(1);
                    setTotalUsers(0);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize]);

    function handleBlockToggle(email) {
        const token = localStorage.getItem("token");
        api
            .put(
                "/users/state/" + email,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                toast.success("User blocked status updated successfully");
                setLoading(true);
            })
            .catch((err) => {
                console.error(err);
                toast.error(
                    err?.response?.data?.message ||
                        "Failed to update block state"
                );
            });
    }

    function handleRoleToggle(email) {
        const token = localStorage.getItem("token");
        api
            .put(
                "/users/role/" + email,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                toast.success("User role updated successfully");
                setLoading(true);
            })
            .catch((err) => {
                console.error(err);
                toast.error(
                    err?.response?.data?.message || "Failed to update role"
                );
            });
    }

    return (
        <div className="w-full h-full overflow-y-scroll flex flex-col items-center pb-[100px]">
            <div className="w-full min-h-[100px] bg-white shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">
                <h1 className="text-2xl font-semibold">All Users</h1>
                <div className="h-full gap-4 flex items-center">
                    {totalUsers} Users
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && users.length === 0 && (
                <div className="w-full h-[200px] flex justify-center items-center text-gray-500 text-lg">
                    No users found.
                </div>
            )}

            {!loading && users.length > 0 && (
                <table className="w-full text-center rounded-lg overflow-hidden ">
                    <thead className="bg-accent text-white h-[40px] ">
                        <tr>
                            <th className="w-[5%]"></th>
                            <th className="w-[7%]">Email</th>
                            <th className="w-[22%]">First Name</th>
                            <th className="w-[9%]">Last Name</th>
                            <th className="w-[9%]">Role</th>
                            <th className="w-[7%]">Email Verified</th>
                            <th className="w-[7%]">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                className="odd:bg-gray-300 even:bg-white h-[60px]"
                                key={user.email}
                            >
                                <td>
                                    <img
                                        src={
                                            user.image &&
                                            user.image.trim() !== ""
                                                ? user.image
                                                : "/default-profile.png"
                                        }
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-12 h-12 rounded-full object-cover bg-gray-100 mx-auto"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src =
                                                "/default-profile.png";
                                        }}
                                    />
                                </td>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td className="flex h-[60px] justify-center items-center gap-4">
                                    {user.isAdmin ? "Admin" : "Customer"}{" "}
                                    <BiRefresh
                                        className="cursor-pointer text-2xl hover:text-accent"
                                        onClick={() =>
                                            handleRoleToggle(user.email)
                                        }
                                    />
                                </td>
                                <td>
                                    {user.isEmailVerified ? "Yes" : "No"}
                                </td>
                                <td className="flex h-[60px] justify-center items-center gap-4">
                                    {user.isBlocked ? "Blocked" : "Active"}{" "}
                                    <BiRefresh
                                        className="cursor-pointer text-2xl hover:text-accent"
                                        onClick={() =>
                                            handleBlockToggle(user.email)
                                        }
                                    />
                                </td>
                            </tr>
                        ))}
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