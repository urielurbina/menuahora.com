import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import logo from "@/app/icon.png";

// Add the Footer to the bottom of your landing page and more.
// The support link is connected to the config.js file. If there's no config.mailgun.supportEmail, the link won't be displayed.

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/#" className="flex items-center mb-8">
            <Image
              src={logo}
              alt={`${config.appName} logo`}
              className="w-8 h-8"
              width={32}
              height={32}
            />
            <span className="ml-3 text-xl font-bold text-gray-900">{config.appName}</span>
          </Link>
          <p className="text-gray-500 text-base max-w-md mb-8">
            {config.appDescription}
          </p>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
            {config.mailgun.supportEmail && (
              <a href={`mailto:${config.mailgun.supportEmail}`} className="text-base text-gray-500 hover:text-gray-900">
                Support
              </a>
            )}
            <Link href="/#pricing" className="text-base text-gray-500 hover:text-gray-900">
              Pricing
            </Link>
            <Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">
              Blog
            </Link>
            <a href="/#" className="text-base text-gray-500 hover:text-gray-900">
              Affiliates
            </a>
            <Link href="/tos" className="text-base text-gray-500 hover:text-gray-900">
              Terms of Service
            </Link>
            <Link href="/privacy-policy" className="text-base text-gray-500 hover:text-gray-900">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} {config.appName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
