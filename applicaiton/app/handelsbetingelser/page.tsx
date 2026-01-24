
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Leaseon.dk - Handelsbetingelser",
  description: "Læs og forstå handelsbetingelserne for Leaseon.dk",
};

export default function () {
  return (
    <main>
      <div className='w-full d-flex flex-row justify-center py-52 items-center'>
            <section className="bg-gray-100 text-gray-800 max-w-[700px] justify-center items-center d-flex flex-row align-self-center m-auto">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-xl font-bold text-center mb-6">Handelsbetingelser for Leaseon.dk</h1>
                    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="font-semibold text-lg">1. Formål og afgrænsning af ansvar</h2>
                        <p>Leaseon.dk er en platform, der har til formål udelukkende at eksponere tilbud og annoncer. Vi er ikke involveret i nogen transaktioner, pengeoverførsler, eller andre aspekter af handlen mellem køber og sælger. Leaseon.dk tager ikke ansvar for nogen aktiviteter, herunder køb, salg, bytte eller anden handel, der er igangsat, aftalt eller på anden måde forbundet med annoncer, opslag eller anden eksponering fundet på vores website, vores Facebook-side, eller andre medier ejet af Leaseon.dk.</p>

                        <h2 className="font-semibold text-lg mt-6">2. Brugerens ansvar</h2>
                        <p>Som bruger af Leaseon.dk er du fuldt ansvarlig for dine handlinger i forbindelse med brug af vores platform. Du bærer det fulde ansvar for at handle fornuftigt og sikre, at du ikke bliver udsat for svindel, bedrageri eller andre former for uretmæssige handlinger som følge af kontakt med en sælger på vores website.</p>

                        <h2 className="font-semibold text-lg mt-6">3. Overholdelse af regler og love</h2>
                        <p>Du (sælger, køber, annoncør) er ansvarlig for at overholde alle relevante love, regler og bestemmelser i forbindelse med de tilbud, du præsenterer på Leaseon.dk.</p>

                        <h2 className="font-semibold text-lg mt-6">4. Kontoansvarlighed</h2>
                        <p>Ved oprettelse af en konto på Leaseon.dk accepterer du disse handelsbetingelser og påtager dig fuldt ansvar for aktiviteter foretaget gennem din konto. Hvis du vælger at låne dit login ud eller på anden måde tillade andre at bruge din konto, er du ansvarlig for alle handlinger foretaget via denne konto.</p>

                        <h2 className="font-semibold text-lg mt-6">5. Ændringer i handelsbetingelser</h2>
                        <p>Leaseon.dk forbeholder sig retten til når som helst at ændre disse handelsbetingelser. Det er dit ansvar som bruger at holde dig opdateret med de nyeste versioner af disse betingelser.</p>
                    </div>
                </div>
            </section>


        </div>
    </main>
  );
}
