import Link from "next/link";

export default function AboutSection() {
    return (
        <div className='h-auto bg-white flex flex-row w-full self-center justify-center pb-36 px-2 sm:px-0 fade-in'>
            <div className='max-w-laptop flex-row flex gap-10 justify-center flex-wrap px-4 sm:px-0'>
                <div className='w-full sm:w-laptop-half-gap bg-indigo-50 p-10 rounded-xl gap-4 flex flex-col items-start'>
                    <h2 className='font-medium text-2xl'><span className='text-blue-500'>Leder du</span> efter en<br></br>
                        leasing bil ?</h2>
                    <p className='min-h-40'>Her på siden kan du finde private, der ønsker at afhænde deres leasingaftale, og nogle af dem tilbyder en præmie for overtagelsen, så du kan finde de billigste leasingtilbud i Danmark på vores side.</p>
                    <Link href="/biler" className="flex items-center px-6 py-3.5 bg-blue-600 text-white rounded-sm min-w-fit hover:opacity-80 transition ease-in duration-100 cursor-pointer gap-3">
                        Se alle biler
                        <svg width="18px" height="18px" viewBox="0 0 24 24" strokeWidth="1.5" fill="white" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </Link>
                </div>
                <div className='w-full sm:w-laptop-half-gap bg-pink-100 p-10 rounded-xl gap-4 flex flex-col justify-between items-start'>
                    <h2 className='font-medium text-2xl '>Skal du af med din Leasing aftale <span className='text-blue-500'>hurtigst muligt?</span></h2>
                    <p className='min-h-40'>Vi øger synligheden for dit tilbud ved at dele dine opslag i forskellige Facebook-grupper, hvilket kun er én af de metoder, vi bruger. Overvej at tilføje en overtagelses præmie for at gøre dit tilbud endnu mere attraktivt.</p>
                    <Link href="/dashboard/biler/opret" className="flex items-center px-6 py-3.5 bg-slate-900 text-white rounded-sm min-w-fit hover:opacity-80 transition ease-in duration-100 cursor-pointer gap-3">
                        Opret annonce
                        <svg width="18px" height="18px" viewBox="0 0 24 24" strokeWidth="1.5" fill="white" xmlns="http://www.w3.org/2000/svg" color="#ffffff"><path d="M6.00005 19L19 5.99996M19 5.99996V18.48M19 5.99996H6.52005" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    </Link>
                </div>
            </div>
        </div >
    );
}