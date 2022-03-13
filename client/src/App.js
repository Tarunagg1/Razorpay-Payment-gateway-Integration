import './App.css';
import axios from 'axios';

const loadRazorPayScripts = (src) => {
  return new Promise(function (resolve) {
    const script = document.createElement('script');
    script.src = src;
    document.body.appendChild(script);
    script.onload = () => {
      resolve(true);
    }
    script.onerror = () => {
      resolve(false);
    }
  })
}


function App() {
  async function displayRazorPay() {
    const res = await loadRazorPayScripts("https://checkout.razorpay.com/v1/checkout.js");
    if (!res) {
      alert("Sdk failed to load refresh page");
      return;
    }

    const { data } = await axios.post("http://localhost:5000/razorpay");

    console.log(data);
    const options = {
      key: process.env.REACT_APP_ENV === 'production' ? process.env.REACT_APP_RAZORPAY_PROD_KEY : process.env.REACT_APP_RAZORPAY_DEV_KEY,
      currency: data.currency,
      amount: data.amount,
      name: "Donation",
      description: "donation for help",
      image: "http://localhost:1337/logo.png",
      order_id: data.id,
      handler: function (response, error) {
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
        console.log(response);
      },
      prefill: {
        name: "Anirudh Jwala",
        email: "anirudh@gmail.com",
        contact: "9999999999",
      },
    };
    console.log(options);
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }


  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <button onClick={displayRazorPay} style={{ width: '100px', padding: '15px', backgroundColor: '#3a88b1', border: 'none', color: 'white', cursor: 'pointer' }}>Donate</button>
    </div>
  );
}

export default App;
