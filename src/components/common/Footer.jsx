import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import Logo1 from "/img/logo1.svg";

export default function Footer() {
  return (
    <footer className="w-full bg-[#1e1e1e] text-[#d9c6b0]">
      <div className="container mx-auto px-4 py-8">
        {/* Main content section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-18 h-18 rounded-full bg-[#730f06] flex items-center justify-center">
                <img src={Logo1} alt="Logo" className="w-10 h-10" />
              </div>

              <span className="text-lg font-bold text-[#b08562]">
                Clave &amp; Compas
              </span>
            </div>
            <p className="text-[#757575] text-sm">
              Tu mejor opción para la reserva de instrumentos musicales de alta
              calidad.
            </p>
          </div>
          {/* Links section */}
          <div>
            <h3 className="font-semibold text-[#b08562] mb-3">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-[#757575] hover:text-[#d9c6b0] transition-colors"
                >
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#757575] hover:text-[#d9c6b0] transition-colors"
                >
                  Nuestro Equipo
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#757575] hover:text-[#d9c6b0] transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
          {/* Contact information */}
          <div>
            <h3 className="font-semibold text-[#b08562] mb-3">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="text-[#b08562]" size={16} />
                <span className="text-[#757575]">contacto@acme.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="text-[#b08562]" size={16} />
                <span className="text-[#757575]">+9999999999</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="text-[#b08562]" size={16} />
                <span className="text-[#757575]">
                  Calle Principal 123, Buenos Aires, Argentina
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="pt-4 border-t border-[#3e0b05] text-[#757575] text-xs flex flex-col md:flex-row justify-between items-center">
          <p>
            © {new Date().getFullYear()} Clave & Compas. Todos los derechos
            reservados.
          </p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <a href="#" className="hover:text-[#d9c6b0] transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-[#d9c6b0] transition-colors">
              Términos
            </a>
            <a href="#" className="hover:text-[#d9c6b0] transition-colors">
              Cookies
            </a>
          </div>
          {/* Social media icons */}
          <div className="flex space-x-4 mb-6 border-t border-[#3e0b05] pt-6">
            <a
              href="#"
              className="text-[#757575] hover:text-[#b08562] transition-colors"
            >
              <Facebook size={18} />
              <span className="sr-only">Facebook</span>
            </a>

            <a
              href="#"
              className="text-[#757575] hover:text-[#b08562] transition-colors"
            >
              <Instagram size={18} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="text-[#757575] hover:text-[#b08562] transition-colors"
            >
              <Linkedin size={18} />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
