import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import toast from "react-hot-toast";
import { updateUserProfile } from "../redux/slices/authSlice.js";
import { changePassword } from "../services/authService.js";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm({ defaultValues: user });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });

  const onSubmit = (data) => dispatch(updateUserProfile(data));

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await changePassword(pwForm);
      toast.success("Password changed successfully");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <input {...register("name")} placeholder="Name" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input {...register("phone")} placeholder="Phone" className="w-full border rounded-lg px-3 py-2 text-sm" />
          <input value={user?.email} disabled className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-100" />
          <div className="grid grid-cols-2 gap-3">
            <input {...register("address.street")} placeholder="Street" className="border rounded-lg px-3 py-2 text-sm" />
            <input {...register("address.city")} placeholder="City" className="border rounded-lg px-3 py-2 text-sm" />
            <input {...register("address.state")} placeholder="State" className="border rounded-lg px-3 py-2 text-sm" />
            <input {...register("address.zipCode")} placeholder="Zip Code" className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <button type="submit" className="bg-primary text-white px-6 py-2 rounded-full text-sm font-medium">
            Save Changes
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="New Password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
