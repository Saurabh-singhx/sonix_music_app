import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for cleaner tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      // Primary: Solid White on Black
      primary: 'bg-white text-black hover:bg-neutral-200 border-transparent',
      // Secondary: Transparent with White Border
      secondary: 'bg-transparent text-white border-white hover:bg-white/10',
      // Ghost: Subtle text
      ghost: 'bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 border-transparent',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-11 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:pointer-events-none border',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

/**
 * ProgressBar Component
 * Visual indicator of usage in Black & White.
 */
const ProgressBar = ({ value, max }: { value: number; max: number }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-neutral-500">
        <span>Usage</span>
        <span className={percentage >= 100 ? 'text-white' : ''}>{Math.round(percentage)}% Used</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-900 border border-neutral-800">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-500",
            percentage >= 100 ? "bg-white" : "bg-neutral-500"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

/**
 * LimitReachedModal Component
 * The main interactive popup - BLACK & WHITE DARK MODE.
 */
interface LimitReachedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAccount: () => void;
  currentUsage?: number;
  limit?: number;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  isOpen,
  onClose,
  onCreateAccount,
  currentUsage = 100,
  limit = 100,
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Pure Black with slight opacity */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md"
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl bg-black border border-white/20 shadow-2xl shadow-white/5"
            >
              {/* Decorative Background Elements - White Glows */}
              <div className="absolute top-0 left-0 w-full h-1 bg-white" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-3xl opacity-50 pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-full text-neutral-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Content */}
              <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                
                {/* Icon - White Circle */}
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-black"
                >
                  <AlertCircle className="h-10 w-10" strokeWidth={1.5} />
                </motion.div>

                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
                    Limit Reached
                  </h2>
                  <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                    You've reached your limit. Create a free account to unlock unlimited access.
                  </p>
                </motion.div>

                {/* Progress Indicator (Context) */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-full mt-8 mb-8"
                >
                  <ProgressBar value={currentUsage} max={limit} />
                </motion.div>

                {/* Features List (Value Proposition) - Dark Cards */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-full space-y-3 mb-8 text-left bg-neutral-900/50 p-5 rounded-2xl border border-white/10"
                >
                  {[ 
                    'Unlimited generations', 
                    'Priority support', 
                    'Advanced analytics' 
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center text-sm text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 mr-3 text-white" />
                      {feature}
                    </div>
                  ))}
                </motion.div>

                {/* Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="w-full space-y-3"
                >
                  <Button 
                    onClick={onCreateAccount} 
                    className="w-full group"
                    size="lg"
                  >
                    Create Free Account
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    onClick={onClose} 
                    className="w-full"
                  >
                    Maybe Later
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Main Page / Demo - DARK MODE ---

// export default function LimitReachedDemo() {
//   const [isLimitReached, setIsLimitReached] = useState(false);
//   const [usage, setUsage] = useState(85);

//   // Simulate reaching the limit
//   const simulateUsage = () => {
//     setUsage(prev => {
//       const newVal = prev + 25;
//       if (newVal >= 100) {
//         setIsLimitReached(true);
//         return 100;
//       }
//       return newVal;
//     });
//   };

//   const handleCreateAccount = () => {
//     // In a real app, this would redirect to /signup
//     alert("Redirecting to /signup...");
//     setIsLimitReached(false);
//   };

//   return (
//     <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      
//       {/* Navbar Mockup - Dark */}
//       <nav className="sticky top-0 z-30 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
//         <div className="container mx-auto flex h-16 items-center justify-between px-4">
//           <div className="flex items-center gap-2">
//             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
//               <Zap className="h-5 w-5" fill="currentColor" />
//             </div>
//             <span className="text-lg font-bold tracking-tight">DarkMode</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-neutral-500">
//               <span>Current Plan:</span>
//               <span className="rounded-full bg-neutral-900 border border-white/10 px-2.5 py-0.5 text-white">Free</span>
//             </div>
//             <div className="h-8 w-8 rounded-full bg-neutral-800 border border-white/10" />
//           </div>
//         </div>
//       </nav>

//       {/* Main Content Area - Dark */}
//       <main className="container mx-auto px-4 py-12">
//         <div className="mx-auto max-w-2xl">
          
//           {/* Dashboard Card - Dark */}
//           <div className="overflow-hidden rounded-3xl bg-neutral-950 border border-white/10 shadow-2xl">
//             <div className="p-8">
//               <h1 className="text-3xl font-bold mb-2 text-white">Dashboard</h1>
//               <p className="text-neutral-500 mb-8">Manage your usage and account settings.</p>

//               {/* Interactive Usage Widget - Dark */}
//               <div className="mb-8 rounded-2xl bg-neutral-900/30 p-6 border border-white/5">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-white">API Requests</h3>
//                   <span className="text-sm text-neutral-500">{usage} / 100</span>
//                 </div>
//                 <ProgressBar value={usage} max={100} />
                
//                 <div className="mt-6 flex gap-4">
//                   <Button 
//                     onClick={simulateUsage} 
//                     variant="secondary" 
//                     className="flex-1"
//                     disabled={usage >= 100}
//                   >
//                     {usage >= 100 ? 'Limit Reached' : 'Simulate API Call'}
//                   </Button>
//                   <Button 
//                     onClick={() => setUsage(0)} 
//                     variant="ghost"
//                     disabled={usage === 0}
//                   >
//                     Reset
//                   </Button>
//                 </div>
//               </div>

//               {/* Dummy Content Grid - Dark */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                 {[1, 2, 3, 4].map((i) => (
//                   <div key={i} className="h-32 rounded-2xl bg-neutral-900 border border-white/5 animate-pulse" />
//                 ))}
//               </div>
//             </div>
//           </div>

//         </div>
//       </main>

//       {/* The Modal Component */}
//       <LimitReachedModal 
//         isOpen={isLimitReached} 
//         onClose={() => setIsLimitReached(false)} 
//         onCreateAccount={handleCreateAccount}
//         currentUsage={usage}
//         limit={100}
//       />

//     </div>
//   );
// }