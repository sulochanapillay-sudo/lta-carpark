import React, { useEffect } from 'react';
import { MessageSquare, ShieldCheck, Heart } from 'lucide-react';

// Fixed canonical URL & Identifier for Disqus integration
export const DISQUS_PAGE_URL = 'https://sulochana-citymapper.disqus.com/lta-carpark';
export const DISQUS_PAGE_IDENTIFIER = 'sg-lta-carpark-feedback-v1';
export const DISQUS_PAGE_TITLE = 'Singapore LTA Carpark Community Feedback';

declare global {
  interface Window {
    disqus_config?: (this: {
      page: {
        url: string;
        identifier: string;
        title?: string;
      };
    }) => void;
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: (this: {
          page: {
            url: string;
            identifier: string;
            title?: string;
          };
        }) => void;
      }) => void;
    };
  }
}

interface FeedbackFooterProps {
  className?: string;
}

export const FeedbackFooter: React.FC<FeedbackFooterProps> = ({ className = '' }) => {
  useEffect(() => {
    // Single-Page Application (SPA) reload configuration for Disqus
    const configureAndLoadDisqus = () => {
      if (typeof window === 'undefined') return;

      if (window.DISQUS) {
        // If Disqus is already loaded, reset it for this page view in the SPA
        window.DISQUS.reset({
          reload: true,
          config: function () {
            this.page.url = DISQUS_PAGE_URL;
            this.page.identifier = DISQUS_PAGE_IDENTIFIER;
            this.page.title = DISQUS_PAGE_TITLE;
          },
        });
      } else {
        // First-time load: configure parameters and inject embed script
        window.disqus_config = function () {
          this.page.url = DISQUS_PAGE_URL;
          this.page.identifier = DISQUS_PAGE_IDENTIFIER;
          this.page.title = DISQUS_PAGE_TITLE;
        };

        const existingScript = document.getElementById('disqus-embed-script') as HTMLScriptElement | null;
        if (!existingScript) {
          const d = document;
          const s = d.createElement('script');
          s.id = 'disqus-embed-script';
          s.src = 'https://sulochana-citymapper.disqus.com/embed.js';
          s.setAttribute('data-timestamp', String(+new Date()));
          (d.head || d.body).appendChild(s);
        } else {
          // Script already inserted but DISQUS object still initializing
          const handleScriptLoad = () => {
            if (window.DISQUS) {
              window.DISQUS.reset({
                reload: true,
                config: function () {
                  this.page.url = DISQUS_PAGE_URL;
                  this.page.identifier = DISQUS_PAGE_IDENTIFIER;
                  this.page.title = DISQUS_PAGE_TITLE;
                },
              });
            }
          };
          existingScript.addEventListener('load', handleScriptLoad, { once: true });
        }
      }
    };

    configureAndLoadDisqus();
  }, []);

  return (
    <footer id="feedback-footer" className={`mt-8 border-t border-slate-200/90 pt-6 pb-12 ${className}`}>
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Leave your comments here ! :)
              </h3>
              <p className="text-xs text-slate-500">
                Share parking updates, report lot count discrepancies, or leave feedback
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Disqus Live Thread</span>
          </div>
        </div>

        {/* Disqus Thread Container */}
        <div className="min-h-[200px]">
          <div id="disqus_thread"></div>
          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-emerald-600 underline">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>

        {/* Footer Attribution */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
          <span>Singapore LTA & HDB Live Carpark Availability Portal</span>
          <span className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Singapore Motorists
          </span>
        </div>
      </div>
    </footer>
  );
};
