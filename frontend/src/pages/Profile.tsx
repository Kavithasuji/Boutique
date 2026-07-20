
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { authService } from "../services/auth.service";

import type { UserProfile } from "../services/auth.service";
import { createAddress } from "../services/address.service";
import toast from "react-hot-toast";


const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false);

  const [addressForm, setAddressForm] = useState({
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  country: "India",
  postalCode: "",
  isDefault: false,
});

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProfile = async () => {
    try {
      const data = await authService.getProfile();

      setProfile(data);
    } catch (err: any) {
      setError(
        err.response?.data?.message ??
          "Failed to fetch profile."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLTextAreaElement
  >,
) => {
  const { name, value, type } = e.target;

  setAddressForm((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : value,
  }));
};
const handleSaveAddress = async () => {
  try {
    await createAddress(addressForm);

    toast.success("Address added successfully.");

    setShowAddressModal(false);

    setAddressForm({
      fullName: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "India",
      postalCode: "",
      isDefault: false,
    });

     fetchProfile();
  } catch (error: any) {
    toast.error(
      error.response?.data?.message ??
        "Failed to add address.",
    );
  }
};

  const handleLogout = async () => {
    await logout();

    window.location.href = "/";
  };

 if (loading) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111]">
      <div
        className="
          rounded-3xl
          border
          border-white/10
          bg-[#181818]
          px-12
          py-10
          text-center
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            h-12
            w-12
            animate-spin
            rounded-full
            border-[3px]
            border-[#d72638]
            border-t-transparent
          "
        />

        <p
          className="
            mt-6
            text-[11px]
            uppercase
            tracking-[4px]
            text-[#ff7a86]
          "
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Loading Profile...
        </p>
      </div>
    </div>
  );
}

if (!isAuthenticated) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#111111] px-4">
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-white/10
          bg-[#181818]
          p-10
          text-center
          backdrop-blur-xl
        "
      >
        <p
          className="
            text-[11px]
            uppercase
            tracking-[4px]
            text-[#ff7a86]
          "
        >
          Cupidanza Boutique
        </p>

        <h2
          className="
            mt-4
            text-3xl
            font-light
            uppercase
            tracking-[2px]
            text-white
          "
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          Login Required
        </h2>

        <p className="mt-5 text-sm leading-7 text-gray-400">
          Please login to access your profile and manage your account.
        </p>

        <Link
          to="/login"
          className="
            mt-8
            inline-flex
            items-center
            justify-center
            rounded-full
            bg-[#d72638]
            px-8
            py-3
            text-[12px]
            uppercase
            tracking-[3px]
            text-white
            transition-all
            duration-300
            hover:bg-[#bf2030]
          "
        >
          Login
        </Link>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-[#111111] py-10">
    <div className="mx-auto max-w-7xl px-4">

      {/* Header */}

      <div className="mb-8">

        <p
          className="
            text-[11px]
            uppercase
            tracking-[4px]
            text-[#ff7a86]
          "
        >
          Cupidanza Boutique
        </p>

        <h1
          className="
            mt-3
            text-4xl
            font-light
            uppercase
            tracking-[3px]
            text-white
          "
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          My Profile
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-7 text-gray-400">
          Manage your account information, delivery addresses and orders.
        </p>

      </div>

      {error && (
        <div
          className="
            mb-8
            rounded-2xl
            border
            border-[#d72638]/20
            bg-[#d72638]/10
            px-6
            py-4
            text-sm
            text-[#ff7a86]
          "
        >
          {error}
        </div>
      )}

   

<div className="grid gap-6 lg:grid-cols-3">

  {/* Profile Card */}

  <div
    className="
      rounded-3xl
      border
      border-white/10
      bg-[#181818]
      p-6
      backdrop-blur-xl
    "
  >
    <div className="flex items-center gap-4">

      <div
        className="
          flex
          h-16
          w-16
          items-center
          justify-center
          rounded-full
          bg-[#d72638]
          text-2xl
          font-semibold
          text-white
        "
      >
        {(profile?.name || user?.name || "U")
          .charAt(0)
          .toUpperCase()}
      </div>

      <div className="min-w-0">

        <h2
          className="
            truncate
            text-xl
            font-light
            uppercase
            tracking-[2px]
            text-white
          "
          style={{
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          {profile?.name || user?.name}
        </h2>

        <p className="mt-1 truncate text-sm text-gray-400">
          {profile?.email || user?.email}
        </p>

        <span
          className="
            mt-3
            inline-flex
            rounded-full
            border
            border-green-500/30
            bg-green-500/10
            px-3
            py-1
            text-[10px]
            uppercase
            tracking-[2px]
            text-green-400
          "
        >
          Verified Customer
        </span>

      </div>

    </div>

    <button
      onClick={handleLogout}
      className="
        mt-6
        w-full
        rounded-full
        border
        border-[#d72638]
        bg-[#d72638]
        py-3
        text-[11px]
        uppercase
        tracking-[3px]
        text-white
        transition-all
        duration-300
        hover:bg-[#bf2030]
      "
    >
      Logout
    </button>

  </div>

  {/* Personal Information */}

  <div
    className="
      lg:col-span-2
      rounded-3xl
      border
      border-white/10
      bg-[#181818]
      p-6
      backdrop-blur-xl
    "
  >

    <p
      className="
        text-[11px]
        uppercase
        tracking-[4px]
        text-[#ff7a86]
      "
    >
      Account
    </p>

    <h2
      className="
        mt-2
        text-2xl
        font-light
        uppercase
        tracking-[2px]
        text-white
      "
      style={{
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      Personal Information
    </h2>

    <div className="mt-8 grid gap-6 md:grid-cols-2">

      <div>

        <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
          Full Name
        </p>

        <h3 className="mt-2 text-lg text-white">
          {profile?.name || user?.name}
        </h3>

      </div>

      <div>

        <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
          Email
        </p>

        <h3 className="mt-2 break-all text-lg text-white">
          {profile?.email || user?.email}
        </h3>

      </div>

      <div>

        <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
          Account Status
        </p>

        <span
          className="
            mt-2
            inline-flex
            rounded-full
            border
            border-green-500/30
            bg-green-500/10
            px-3
            py-1
            text-[10px]
            uppercase
            tracking-[2px]
            text-green-400
          "
        >
          {profile?.accountStatus}
        </span>

      </div>

      <div>

        <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
          Email Verification
        </p>

        {profile?.isEmailVerified ? (

          <span
            className="
              mt-2
              inline-flex
              rounded-full
              border
              border-green-500/30
              bg-green-500/10
              px-3
              py-1
              text-[10px]
              uppercase
              tracking-[2px]
              text-green-400
            "
          >
            Verified
          </span>

        ) : 
        (

       <span
  className="
    mt-2
    inline-flex
    rounded-full
    border
    border-yellow-500/30
    bg-yellow-500/10
    px-3
    py-1
    text-[10px]
    uppercase
    tracking-[2px]
    text-yellow-400
  "
>
  Pending
</span>
        )}

      </div>

      <div className="md:col-span-2">
        
        <p className="text-[11px] uppercase tracking-[3px] text-gray-500">
          Member Since
        </p>

        <h3 className="mt-2 text-lg text-white">
          {profile?.createdAt
            ? new Date(profile.createdAt).toLocaleDateString()
            : "-"}
        </h3>

      </div>

    </div>

  </div>

</div>
{/* Quick Actions */}

{/* Quick Actions */}

<div className="mt-8">

  <p
    className="
      text-[11px]
      uppercase
      tracking-[4px]
      text-[#ff7a86]
    "
  >
    Quick Access
  </p>

  <h2
    className="
      mt-2
      text-2xl
      font-light
      uppercase
      tracking-[2px]
      text-white
    "
    style={{
      fontFamily: "'Montserrat', sans-serif",
    }}
  >
    Shortcuts
  </h2>

  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

    {/* Orders */}

    <Link
      to="/orders"
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-[#181818]
        p-5
        transition-all
        duration-300
        hover:border-[#d72638]/40
        hover:bg-[#1d1d1d]
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[#111111]
          text-[#ff7a86]
          transition
          group-hover:bg-[#d72638]
          group-hover:text-white
        "
      >
        📦
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-light
          uppercase
          tracking-[2px]
          text-white
        "
        style={{
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Orders
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        View your purchase history.
      </p>

    </Link>

    {/* Cart */}

    <Link
      to="/cart"
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-[#181818]
        p-5
        transition-all
        duration-300
        hover:border-[#d72638]/40
        hover:bg-[#1d1d1d]
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[#111111]
          text-[#ff7a86]
          transition
          group-hover:bg-[#d72638]
          group-hover:text-white
        "
      >
        🛒
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-light
          uppercase
          tracking-[2px]
          text-white
        "
        style={{
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Cart
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        Review your shopping cart.
      </p>

    </Link>

    {/* Addresses */}

    <button
      onClick={() => setShowAddressModal(true)}
      className="
        text-left
        rounded-2xl
        border
        border-white/10
        bg-[#181818]
        p-5
        transition-all
        duration-300
        hover:border-[#d72638]/40
        hover:bg-[#1d1d1d]
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[#111111]
          text-[#ff7a86]
        "
      >
        📍
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-light
          uppercase
          tracking-[2px]
          text-white
        "
        style={{
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Address
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        Add a delivery address.
      </p>

    </button>

    {/* Support */}

    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#181818]
        p-5
      "
    >

      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-[#111111]
          text-[#ff7a86]
        "
      >
        💬
      </div>

      <h3
        className="
          mt-4
          text-lg
          font-light
          uppercase
          tracking-[2px]
          text-white
        "
        style={{
          fontFamily: "'Montserrat', sans-serif",
        }}
      >
        Support
      </h3>

      <p className="mt-2 text-sm text-gray-400">
        We're here to help.
      </p>

    </div>

  </div>

</div>
{/* Saved Addresses */}

{/* Saved Addresses */}

<div
    className="
    mt-8
    rounded-3xl
    border
    border-white/10
    bg-[#181818]
    p-6
    backdrop-blur-xl
    "
>

    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

            <p
                className="
                text-[11px]
                uppercase
                tracking-[4px]
                text-[#ff7a86]
                "
            >
                Delivery
            </p>

            <h2
                className="
                mt-2
                text-2xl
                font-light
                uppercase
                tracking-[2px]
                text-white
                "
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                }}
            >
                Saved Addresses
            </h2>

        </div>

        <button
            onClick={() => setShowAddressModal(true)}
            className="
            rounded-full
            bg-[#d72638]
            px-6
            py-3
            text-[11px]
            uppercase
            tracking-[3px]
            text-white
            transition-all
            duration-300
            hover:bg-[#bf2030]
            "
        >
            + Add Address
        </button>

    </div>

    {profile?.addresses && profile.addresses.length > 0 ? (

        <div className="mt-8 space-y-4">

            {profile.addresses.map((address: any) => (

                <div
                    key={address.id}
                    className="
                    rounded-2xl
                    border
                    border-white/10
                    bg-[#111111]
                    p-5
                    "
                >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                        <div className="flex-1">

                            <div className="flex flex-wrap items-center gap-3">

                                <h3
                                    className="
                                    text-lg
                                    font-medium
                                    text-white
                                    "
                                >
                                    {address.fullName}
                                </h3>

                                {address.isDefault && (

                                    <span
                                        className="
                                        rounded-full
                                        border
                                        border-green-500/30
                                        bg-green-500/10
                                        px-3
                                        py-1
                                        text-[10px]
                                        uppercase
                                        tracking-[2px]
                                        text-green-400
                                        "
                                    >
                                        Default
                                    </span>

                                )}

                            </div>

                            <p className="mt-3 text-gray-300">
                                {address.phone}
                            </p>

                            <div className="mt-4 space-y-1 text-sm text-gray-400">

                                <p>{address.addressLine1}</p>

                                {address.addressLine2 && (
                                    <p>{address.addressLine2}</p>
                                )}

                                <p>
                                    {address.city}, {address.state}
                                </p>

                                <p>
                                    {address.country} - {address.postalCode}
                                </p>

                            </div>

                        </div>

                        <div className="flex gap-3">

                            <button
                                className="
                                rounded-full
                                border
                                border-[#d72638]
                                px-5
                                py-2
                                text-[11px]
                                uppercase
                                tracking-[2px]
                                text-[#ff7a86]
                                transition-all
                                duration-300
                                hover:bg-[#d72638]
                                hover:text-white
                                "
                            >
                                Edit
                            </button>

                            <button
                                className="
                                rounded-full
                                border
                                border-white/10
                                px-5
                                py-2
                                text-[11px]
                                uppercase
                                tracking-[2px]
                                text-gray-300
                                transition-all
                                duration-300
                                hover:border-red-500
                                hover:text-red-400
                                "
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            ))}

        </div>

    ) : (

        <div
            className="
            mt-8
            rounded-2xl
            border
            border-dashed
            border-white/10
            bg-[#111111]
            px-8
            py-14
            text-center
            "
        >

            <p
                className="
                text-[11px]
                uppercase
                tracking-[4px]
                text-[#ff7a86]
                "
            >
                No Address
            </p>

            <h3
                className="
                mt-3
                text-2xl
                font-light
                uppercase
                tracking-[2px]
                text-white
                "
                style={{
                    fontFamily: "'Montserrat', sans-serif",
                }}
            >
                No Saved Addresses
            </h3>

            <p className="mt-4 text-sm leading-7 text-gray-400">
                Add your first delivery address for a faster checkout experience.
            </p>

            <button
                onClick={() => setShowAddressModal(true)}
                className="
                mt-8
                rounded-full
                bg-[#d72638]
                px-8
                py-3
                text-[11px]
                uppercase
                tracking-[3px]
                text-white
                transition-all
                duration-300
                hover:bg-[#bf2030]
                "
            >
                Add Address
            </button>

        </div>

    )}

</div>
{showAddressModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">

    <div
      className="
        w-full
        max-w-2xl
        rounded-3xl
        border
        border-white/10
        bg-[#181818]
        shadow-2xl
        overflow-hidden
      "
    >

      {/* Header */}

      <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

        <div>

          <p
            className="
              text-[11px]
              uppercase
              tracking-[4px]
              text-[#ff7a86]
            "
          >
            Delivery
          </p>

          <h2
            className="
              mt-1
              text-2xl
              font-light
              uppercase
              tracking-[2px]
              text-white
            "
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            Add Address
          </h2>

        </div>

        <button
          onClick={() => setShowAddressModal(false)}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-white/10
            text-gray-400
            transition
            hover:border-[#d72638]
            hover:text-white
          "
        >
          ✕
        </button>

      </div>

      {/* Form */}

      <div className="max-h-[65vh] overflow-y-auto p-6">

        <div className="grid gap-5 md:grid-cols-2">

          {/* Full Name */}

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={addressForm.fullName}
              onChange={handleAddressChange}
              placeholder="Full Name"
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

          {/* Phone */}

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              Phone
            </label>

            <input
              type="text"
              name="phone"
              value={addressForm.phone}
              onChange={handleAddressChange}
              placeholder="Phone Number"
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

        </div>

        {/* Address */}

        <div className="mt-5">

          <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
            Address
          </label>

          <textarea
            rows={3}
            name="addressLine1"
            value={addressForm.addressLine1}
            onChange={handleAddressChange}
            placeholder="House No, Street..."
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111111]
              px-4
              py-3
              text-white
              placeholder:text-gray-500
              outline-none
              focus:border-[#d72638]
            "
          />

        </div>

        {/* Landmark */}

        <div className="mt-5">

          <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
            Landmark
          </label>

          <input
            type="text"
            name="addressLine2"
            value={addressForm.addressLine2}
            onChange={handleAddressChange}
            placeholder="Optional"
            className="
              w-full
              rounded-xl
              border
              border-white/10
              bg-[#111111]
              px-4
              py-3
              text-white
              placeholder:text-gray-500
              outline-none
              focus:border-[#d72638]
            "
          />

        </div>

        {/* City State */}

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              City
            </label>

            <input
              type="text"
              name="city"
              value={addressForm.city}
              onChange={handleAddressChange}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              State
            </label>

            <input
              type="text"
              name="state"
              value={addressForm.state}
              onChange={handleAddressChange}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

        </div>

        {/* Country + Postal */}

        <div className="mt-5 grid gap-5 md:grid-cols-2">

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              Country
            </label>

            <input
              type="text"
              name="country"
              value={addressForm.country}
              onChange={handleAddressChange}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

          <div>

            <label className="mb-2 block text-xs uppercase tracking-[2px] text-gray-400">
              Postal Code
            </label>

            <input
              type="text"
              name="postalCode"
              value={addressForm.postalCode}
              onChange={handleAddressChange}
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#111111]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#d72638]
              "
            />

          </div>

        </div>

        {/* Default */}

        <label className="mt-6 flex items-center gap-3 text-sm text-gray-300">

          <input
            type="checkbox"
            name="isDefault"
            checked={addressForm.isDefault}
            onChange={handleAddressChange}
            className="h-4 w-4 accent-[#d72638]"
          />

          Set as default address

        </label>

      </div>

      {/* Footer */}

      <div className="flex justify-end gap-3 border-t border-white/10 px-6 py-5">

        <button
          onClick={() => setShowAddressModal(false)}
          className="
            rounded-full
            border
            border-white/10
            px-6
            py-3
            text-[11px]
            uppercase
            tracking-[2px]
            text-gray-300
            transition
            hover:border-white/30
          "
        >
          Cancel
        </button>

        <button
          onClick={handleSaveAddress}
          className="
            rounded-full
            bg-[#d72638]
            px-7
            py-3
            text-[11px]
            uppercase
            tracking-[3px]
            text-white
            transition
            hover:bg-[#bf2030]
          "
        >
          Save Address
        </button>
        </div>

    </div>

  </div>
)}
      </div>
    </div>
  
  );
};

export default Profile;


