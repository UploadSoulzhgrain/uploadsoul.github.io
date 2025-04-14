import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from '../common/Logo';
import WaveAnimation from '../animations/WaveAnimation';

const Footer = () => {
  const { t } = useTranslation();
  
  // Fade-in animation effect for footer content
  useEffect(() => {
    const footerElements = document.querySelectorAll('.footer-animate');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.1 }
    );

    footerElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      footerElements.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 relative">
      {/* Inverted wave at top of footer */}
      <div className="absolute top-0 left-0 w-full overflow-hidden" style={{ transform: 'rotate(180deg)', height: '50px' }}>
        <WaveAnimation color="#111827" opacity={0.9} />
      </div>
      
      <div className="container mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-100">
            <div className="mb-4">
              <Logo variant="white" size="md" />
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                传灵 - 让爱与记忆永存
              </p>
              <p className="text-gray-300">
                打造专属的数字情感世界
              </p>
            </div>
          </div>
          <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-200">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">{t('footer.services.title')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/companion" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.holographicCompanion')}
                </Link>
              </li>
              <li>
                <Link to="/digital-immortality" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.digitalImmortality')}
                </Link>
              </li>
              <li>
                <Link to="/digital-rebirth" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.digitalRebirth')}
                </Link>
              </li>
              <li>
                <Link to="/vr" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.vrDevice')}
                </Link>
              </li>
              <li>
                <Link to="/all-in-one" className="text-gray-300 hover:text-white transition-colors">
                  {t('footer.services.aiAllInOne')}
                </Link>
              </li>
            </ul>
          </div>
          <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-300">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">{t('footer.aboutUs')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white hover:pl-1 transition-all duration-200">{t('footer.aboutCompany')}</Link></li>
              <li><Link to="/team" className="hover:text-white hover:pl-1 transition-all duration-200">{t('footer.team')}</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:pl-1 transition-all duration-200">{t('footer.contact')}</Link></li>
              <li><Link to="/join" className="hover:text-white hover:pl-1 transition-all duration-200">{t('footer.joinUs')}</Link></li>
            </ul>
          </div>
          <div className="footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-400">
            <h4 className="text-white font-medium mb-4 border-b border-gray-700 pb-2">{t('footer.contactMethods')}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center"><span className="text-purple-400 mr-2">@</span>{t('footer.email')}: uploadsoul@outlook.com</li>
              <li className="flex items-center"><span className="text-purple-400 mr-2">⌖</span>{t('footer.address')}: {t('footer.addressDetails')}</li>
            </ul>
          </div>
        </div>
        {/* Social Media Links */}
        <div className="flex justify-center space-x-8 mt-10 mb-8 footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-500">
          {/* GitHub */}
          <a 
            href="https://github.com/UploadSoulzhgrain/uploadsoul.github.io" 
            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">GitHub</span>
            <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </div>
          </a>
          {/* Twitter */}
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">Twitter</span>
            <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </div>
          </a>
          {/* LinkedIn */}
          <a 
            href="#" 
            className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 transform group"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="sr-only">LinkedIn</span>
            <div className="p-3 rounded-full bg-gray-800 group-hover:bg-gray-700 transition-colors duration-300">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </div>
          </a>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-sm text-center footer-animate opacity-0 translate-y-4 transition-all duration-700 delay-600">
          <p className="mb-3">© {new Date().getFullYear()} <span className="text-purple-400 font-medium">UploadSoul</span> {t('footer.platformName')}. {t('footer.copyright')}</p>
          <div className="flex justify-center space-x-6 text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors hover:underline">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-white transition-colors hover:underline">{t('footer.terms')}</Link>
            <a href="/sitemap.xml" className="hover:text-white transition-colors hover:underline">{t('footer.sitemap')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;