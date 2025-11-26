import React, { useMemo } from "react";
import countryList from "react-select-country-list";

interface CountryOption {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

interface PhoneInputProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (dialCode: string) => void;
  onPhoneNumberChange: (phone: string) => void;
  placeholder?: string;
  className?: string;
}

// Function to get flag emoji from country code
const getFlagEmoji = (countryCode: string): string => {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  placeholder = "",
  className = "",
}) => {
  // Get all countries and create options with dial codes
  const countryOptions = useMemo((): CountryOption[] => {
    const countries = countryList().getData();
    return countries
      .map((country) => {
        // For now, we'll use a basic mapping for common dial codes
        // You may want to install libphonenumber-js for more accurate dial codes
        const dialCodeMap: { [key: string]: string } = {
          'US': '+1', 'CA': '+1', 'GB': '+44', 'FR': '+33', 'DE': '+49',
          'IT': '+39', 'ES': '+34', 'AU': '+61', 'JP': '+81', 'CN': '+86',
          'IN': '+91', 'BR': '+55', 'MX': '+52', 'RU': '+7', 'KR': '+82'
        };
        const dialCode = dialCodeMap[country.value] || '+1';
        return {
          code: country.value,
          name: country.label,
          dialCode: dialCode,
          flag: getFlagEmoji(country.value),
        };
      })
      .sort((a: CountryOption, b: CountryOption) =>
        a.name.localeCompare(b.name)
      );
  }, []);

  // Find current selected country or default to first one
  const selectedCountry =
    countryOptions.find(
      (country: CountryOption) => country.dialCode === countryCode
    ) || countryOptions[0];

  return (
    <div className={`flex gap-2 ${className}`}>
      {/* Country Code Select */}
      <div className="relative">
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          className="appearance-none w-32 px-4 py-3 pr-8 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80 text-sm font-medium cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 0.5rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
          }}
        >
          {countryOptions.map((country) => (
            <option key={country.code} value={country.dialCode}>
              {country.flag} {country.dialCode}
            </option>
          ))}
        </select>
      </div>

      {/* Phone Number Input */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange(e.target.value)}
        className="flex-1 px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
        placeholder={placeholder}
      />
    </div>
  );
};

export default PhoneInput;
