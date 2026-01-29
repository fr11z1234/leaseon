export default function ShareSection() {
    return (
        <section className='flex flex-col justify-center items-center w-full pb-20 px-3'>
            <h2 className='text-center px-5  text-3xl text-slate-900 font-bold mb-5 fade-in'>Din annonce deles også på <span className='text-blue-500'>facebook</span></h2>
            <p className='text-center px-5 text-50 text-sm text-slate-900 fade-in max-w-[800px] hidden sm:block'>Vi har integreret med Facebook, så når du opretter en annonce på leaseon, bliver den uploadet til Facebook. Her gennemgås og godkendes annoncen, hvorefter den deles i flere grupper, der er relevante for leasingovertagelse, så undgå besværet og lad os komme af med din bil for dig. Vi arbejder konstant på at udvide vores integrationer og vil i fremtiden også dele annoncerne på flere medier -  <b className='text-blue-500'>helt gratis</b></p>
            <p className='text-center px-5 text-50 text-sm text-slate-900 fade-in max-w-[800px] block sm:hidden'>Vi slår den op på vores side, samt deler den i leasingovertagelses grupper -  <b className='text-blue-500'>helt gratis</b></p>
            <video className='fade-in' autoPlay muted loop playsInline src="/video/uploadvid.webm" />
        </section>
    );
}