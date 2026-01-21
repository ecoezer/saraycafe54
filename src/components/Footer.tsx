import React, { useState } from 'react';
import { MapPin, Phone, Heart, FileText } from 'lucide-react';

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const [showAllergens, setShowAllergens] = useState(false);
  const [showImpressum, setShowImpressum] = useState(false);
  const allergensRef = React.useRef<HTMLDivElement>(null);
  const impressumRef = React.useRef<HTMLDivElement>(null);
  const phoneNumber = '+4915224290621';
  const displayNumber = '01522 429 06 21';

  const handleAllergensToggle = () => {
    const newState = !showAllergens;
    setShowAllergens(newState);

    if (newState && allergensRef.current) {
      setTimeout(() => {
        allergensRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  };

  const handleImpressumToggle = () => {
    const newState = !showImpressum;
    setShowImpressum(newState);

    if (newState && impressumRef.current) {
      setTimeout(() => {
        impressumRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  };

  const handleWhatsApp = async (e: React.MouseEvent) => {
    e.preventDefault();

    const whatsappURL = `https://wa.me/${phoneNumber}`;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail: clipboard might not be supported/allowed
    }

    try {
      if (isMobile) {
        const win = window.open(whatsappURL, '_blank');
        if (!win || win.closed || typeof win.closed === 'undefined') window.location.href = whatsappURL;
      } else {
        window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.location.href = whatsappURL;
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-light-blue-50 border-t-2 border-light-blue-400 py-4">
      <div className="container mx-auto px-4 max-w-lg text-center space-y-3">
        {/* Impressum - Expandable */}
        <div ref={impressumRef} className="bg-white/60 rounded-xl p-4">
          <button
            onClick={handleImpressumToggle}
            className="w-full text-center hover:bg-white/80 transition-colors rounded-lg p-2"
          >
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4 text-light-blue-600" />
              <h3 className="font-bold text-gray-800 text-base">
                Impressum
                <span className="text-light-blue-600 ml-2 underline text-sm">
                  {showImpressum ? 'Ausblenden' : 'Hier klicken zum Ansehen'}
                </span>
              </h3>
            </div>
          </button>

          {showImpressum && (
            <div className="mt-4 text-left text-sm text-gray-700 space-y-2 border-t border-gray-300 pt-4">
              <div>
                <p className="font-semibold">Saray Kebap Café54</p>
                <p>Hauptstraße 96c</p>
                <p>31171 Nordstemmen</p>
              </div>
              <div>
                <p className="font-semibold">Telefon: 05069 8989997</p>
                <p className="text-xs pt-2 border-t border-gray-300">
                  <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-light-blue-600 hover:underline">
                    EU Online-Streitbeilegung
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        <div className="bg-white/60 rounded-xl p-3 hover:bg-white/80 transition-colors">
          <div className="flex justify-center mb-1">
            <div className="p-1.5 bg-light-blue-100 rounded-full">
              <MapPin className="h-3.5 w-3.5 text-light-blue-600" />
            </div>
          </div>
          <div className="font-bold text-gray-800 text-sm">🏠 HAUPTSTRASSE 96C</div>
          <div className="text-xs text-gray-600">📮 31171 NORDSTEMMEN</div>
          <p className="text-xs text-gray-500">🚗 Saray Kebap Café54 Lieferservice</p>
        </div>

        {/* WhatsApp Button */}
        <div className="relative">
          <a
            href={`https://wa.me/${phoneNumber}`}
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl p-3 shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <div className="p-1.5 bg-white/20 rounded-full">
              <Phone className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-medium">💬 WhatsApp & Anrufen</div>
              <div className="font-bold">{displayNumber}</div>
            </div>
          </a>
          {copied && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs select-none">
              ✅ Kopyalandı!
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-gray-300" />
          <Heart className="h-3.5 w-3.5 text-light-blue-400" />
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Footer Text */}
        <div className="space-y-0.5">
          <div className="font-medium text-gray-700 text-sm">
            🍽️ Leckere Döner, Pizza & mehr in Nordstemmen
          </div>
          <p className="text-xs text-gray-500">
            © 2025 Saray Kebap Café54 - Alle Rechte vorbehalten
          </p>
        </div>

        {/* Allergens and Additives - Expandable */}
        <div ref={allergensRef} className="bg-white/60 rounded-xl p-4">
          <button
            onClick={handleAllergensToggle}
            className="w-full text-center hover:bg-white/80 transition-colors rounded-lg p-2"
          >
            <h3 className="font-bold text-gray-800 text-sm">
              Allergene und Zusatzstoffe:
              <span className="text-light-blue-600 ml-2 underline">
                {showAllergens ? 'Ausblenden' : 'Hier klicken zum Ansehen'}
              </span>
            </h3>
          </button>

          {showAllergens && (
            <div className="mt-4 text-left text-xs text-gray-700 space-y-1 leading-relaxed border-t border-gray-300 pt-4">
              <p><strong>(1)</strong> mit Süßungsmitteln, <strong>(2)</strong> chininhaltig, <strong>(3)</strong> mit Farbstoffen</p>
              <p><strong>(3.1)</strong> Könnten die Aktivität und Aufmerksamkeit von Kindern beeinträchtigen</p>
              <p><strong>(4)</strong> koffeinhaltig</p>
              <p><strong>(4.1)</strong> enthält Koffein. Für Kinder, schwangere Frauen und koffeinempfindliche Personen nicht geeignet</p>
              <p><strong>(5)</strong> mit Taurin, <strong>(6)</strong> mit Antioxidationsmitteln, <strong>(7)</strong> mit Phosphat (E 338 bis E 341, E 450 bis E 452)</p>
              <p><strong>(8)</strong> mit Eiweiß, <strong>(8.1)</strong> mit Milcheiweiß, <strong>(8.2)</strong> mit Stärke</p>
              <p><strong>(9)</strong> mit Konservierungsstoffen, <strong>(9.1)</strong> mit Nitritpökelsalz, <strong>(9.2)</strong> mit Nitrat</p>
              <p><strong>(10)</strong> gewachst, <strong>(11)</strong> Schwefeldioxid (mehr als 10 mg/kg o. 10 mg/l)</p>
              <p><strong>(12)</strong> geschwärzt (Eisen-II-gluconat (E 579) oder Eisen-II-lactat (E 585)</p>
              <p><strong>(13)</strong> enthält eine Phenylalaninquelle (z.B. Aspartam), <strong>(14)</strong> mit Geschmacksverstärker</p>
              <p><strong>(15)</strong> Erhöhter Koffeingehalt. Für Kinder und Schwangere oder stillende Frauen nicht empfohlen (Getränke mit mehr als 150 mg Koffein pro Liter - hier 300 mg)</p>
              <p><strong>(16)</strong> hergestellt aus zerkleinertem Fleisch, <strong>(17)</strong> Stabilisatoren, <strong>(18)</strong> Säuerungsmittel/-regulatoren</p>
              <p><strong>(19)</strong> gentechnisch verändert</p>

              <div className="mt-3 pt-3 border-t border-gray-300">
                <p className="mb-1"><strong>A)</strong> Glutenhaltige Getreide/-erzeugnisse (a. Weizen, b. Roggen, c. Gerste, d. Hafer, e. Dinkel, f. Kamut o. g. Hybridstämme)</p>
                <p><strong>B)</strong> Sellerie/-erzeugnisse, <strong>C)</strong> Krebstiere/-erzeugnisse, <strong>D)</strong> Lupine/-erzeugnisse</p>
                <p><strong>E)</strong> Sesam/-erzeugnisse, <strong>F)</strong> Fisch/-erzeugnisse, <strong>G)</strong> Senf/-erzeugnisse</p>
                <p><strong>H)</strong> Erdnüsse/-erzeugnisse, <strong>I)</strong> Milch/-erzeugnisse (inkl. Laktose)</p>
                <p><strong>J)</strong> Schalenfrüchte (Nüsse)-erzeugnisse (a. Mandel, b. Haselnuss, c. Walnuss, d. Cashew, e. Pekannuss, f. Paranuss, g. Pistazie, h. Macadamianuss o. i. Queenslandnuss)</p>
                <p><strong>K)</strong> Eier/-erzeugnisse, <strong>L)</strong> Weichtiere/-erzeugnisse</p>
                <p><strong>M)</strong> Soja/-erzeugnisse, <strong>N)</strong> Sulfite (mehr als 10 mg/kg o. 10 mg/l)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
