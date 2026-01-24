'use client';
import { listingStore } from "@/stores/ListingStore";

export default function () {
    const count = listingStore((state) => state.count);
    const page = listingStore((state) => state.search.page);
    const itemsPerPage = 12;
    const totalPages = Math.ceil(count / itemsPerPage);
    const maxPageLinks = 12;

    const setPage = (page: number) => {
        listingStore.setState({ search: { ...listingStore.getState().search, page } });
    }

    const pagelinks = () => {
        const pl = [];

        if (totalPages <= maxPageLinks) {
            for (let i = 1; i <= totalPages; i++) {
                pl.push(renderPageLink(i));
            }
        } else {
            const sideLinksCount = Math.floor((maxPageLinks - 3) / 2);
            const startPage = Math.max(1, page - sideLinksCount);
            const endPage = Math.min(totalPages, startPage + maxPageLinks - 3);

            if (startPage > 1) {
                pl.push(renderPageLink(1));
                if (startPage > 2) {
                    pl.push(renderEllipsis());
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                pl.push(renderPageLink(i));
            }

            if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                    pl.push(renderEllipsis());
                }
                pl.push(renderPageLink(totalPages));
            }
        }
        return pl;
    };

    const renderPageLink = (pageNumber: number) => (
        <div
            key={pageNumber}
            className={`relative hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold cursor-pointer ${page === pageNumber ? 'bg-indigo-600 hover:bg-indigo-600 border-indigo-600 ring-indigo-600 text-white' : 'text-gray-900'} ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0`}
            onClick={() => listingStore.setState({ search: { ...listingStore.getState().search, page: pageNumber } })}
        >
            {pageNumber}
        </div>
    );

    const renderEllipsis = () => (
        <span key="ellipsis" className="relative hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
    );

    return (
        <div className="flex items-center justify-between py-3 sm:px-6">

            <div className="flex flex-1 items-center justify-between">
                <nav className="isolate w-full inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <div className="relative cursor-pointer inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" onClick={() => { if (page === 1) return; setPage(page - 1) }}>
                        <span className={"sr-only" + (page === 1 ? ' opacity-30' : '')}></span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                        </svg>
                    </div>

                    {pagelinks()}

                    <div className="relative cursor-pointer inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0" onClick={() => { if (page === Math.ceil(count / 12)) return; setPage(page + 1) }}>
                        <span className={"sr-only" + (page === Math.ceil(count / 12) ? ' opacity-30' : '')}></span>
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                        </svg>
                    </div>
                </nav>
            </div>
        </div>
    )
}