import { Head, Form } from '@inertiajs/react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';

export default function Login({ status }: { status?: string }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex w-full max-w-4xl">
                    
                    {/* Left Side - Welcome */}
                    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-[#051C55] to-[#14128E] text-white p-10">
                        <div className="mb-6">
                            <img 
                                src="/images/logokomet.png" 
                                alt="Logo" 
                                className="h-16"
                            />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Selamat Datang!</h2>
                        <p className="text-sm opacity-80">
                            Silahkan login untuk melanjutkan ke dashboard.
                        </p>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-1/2 flex justify-center items-center p-8">
                        <div className="w-full max-w-md">
                            {status && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    {status}
                                </div>
                            )}

                            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sign In</h3>

                            <Form
                                {...AuthenticatedSessionController.store.form()}
                                resetOnSuccess={['password']}
                                className="space-y-5"
                            >
                                {({ data = {}, setData, processing, errors }) => (
                                    <>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-[#FA921C] focus:ring-[#FA921C]"
                                                required
                                            />
                                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="mt-1 block w-full rounded-lg border-gray-300 px-4 py-2.5 shadow-sm focus:border-[#FA921C] focus:ring-[#FA921C]"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                                >
                                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <input
                                                id="remember"
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="rounded border-gray-300 text-[#FA921C] focus:ring-[#FA921C]"
                                            />
                                            <label htmlFor="remember" className="text-sm text-gray-600">
                                                Remember me
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#FA921C] to-[#D05100] hover:opacity-90 text-white font-semibold rounded-lg shadow-md transition"
                                        >
                                            {processing ? 'Logging in...' : 'Login'}
                                        </button>
                                         <p className="text-center text-sm text-gray-600 mt-4">
                                            Belum punya akun?{' '}
                                            <a href="/register" className="text-[#FA921C] hover:underline">
                                                Register di sini
                                            </a>
                                        </p>
                                    </>
                                )}
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
