'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    defaultValue?: string;
    size?: 'sm' | 'md' | 'lg';
    autoFocus?: boolean;
}

export function SearchBar({
    placeholder = 'Enter player tag (e.g., #ABC123)',
    defaultValue = '',
    size = 'md',
    autoFocus = false,
    type = 'player',
}: SearchBarProps & { type?: 'player' | 'club' }) {
    const [value, setValue] = useState(defaultValue);
    const [isFocused, setIsFocused] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim()) {
            // Remove # if present for URL
            const tag = value.trim().replace('#', '');
            if (type === 'club') {
                router.push(`/club/${tag}`);
            } else {
                router.push(`/player/${tag}`);
            }
        }
    };

    const handleClear = () => {
        setValue('');
    };

    const sizeClasses = {
        sm: 'py-2 px-3 pl-10 text-sm',
        md: 'py-3 px-4 pl-12 text-base',
        lg: 'py-4 px-5 pl-14 text-lg',
    };

    const iconSizes = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
            {/* Search Icon */}
            <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-cyan-400' : 'text-slate-500'
                    }`}
            >
                <Search size={iconSizes[size]} />
            </div>

            {/* Input */}
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className={`
          w-full bg-slate-900/80 text-white placeholder-slate-500
          border-2 rounded-xl outline-none transition-all duration-200
          ${sizeClasses[size]}
          ${isFocused
                        ? 'border-cyan-500/60 shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : 'border-slate-700/50 hover:border-slate-600'
                    }
        `}
            />

            {/* Clear Button */}
            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute right-16 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white transition-colors"
                >
                    <X size={iconSizes[size] - 4} />
                </button>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className={`
          absolute right-2 top-1/2 -translate-y-1/2
          bg-gradient-to-r from-amber-500 to-orange-500
          text-slate-900 font-semibold rounded-lg
          transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]
          ${size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'md' ? 'px-4 py-2 text-sm' : 'px-5 py-2.5 text-base'}
        `}
            >
                Search
            </button>
        </form>
    );
}
