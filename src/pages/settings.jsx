import { useEffect, useState } from "react";
import api from "../utils/api";
import uploadMedia from "../utils/mediaUpload";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";

export default function Settings() {
	const [user, setUser] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token != null) {
			api
				.get("/users/me", {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					setUser(res.data);
					setFirstName(res.data.firstName);
					setLastName(res.data.lastName);
				})
				.catch((err) => {
					console.log(err);
					setUser(null);
				});
		} else {
			window.location.href = "/login";
		}
	}, []);

	async function handleUpdateProfile() {
		setLoading(true);

		let imageUrl = user.image;
		try {
			if (image != null) {
				imageUrl = await uploadMedia(image);
			}
			const token = localStorage.getItem("token");
			await api.put(
				"/users",
				{
					firstName: firstName,
					lastName: lastName,
					image: imageUrl,
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);

			setLoading(false);
			window.location.reload();
		} catch (err) {
			console.log(err);
			toast.error("Profile update failed");
            setLoading(false);
		}
	}

    async function handleChangePassword() {
        if(password !== confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        setLoading(true);

        try{
            const token = localStorage.getItem("token");
            await api.post("/users/password",{
                password : password
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            setLoading(false);
            toast.success("Password changed successfully");
        } catch (err) {
            console.log(err);
            toast.error("Failed to change password");
            setLoading(false);
        }
    }

	return (
		<div className="w-full h-full overflow-y-scroll pb-20 flex flex-col lg:flex-row justify-center items-center gap-4">
			<div className="w-[400px] p-4 h-[400px] bg-white shadow-2xl rounded-lg flex flex-col">
				<h1 className="text-2xl font-semibold mb-4">Profile Information</h1>
				<label className="text-sm font-medium">First Name</label>
				<input
					type="text"
					className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
					value={firstName}
					onChange={(e) => {
						setFirstName(e.target.value);
					}}
				/>
				<label className="text-sm font-medium">Last Name</label>
				<input
					type="text"
					className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
					value={lastName}
					onChange={(e) => {
						setLastName(e.target.value);
					}}
				/>
				<label className="text-sm font-medium">Profile Image</label>
				<input
					type="file"
					className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
					onChange={(e) => {
						setImage(e.target.files[0]);
					}}
				/>
				<button
					className="w-full h-[40px] bg-accent/80 text-white rounded-md hover:bg-accent"
					onClick={handleUpdateProfile}
				>
					Update Profile
				</button>
			</div>

			<div className="w-[400px] p-4 h-[400px] bg-white shadow-2xl rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
                <label className="text-sm font-medium">New Password</label>
                <input
                    type="password"
                    className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <label className="text-sm font-medium">Confirm New Password</label>
                <input
                    type="password"
                    className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <button
                    className="w-full h-[40px] bg-accent/80 text-white rounded-md hover:bg-accent"
                    onClick={handleChangePassword}
                >
                    Change Password
                </button>
            </div>
            {
                loading && <LoadingScreen/>
            }
		</div>
	);
}
