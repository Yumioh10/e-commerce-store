import { createFileRoute, Link } from '@tanstack/react-router';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';
import { Check } from 'lucide-react'
import { motion } from 'motion/react';

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-medical-text mb-4">Empty Cart</h2>
        <p className="text-medical-text-secondary mb-6">Add some products before checkout.</p>
        <Link to="/products" className="bg-brand-primary text-white px-6 py-3 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-medical-text mb-8">Secure Medical Checkout</h1>

      {/*Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                currentStep >= step ? 'bg-brand-primary text-white' : 'bg-medical-gray text-medical-text-secondary'
              }`}
            >
              {step}
            </div>
            <span className={`text-sm ${currentStep >= step ? 'text-brand-primary' : 'text-medical-text-secondary'}`}>
              {step === 1 && 'Shipping'}
              {step === 2 && 'Payment'}
              {step === 3 && 'Confirm'}
            </span>
          </div>
        ))}
      </div>

      {/*Checkout Steps */}
      <div className="bg-medical-white rounded-lg p-6 shadow-sm">
        {currentStep === 1 && (
          <ShippingForm onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <PaymentForm onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />
        )}
        {currentStep === 3 && (
          <OrderConfirmation onComplete={clearCart} />
        )}
      </div>

      {/*Order Summary Sidebar */}
      <div className="mt-8 bg-medical-white rounded-lg p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between py-2">
            <span className="text-sm">{item.name} x {item.quantity}</span>
            <span className="text-sm">{(item.price * item.quantity).toFixed(2)} Dh</span>
          </div>
        ))}
        <div className="border-t border-medical-gray mt-4 pt-4 flex justify-between font-bold">
          <span>Total</span>
          <span>{total().toFixed(2)} Dh</span>
        </div>
      </div>
    </div>
  );
}

function ShippingForm({ onNext }: { onNext: () => void }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
  });

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <input
        type="text"
        placeholder="Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
        className="w-full px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
        />
        <input
          type="text"
          placeholder="Postal Code"
          value={form.postalCode}
          onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
          className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg font-medium"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

function PaymentForm({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div className="space-y-4">
        <label className="flex items-center space-x-3">
          <input type="radio" name="payment" value="card" defaultChecked className="text-brand-primary" />
          <span>Credit/Debit Card</span>
        </label>
        <label className="flex items-center space-x-3">
          <input type="radio" name="payment" value="paypal" className="text-brand-primary" />
          <span>PayPal</span>
        </label>
      </div>

      <div className="space-y-4 mt-6">
        <input
          type="text"
          placeholder="Card Number"
          className="w-full px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
          maxLength={16}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="MM/YY"
            className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
          />
          <input
            type="text"
            placeholder="CVV"
            className="px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
          />
        </div>
      </div>

      <div className="space-y-4 mt-6">
        <label className="flex items-start space-x-3">
          <input type="checkbox" defaultChecked className="mt-1 text-brand-primary" />
          <div className="text-sm">
            <p className="font-medium">Medical Disclaimer</p>
            <p className="text-medical-text-secondary">
              I confirm that I have consulted with a healthcare professional about the use of these medical cosmetics.
            </p>
          </div>
        </label>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="border border-brand-primary text-brand-primary px-6 py-3 rounded-lg">
          Back
        </button>
        <button onClick={onNext} className="bg-brand-primary hover:bg-brand-secondary text-white px-6 py-3 rounded-lg">
          Review & Confirm
        </button>
      </div>
    </div>
  );
}

function OrderConfirmation({ onComplete }: { onComplete: () => void }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('')

  const handlePlaceOrder = () => {
    setOrderNumber(`MS-${Date.now()}`);
    setOrderPlaced(true);
    onComplete();
  };

  return orderPlaced ? (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Check className="w-8 h-8 text-green-600" />
      </motion.div>
      <h2 className="text-2xl font-bold text-medical-text mb-2">Order Confirmed!</h2>
      <p className="text-medical-text-secondary mb-6">Your medical cosmetics order has been placed successfully.</p>
      <div className="bg-medical-gray rounded-lg p-4 mb-6">
        <p className="text-sm">Order Number: <span className="font-mono font-bold">{orderNumber}</span></p>
        <p className="text-sm">Confirmation email sent to your registered address.</p>
      </div>
      <Link to="/products" className="bg-brand-primary text-white px-6 py-3 rounded-lg">
        Continue Shopping
      </Link>
    </div>
  ) : (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Review Your Order</h2>
      <div className="bg-medical-gray rounded-lg p-4">
        <p className="text-sm mb-2">
          <span className="font-medium">Shipping Address:</span> [Your shipping address will appear here]
        </p>
        <p className="text-sm">
          <span className="font-medium">Payment Method:</span> Card ending in ••••
        </p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handlePlaceOrder}
          className="bg-brand-primary hover:bg-brand-secondary text-white px-8 py-3 rounded-lg font-medium"
        >
          Place Secure Order
        </button>
      </div>
    </div>
  );
}