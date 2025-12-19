import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "gsap";
import { Send } from "lucide-react";
import MagneticButton from "./MagneticButton";
import PhoneInput from "./PhoneInput";

// Client-side only import to avoid SSR issues
let ScrollTrigger: any = null;

// Initialize GSAP plugins only on client side
if (typeof window !== "undefined") {
  import("gsap/ScrollTrigger").then((module) => {
    ScrollTrigger = module.default;
    gsap.registerPlugin(ScrollTrigger);
  });
}

interface FormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  year: string;
  location: string;
  story: string;
  language: string;
}

const StoryForm: React.FC = () => {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [scrollTriggerReady, setScrollTriggerReady] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    countryCode: "+1",
    phone: "",
    year: "",
    location: "",
    story: "",
    language: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for ScrollTrigger to load
    const checkScrollTriggerReady = () => {
      if (ScrollTrigger) {
        setScrollTriggerReady(true);
      } else {
        setTimeout(checkScrollTriggerReady, 50);
      }
    };

    checkScrollTriggerReady();
  }, []);

  useEffect(() => {
    if (!scrollTriggerReady || typeof window === "undefined") return;
    const form = formRef.current;
    if (!form) return;

    gsap.fromTo(
      form,
      {
        opacity: 0,
        y: 60,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: form,
          start: "top 80%",
          once: true,
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger: any) => {
        if (trigger.trigger === form) trigger.kill();
      });
    };
  }, [scrollTriggerReady]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryCodeChange = (dialCode: string) => {
    setFormData((prev) => ({
      ...prev,
      countryCode: dialCode,
    }));
  };

  const handlePhoneNumberChange = (phone: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: phone,
    }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      const response = await fetch("/api/contact", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setSubmitStatus({
        type: "success",
        message:
          t("tellYourStory.form.success") || "Message sent successfully!",
      });

      // Keep user on the form and make sure the status message is visible
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        countryCode: "+1",
        phone: "",
        year: "",
        location: "",
        story: "",
        language: "",
      });
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitStatus({
        type: "error",
        message:
          t("tellYourStory.form.error") ||
          "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-linear-to-br from-sky/5 via-orchid/5 to-banane/5 rounded-3xl blur-xl" />

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="relative bg-white/90 backdrop-blur-md rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-stone-200/50 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="group">
            <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
              {t("tellYourStory.form.name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
              placeholder={t("tellYourStory.form.placeholders.name")}
            />
          </div>

          {/* Email */}
          <div className="group">
            <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
              {t("tellYourStory.form.email")} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
              placeholder={t("tellYourStory.form.placeholders.email")}
            />
          </div>
          <div className="flex flex-col w-full">
            {/* Phone */}
            <div className="group">
              <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
                {t("tellYourStory.form.phone")}
              </label>
              <PhoneInput
                countryCode={formData.countryCode}
                phoneNumber={formData.phone}
                onCountryCodeChange={handleCountryCodeChange}
                onPhoneNumberChange={handlePhoneNumberChange}
                placeholder={t("tellYourStory.form.placeholders.phone")}
              />
            </div>

            {/* Age */}
            <div className="group mt-4">
              <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
                {t("tellYourStory.form.year")}
              </label>
              <input
                type="text"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
                placeholder={t("tellYourStory.form.placeholders.year")}
              />
            </div>
          </div>
          {/* Location */}
          <div className="group md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
              {t("tellYourStory.form.location")}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
              placeholder={t("tellYourStory.form.placeholders.location")}
            />
          </div>

          {/* Story */}
          <div className="group md:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
              {t("tellYourStory.form.story")}
            </label>
            <textarea
              name="story"
              value={formData.story}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80 resize-none"
              placeholder={t("tellYourStory.form.placeholders.story")}
            />
          </div>

          {/* Language Preference */}
          <div className="group">
            <label className="block text-sm font-medium text-stone-700 mb-2 group-focus-within:text-royal-blue transition-colors">
              {t("tellYourStory.form.language")} *
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:border-royal-blue focus:ring-2 focus:ring-royal-blue/20 transition-all duration-300 bg-white/80"
            >
              <option value="">
                {t("tellYourStory.form.languages.select")}
              </option>
              <option value="english">
                {t("tellYourStory.form.languages.english")}
              </option>
              <option value="french">
                {t("tellYourStory.form.languages.french")}
              </option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-12 py-4 text-lg font-medium flex items-center justify-center gap-4 bg-sky hover:bg-royal-blue transition-colors duration-200 cursor-pointer rounded-full text-white ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t("tellYourStory.form.submitting")}
              </>
            ) : (
              <>
                <Send size={20} />
                {t("tellYourStory.form.submit")}
              </>
            )}
          </button>

          {submitStatus.message && (
            <div
              className={`mt-4 p-4 rounded-xl ${submitStatus.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
                }`}
            >
              {submitStatus.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default StoryForm;
