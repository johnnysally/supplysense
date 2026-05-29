import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

interface FooterProps {
  settings: any
  onLegalClick: (type: string) => void
}

export default function Footer({ settings, onLegalClick }: FooterProps) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const g = settings.general || {}
  const f = settings.footer || {}
  const customColumns = f.columns?.length > 0

  return (
    <footer id="support" className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">{settings.systemName}</h3>
            <p className="text-sm text-gray-400">AI-powered supply chain intelligence.</p>
          </div>

          {customColumns ? f.columns.map((col: any, i: number) => (
            <div key={i}>
              <h4 className="text-white font-medium mb-3">{col.title}</h4>
              <ul className="space-y-2 text-sm">
                {col.links?.map((link: any, j: number) => (
                  <li key={j}>
                    {link.scrollTo ? (
                      <button onClick={() => scrollTo(link.scrollTo)} className="hover:text-white transition-colors">{link.label}</button>
                    ) : link.url ? (
                      <Link to={link.url} className="hover:text-white transition-colors">{link.label}</Link>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )) : (
            <>
              <div>
                <h4 className="text-white font-medium mb-3">Product</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button></li>
                  <li><button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">Pricing</button></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Launch App</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Company</h4>
                <ul className="space-y-2 text-sm">
                  <li><button onClick={() => scrollTo('about')} className="hover:text-white transition-colors">About</button></li>
                </ul>
              </div>
            </>
          )}

          <div>
            <h4 className="text-white font-medium mb-3">Contact</h4>
            <ul className="space-y-3 text-sm">
              {g.email && (
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{g.email}</span>
                </li>
              )}
              {g.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-gray-400 flex-shrink-0" />
                  <span>{g.phone}</span>
                </li>
              )}
              {g.address && (
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{g.address}</span>
                </li>
              )}
              {!g.email && !g.phone && !g.address && (
                <li className="text-gray-500">Contact info not set</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} {f.copyright || 'SupplySense Systems'}. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-gray-500">
            <button onClick={() => onLegalClick('terms')} className="hover:text-white transition-colors">Terms</button>
            <button onClick={() => onLegalClick('privacy')} className="hover:text-white transition-colors">Privacy</button>
            <button onClick={() => onLegalClick('cookies')} className="hover:text-white transition-colors">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  )
}