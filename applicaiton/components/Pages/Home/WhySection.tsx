import Money from '@/img/Money.svg';
import Document from '@/img/Document.svg';
import Fire from '@/img/Fire.svg';
import Image from 'next/image';

export default function WhySection() {
    return (
        <div className='w-full h-auto py-20 flex flex-col justify-center items-center fade-in'>
            <h2 className='text-center px-5 sm:pl-0 text-3xl text-slate-900 font-bold mb-5'>Hvorfor Bruge Leaseon ?</h2>
            <p className='text-center px-5 sm:pl-0 text-50 text-sm text-slate-900'>Skal bilen snart på stilstand, eller vil du have drømmebilen til den bedst mulige pris.</p>
            <div className='w-full max-w-laptop h-auto py-20 flex flex-row gap-4 justify-center flex-wrap'>
                <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                    <Image src={Money} alt='money' className='w-9 h-9' />
                    <h3 className='text-lg text-slate-900 font-bold'>Spar Penge på udbetalingen</h3>
                    <p className='text-50 text-slate-900'>Vores salgspræmie funktion giver dig muligheden for at opnå de billigste leasingaftaler på nettet.</p>
                </div>
                <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                    <Image src={Document} alt='money' className='w-9 h-9' />
                    <h3 className='text-lg text-slate-900 font-bold'>Ny leasingtager på rekord tid</h3>
                    <p className='text-50 text-slate-900'>Tilknyt en salgspræmie, der gør tilbuddet mere attraktivt og øg chancen for et salg, salgspræmie er ikke påkrævet.</p>
                </div>
                <div className='px-5 sm:px-5 w-laptop-third-gap flex flex-col gap-2'>
                    <Image src={Fire} alt='money' className='w-9 h-9' />
                    <h3 className='text-lg text-slate-900 font-bold'>Spar penge på stilstand & Værditab</h3>
                    <p className='text-50 text-slate-900'>Salgspræmien skal ikke ses som en udgift, men som en besparelse på evt værditab ved salg til forhandler, eller stilstand af bilen.</p>
                </div>
            </div>
        </div>
    )
}