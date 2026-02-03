"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface ProductResult {
  id: string;
  code: string;
  description: string;
  verified: boolean;
}

interface EtiquetadoSearchProps {
  value: string;
  onChange: (value: string, description?: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
}

const DEBOUNCE_MS = 300;
const MIN_CHARS = 2;

export function EtiquetadoSearch({
  value,
  onChange,
  placeholder = "Ingrese la etiqueta del vidrio",
  id = "etiquetado",
  name = "etiquetado",
}: EtiquetadoSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<ProductResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasUserTypedRef = useRef(false);
  const isSelectingRef = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search - only when user has typed
  useEffect(() => {
    // Don't search if user hasn't typed yet or if user just selected a value
    if (!hasUserTypedRef.current || isSelectingRef.current) {
      isSelectingRef.current = false;
      return;
    }

    if (value.length < MIN_CHARS) {
      setResults([]);
      setIsOpen(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(async () => {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch(
          `/api/inventory/search?q=${encodeURIComponent(value)}&limit=20`,
          { signal: abortControllerRef.current.signal }
        );

        if (!response.ok) {
          throw new Error("Error al buscar productos");
        }

        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
        setHighlightedIndex(-1);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Error desconocido");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [value]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      hasUserTypedRef.current = true;
      onChange(e.target.value);
    },
    [onChange]
  );

  const handleSelect = useCallback(
    (product: ProductResult) => {
      isSelectingRef.current = true;
      onChange(product.code, product.description);
      setIsOpen(false);
      setResults([]);
      inputRef.current?.blur();
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < results.length) {
            handleSelect(results[highlightedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, highlightedIndex, handleSelect]
  );

  const handleFocus = useCallback(() => {
    if (value.length >= MIN_CHARS && results.length > 0) {
      setIsOpen(true);
    }
  }, [value.length, results.length]);

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="input-base"
          placeholder={placeholder}
          autoComplete="off"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {/* Loading spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg
              className="w-4 h-4 text-blue-500 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {error ? (
            <div className="px-4 py-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No se encontraron resultados para &quot;{value}&quot;
            </div>
          ) : (
            <ul role="listbox">
              {results.map((product, index) => (
                <li
                  key={product.id}
                  role="option"
                  aria-selected={index === highlightedIndex}
                  onClick={() => handleSelect(product)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`px-4 py-2 cursor-pointer transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {product.code}
                    </span>
                    {product.verified && (
                      <span title="Verificado">
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {product.description}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Helper text */}
      {value.length > 0 && value.length < MIN_CHARS && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Escribe al menos {MIN_CHARS} caracteres para buscar
        </p>
      )}
    </div>
  );
}
