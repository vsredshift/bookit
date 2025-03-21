"use client";

import cancelBooking from "@/app/actions/cancelBooking";
import { toast } from "react-toastify";

const CancelBookingButton = ({ bookingId }) => {
  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking")) return;

    try {
      const result = await cancelBooking(bookingId);

      if (result.success) {
        toast.success("Booking successfully cancelled");
      }
    } catch (error) {
      console.error("Failed to cancel booking: ", error);
      toast.error("Something went wrong cancelling booking");
    }
  };

  return (
    <>
      <button
        onClick={handleCancelBooking}
        className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-center hover:bg-red-700"
      >
        Cancel Booking
      </button>
    </>
  );
};

export default CancelBookingButton;
