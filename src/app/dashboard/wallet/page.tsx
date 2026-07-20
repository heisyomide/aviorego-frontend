"use client";

import PaymentHeader from "./components/PaymentHeader";
import PaymentSummaryCard from "./components/PaymentSummaryCard";
import PaymentHistory from "./components/PaymentHistory";
import PaymentDetailsDrawer from "./components/PaymentDetailsDrawer";
import EmptyPayment from "./components/EmptyPayments";

import { usePayments } from "./hooks/usePayments";

export default function PaymentsPage() {
  const {
    loading,
    payments,
    summary,

    drawerOpen,
    selectedPayment,

    refresh,
    openPayment,
    closeDrawer,
  } = usePayments();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <PaymentHeader
        onRefresh={refresh}
      />

      {summary && (
        <PaymentSummaryCard
          summary={summary}
        />
      )}

      {(payments ??[]).length === 0 ? (
        <EmptyPayment />
      ) : (
<PaymentHistory
  payments={payments ?? []}
  onOpen={openPayment}
/>
      )}

      <PaymentDetailsDrawer
        open={drawerOpen}
        payment={selectedPayment}
        onClose={closeDrawer}
      />

    </div>
  );
}