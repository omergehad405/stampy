"use client";
import { useState } from "react";
import { MdOutlineMailOutline, MdLocalPhone } from "react-icons/md";
import { ImUser } from "react-icons/im";
// Replace these paths with your own images (files in /public)
const HERO_IMAGE = "/loginPageDesctop.png";
const ICONS = {
    cup: "/icons/cup.png",
    mail: "/icons/mail.png",
    lock: "/icons/lock.png",
    chevron: "/icons/chevron-down.png",
};

const inputBase =
    "w-full h-[42px] rounded-xl border border-[#e8dfca] bg-[#faf6ec] px-3 text-sm " +
    "text-(--mainColor) placeholder:text-(--mainColor)/45 outline-none transition " +
    "focus:border-(--secondColor) focus:ring-2 focus:ring-(--secondColor)/40";

function LoginPage() {
    const [form, setForm] = useState({
        fullName: "",
        countryCode: "+1",
        phone: "",
        email: "",
    });

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: call your sign-up API here
        console.log(form);
    };

    return (
        <main className="min-h-screen text-(--mainColor) lg:grid lg:grid-cols-[1fr_0.85fr]">
            {/* Left: form */}
            <section className="flex items-center justify-center px-5 py-8 sm:px-10 lg:px-16">
                <div className="w-full max-w-[420px]">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d3e0e8]">
                            <img src={ICONS.cup} alt="" className="h-4 w-4 object-contain" />
                        </span>
                        <span className="text-xs tracking-wide">ATELIER ROASTERY</span>
                    </div>

                    <h1 className="mt-5 text-[2rem] leading-[1.15] font-semibold sm:text-4xl">
                        Welcome to
                        <br />
                        Atelier Roastery
                    </h1>

                    <p className="mt-3 max-w-[340px] text-sm leading-relaxed text-(--mainColor)/80">
                        Join our loyalty program and enjoy exclusive rewards with every
                        visit.
                    </p>

                    {/* Mobile banner image */}
                    <img
                        src={HERO_IMAGE}
                        alt="Latte in a ceramic cup beside coffee beans"
                        className="mt-5 h-[130px] w-full rounded-2xl object-cover object-[50%_65%] shadow-sm lg:hidden"
                    />

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                        {/* Full name */}
                        <div>
                            <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 object-contain"><ImUser /></span>
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Enter your full name"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    className={`${inputBase} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold">
                                Phone Number
                            </label>
                            <div className="flex gap-2 relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 object-contain">
                                    <MdLocalPhone />
                                </span>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    autoComplete="tel-national"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className={`${inputBase} pl-10`}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-xs font-semibold">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 object-contain">
                                    <MdOutlineMailOutline />
                                </span>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Enter your email address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className={`${inputBase} pl-10`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 h-[42px] w-full cursor-pointer rounded-xl bg-(--secondColor) text-sm font-semibold text-(--mainColor)"
                        >
                            Sign Up Now
                        </button>

                        <p className="flex max-w-[300px] items-start gap-2 text-[11px] leading-snug text-(--mainColor)/75">
                            <img src={ICONS.lock} alt="" className="mt-0.5 h-3 w-3 shrink-0 object-contain" />
                            <span>
                                Your information is safe with us. We only use it to manage your
                                loyalty rewards.
                            </span>
                        </p>
                    </form>
                </div>
            </section>

            {/* Right: image panel (desktop only) */}
            <aside className="hidden bg-[#f7f2e6] p-4 lg:block">
                <div className="relative h-full min-h-[calc(100vh-2rem)] overflow-hidden rounded-2xl shadow-sm">
                    <img
                        src={HERO_IMAGE}
                        alt="Latte in a ceramic cup beside coffee beans"
                        className="absolute inset-0 h-full w-full rounded-2xl object-cover object-[50%_65%] shadow-sm"
                    />
                    <span className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-[#faf6ec]/90 px-4 py-2 text-xs backdrop-blur-sm">
                        Crafted daily · Earn rewards every cup
                    </span>
                </div>
            </aside>
        </main>
    );
}

export default LoginPage;