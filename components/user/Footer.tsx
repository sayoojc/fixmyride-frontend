import Link from "next/link"

type SiteFooterProps = {
  companyName?: string
}

export default function Footer({ companyName = "FixMyRide" }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-white border-t border-red-800">
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white">{companyName}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-300">
              Reliable car care, transparent pricing, and expert technicians. Book your next service with confidence.
            </p>
          </div>

          {/* Services */}
          <nav aria-label="Services" className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <Link href="#general" className="text-sm text-gray-300 hover:text-red-500">
              General Service
            </Link>
            <Link href="#diagnostics" className="text-sm text-gray-300 hover:text-red-500">
              Diagnostics
            </Link>
            <Link href="#maintenance" className="text-sm text-gray-300 hover:text-red-500">
              Scheduled Maintenance
            </Link>
            <Link href="#repairs" className="text-sm text-gray-300 hover:text-red-500">
              Repairs
            </Link>
          </nav>

          {/* Support */}
          <nav aria-label="Support" className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <Link href="/help" className="text-sm text-gray-300 hover:text-red-500">
              Help Center
            </Link>
            <Link href="/contact" className="text-sm text-gray-300 hover:text-red-500">
              Contact Us
            </Link>
            <Link href="/booking" className="text-sm text-gray-300 hover:text-red-500">
              Manage Booking
            </Link>
            <Link href="/faq" className="text-sm text-gray-300 hover:text-red-500">
              FAQs
            </Link>
          </nav>

          {/* Legal / Social */}
          <div className="flex flex-col gap-4">
            <nav aria-label="Legal" className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold text-white">Legal</h3>
              <Link href="/terms" className="text-sm text-gray-300 hover:text-red-500">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-red-500">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-300 hover:text-red-500">
                Cookie Policy
              </Link>
            </nav>

            <div className="flex items-center gap-3" aria-label="Social links">
              <Link href="https://twitter.com" aria-label="Twitter" className="text-gray-300 hover:text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" className="inline">
                  <path
                    d="M22 5.75c-.7.3-1.46.5-2.25.6a3.78 3.78 0 0 0 1.66-2.08 7.56 7.56 0 0 1-2.4.92 3.77 3.77 0 0 0-6.42 3.43A10.7 10.7 0 0 1 3.2 4.7a3.77 3.77 0 0 0 1.16 5.03 3.74 3.74 0 0 1-1.7-.47v.05c0 1.82 1.3 3.34 3.02 3.69-.32.09-.66.14-1 .14-.25 0-.49-.02-.72-.07.49 1.53 1.92 2.65 3.61 2.68A7.56 7.56 0 0 1 2 18.56a10.67 10.67 0 0 0 5.78 1.7c6.93 0 10.73-5.74 10.73-10.72v-.49c.74-.53 1.38-1.2 1.89-1.96Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook" className="text-gray-300 hover:text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" className="inline">
                  <path
                    d="M13.5 22v-8.5h2.85l.43-3.3H13.5V8.19c0-.96.27-1.61 1.66-1.61h1.78V3.6c-.31-.04-1.38-.13-2.62-.13-2.6 0-4.38 1.58-4.38 4.47v2.49H7.5v3.3h2.44V22h3.56Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-gray-300 hover:text-red-500">
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" className="inline">
                  <path
                    d="M12 7.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5.95-8.3a1.12 1.12 0 1 0 0-2.24 1.12 1.12 0 0 0 0 2.24ZM21 7.26c-.05-1.07-.3-2.02-1.1-2.82-.8-.8-1.75-1.05-2.82-1.1-1.11-.06-4.44-.06-5.55 0-1.07.05-2.02.3-2.82 1.1-.8.8-1.05 1.75-1.1 2.82-.06 1.11-.06 4.44 0 5.55.05 1.07.3 2.02 1.1 2.82.8.8 1.75 1.05 2.82 1.1 1.11.06 4.44.06 5.55 0 1.07-.05 2.02-.3 2.82-1.1.8-.8 1.05-1.75 1.1-2.82.06-1.11.06-4.44 0-5.55Zm-2 7.26c-.03.73-.2 1.13-.32 1.4-.22.4-.47.65-.87.87-.27.12-.67.3-1.4.32-1.1.05-4.41.05-5.51 0-.73-.03-1.13-.2-1.4-.32-.4-.22-.65-.47-.87-.87-.12-.27-.3-.67-.32-1.4-.05-1.1-.05-4.41 0-5.51.03-.73.2-1.13.32-1.4.22-.4.47-.65.87-.87.27-.12.67-.3 1.4-.32 1.1-.05 4.41-.05 5.51 0 .73.03 1.13.2 1.4.32.4.22.65.47.87.87.12.27.3.67.32 1.4.05 1.1.05 4.41 0 5.51Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-red-800 pt-6 text-center sm:flex sm:items-center sm:justify-between">
          <p className="text-xs text-gray-300">
            &copy; {year} {companyName}. All rights reserved.
          </p>
          <p className="mt-3 text-xs text-gray-300 sm:mt-0">
            Need help?{" "}
            <Link href="/contact" className="underline underline-offset-4 hover:text-red-500">
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
