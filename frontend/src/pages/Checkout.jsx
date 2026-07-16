import React, { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Razorpay Script load karne ke liye
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    try {
      // 1. Backend se Order ID mangwayein
      const orderRes = await fetch('https://shopnest-ecom-mern-1-2s81.onrender.com/api/payment/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        if (window.confirm("Payment gateway issue. Bypass for testing?")) {
            return bypassPayment();
        }
        return alert("Payment failed to initialize");
      }

      // 2. Razorpay Options
      const options = {
        key: 'rzp_test_T9f6nxQ6TlNKXI',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShopNest',
        order_id: orderData.id,
        handler: async function (response) {
          // Verification
          const verifyRes = await fetch('https://shopnest-ecom-mern-1-2s81.onrender.com/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });

          if (verifyRes.ok) {
            // Save Order
            const saveOrderRes = await fetch('https://shopnest-ecom-mern-1-2s81.onrender.com/api/orders', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems.map(item => ({ product: item.product || item._id, qty: item.qty, price: item.price })),
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              alert('Order saving failed');
            }
          }
        },
        prefill: { name: address.fullName, email: user?.email },
        theme: { color: '#f97316' }
      };

      // 3. Open Popup
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch("https://shopnest-ecom-mern-1-2s81.onrender.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({
            items: cartItems.map((item) => ({ product: item.product || item._id, qty: item.qty, price: item.price })),
            totalAmount: totalPrice,
            address,
            paymentId: "bypass_" + Date.now(),
        }),
    });
    if(saveOrderRes.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    handlePayment();
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="shipping-form">
        <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
        <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
        <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
        <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
        <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
        <h4>Total: ₹{totalPrice.toFixed(2)}</h4>
        <button type="submit" className="btn">Pay Now</button>
      </form>
    </div>
  );
};

export default Checkout;