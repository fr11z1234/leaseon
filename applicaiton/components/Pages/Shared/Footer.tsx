import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-gray-900 px-6 border-solid border-t border-gray-100">
            <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0">
                    </div>
                    <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Følg os</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="https://www.facebook.com/profile.php?id=61557679391091" className="hover:underline">Facebook</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Betingelser</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="https://flowbite.com/" className="hover:underline">Privatlivspolitik</Link>
                                </li>
                                <li>
                                    <Link href="/handelsbetingelser" className="hover:underline">Handelsbetingelser</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Sitemap</h2>
                            <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                <li className="mb-4">
                                    <Link href="/dashboard/biler/opret" className="hover:underline">Opret annonce</Link>
                                </li>
                                <li className="mb-4">
                                    <Link prefetch={true} href="/biler" className="hover:underline">Se alle biler</Link>
                                </li>
                                <li className="mb-4">
                                    <Link href="/" className="hover:underline">Forside</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="https://flowbite.com/" className="hover:underline">Leaseon</a>. All Rights Reserved.
                    </span>
                    <div className="flex mt-4 sm:justify-center sm:mt-0">

                    </div>
                </div>
            </div>
        </footer>
    );
}