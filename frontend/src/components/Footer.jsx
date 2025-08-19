export default function Footer() {
    return (
      <footer className="bg-gray-100 text-gray-700 mt-20 pt-10 pb-6 px-6 sm:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-12">
          {/* Logo + Description */}
          <div>
            <h2 className="text-2xl font-bold tracking-wider text-gray-800">
              FOREVER<span className="text-pink-600">.</span>
            </h2>
            <p className="mt-4 text-sm leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s 
              standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it.
            </p>
          </div>
  
          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">COMPANY</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-black">Home</a></li>
              <li><a href="#" className="hover:text-black">About us</a></li>
              <li><a href="#" className="hover:text-black">Delivery</a></li>
              <li><a href="#" className="hover:text-black">Privacy policy</a></li>
            </ul>
          </div>
  
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">GET IN TOUCH</h3>
            <p className="text-sm">+1-212-456-7890</p>
            <p className="text-sm mt-2">contact@foreveryou.com</p>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="mt-10 border-t pt-4 text-center text-xs text-gray-500">
          © Copyright 2024 @ forever.com — All Rights Reserved.
        </div>
      </footer>
    );
  }
  